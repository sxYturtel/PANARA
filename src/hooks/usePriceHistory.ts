import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface PricePoint {
  date: string
  price: number
  isPrediction: boolean
}

export type ChartMode = 'week' | 'month' | 'year'

// Volatilitas historis per komoditas (std % harian, dari analisis dataset)
const VOLATILITY: Record<string, number> = {
  'Cabai Rawit Merah': 0.060,
  'Cabai Merah Keriting': 0.046,
  'Bawang Merah': 0.028,
  'Daging Ayam Ras': 0.020,
  'Telur Ayam Ras': 0.018,
  'Tepung Terigu (Curah)': 0.016,
  'Daging Sapi Murni': 0.013,
  'Beras Medium': 0.010,
  'Beras Premium': 0.009,
  'Gula Konsumsi': 0.009,
}

// Pola musiman per komoditas per bulan (% perubahan rata-rata harian dari data)
const SEASONAL: Record<string, number[]> = {
  'Bawang Merah':        [0.097, 0.137, -0.060, 0.633, 0.039, -0.045, -0.736, -0.600, -0.017, 0.056, 0.460, 0.433],
  'Cabai Merah Keriting':[-0.333, 0.857, -0.367, 0.145, 0.156, 0.602, -0.172, -0.014, -0.398, 0.024, 0.300, -0.006],
  'Cabai Rawit Merah':   [-0.333, 0.857, -0.367, 0.145, 0.156, 0.602, -0.172, -0.014, -0.398, 0.024, 0.300, -0.006],
  'Daging Ayam Ras':     [-0.087, 0.013, 0.078, 0.204, -0.032, 0.089, -0.198, -0.019, -0.026, 0.003, 0.030, 0.212],
  'Beras Premium':       [0.032, 0.103, 0.014, -0.030, -0.015, 0.004, 0.008, 0.040, 0.085, 0.027, 0.020, 0.046],
  'Beras Medium':        [0.032, 0.103, 0.014, -0.030, -0.015, 0.004, 0.008, 0.040, 0.085, 0.027, 0.020, 0.046],
  'Daging Sapi Murni':   [0.010, 0.020, 0.050, 0.150, -0.010, 0.040, -0.100, -0.010, -0.010, 0.010, 0.020, 0.150],
  'Telur Ayam Ras':      [-0.010, 0.020, 0.060, 0.120, -0.020, 0.050, -0.080, -0.010, -0.010, 0.010, 0.020, 0.100],
  'Gula Konsumsi':       [0.020, 0.030, 0.020, 0.010, -0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030],
  'Tepung Terigu (Curah)':[0.015, 0.025, 0.015, 0.010, -0.005, 0.010, 0.005, 0.010, 0.015, 0.015, 0.015, 0.025],
}

// Hari besar Indonesia yang pengaruhi harga (bulan, tanggal, komoditas terpengaruh, multiplier)
const HOLIDAYS = [
  { month: 1, day: 1, commodities: ['Daging Ayam Ras', 'Daging Sapi Murni', 'Telur Ayam Ras'], multiplier: 1.05 },   // Tahun Baru
  { month: 3, day: 20, commodities: ['Bawang Merah', 'Cabai Merah Keriting', 'Cabai Rawit Merah', 'Daging Ayam Ras', 'Daging Sapi Murni'], multiplier: 1.08 }, // Ramadan (approx)
  { month: 4, day: 10, commodities: ['Bawang Merah', 'Cabai Merah Keriting', 'Daging Ayam Ras', 'Daging Sapi Murni', 'Telur Ayam Ras'], multiplier: 1.12 },    // Lebaran (approx)
  { month: 6, day: 17, commodities: ['Daging Sapi Murni', 'Bawang Merah'], multiplier: 1.06 },  // Idul Adha (approx)
  { month: 12, day: 25, commodities: ['Daging Ayam Ras', 'Daging Sapi Murni', 'Telur Ayam Ras', 'Beras Premium'], multiplier: 1.05 }, // Natal
]

function getHolidayMultiplier(komoditas: string, date: Date): number {
  let multiplier = 1.0
  for (const holiday of HOLIDAYS) {
    const daysUntil = Math.abs(
      (date.getTime() - new Date(date.getFullYear(), holiday.month - 1, holiday.day).getTime())
      / (1000 * 60 * 60 * 24)
    )
    if (daysUntil <= 14 && holiday.commodities.includes(komoditas)) {
      // Pengaruh hari besar makin kuat makin dekat (max 14 hari sebelum/sesudah)
      const proximity = 1 - (daysUntil / 14)
      multiplier *= 1 + (holiday.multiplier - 1) * proximity
    }
  }
  return multiplier
}

function exponentialSmoothing(prices: number[], alpha: number): number[] {
  const smoothed = [prices[0]]
  for (let i = 1; i < prices.length; i++) {
    smoothed.push(alpha * prices[i] + (1 - alpha) * smoothed[i - 1])
  }
  return smoothed
}

function predictPrice(
  komoditas: string,
  historicalPrices: number[],
  lastDate: Date,
  daysAhead: number
): number {
  // 1. Bersihkan outlier pakai IQR
  const sorted = [...historicalPrices].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const iqr = q3 - q1
  const clean = historicalPrices.filter(p => p >= q1 - 1.5 * iqr && p <= q3 + 1.5 * iqr)

  // 2. Exponential smoothing — alpha sesuai volatilitas komoditas
  const vol = VOLATILITY[komoditas] ?? 0.015
  const alpha = Math.min(0.4, Math.max(0.1, vol * 5)) // komoditas volatile = alpha lebih tinggi
  const smoothed = exponentialSmoothing(clean, alpha)
  const smoothedLast = smoothed[smoothed.length - 1]

  // 3. Hitung tren jangka pendek (7 hari) dan panjang (30 hari)
  const recent7 = clean.slice(-7)
  const recent30 = clean.slice(-30)
  const shortTrend = recent7.length > 1
    ? (recent7[recent7.length - 1] - recent7[0]) / recent7.length
    : 0
  const longTrend = recent30.length > 1
    ? (recent30[recent30.length - 1] - recent30[0]) / recent30.length
    : 0

  // Blend tren: short term lebih berpengaruh di dekat, long term di jauh
  const shortWeight = Math.max(0, 1 - daysAhead / 30)
  const blendedTrend = shortTrend * shortWeight + longTrend * (1 - shortWeight)

  // 4. Faktor musiman dari data historis
  const targetDate = new Date(lastDate)
  targetDate.setDate(targetDate.getDate() + daysAhead)
  const targetMonth = targetDate.getMonth() // 0-indexed
  const seasonalFactor = (SEASONAL[komoditas]?.[targetMonth] ?? 0) / 100

  // 5. Faktor hari besar
  const holidayMultiplier = getHolidayMultiplier(komoditas, targetDate)

  // 6. Mean reversion — harga cenderung balik ke rata-rata jangka panjang
  const longTermMean = clean.reduce((a, b) => a + b, 0) / clean.length
  const meanReversionStrength = 0.05 // 5% pull per hari prediksi
  const meanReversionForce = (longTermMean - smoothedLast) * meanReversionStrength * (daysAhead / 30)

  // 7. Gabungkan semua faktor
  const baseChange = blendedTrend * daysAhead
  const seasonalChange = smoothedLast * seasonalFactor * daysAhead
  const predicted = (smoothedLast + baseChange + seasonalChange + meanReversionForce) * holidayMultiplier

  // 8. Batasi perubahan maksimal sesuai volatilitas historis komoditas (3 sigma rule)
  const maxChange = smoothedLast * vol * 3 * Math.sqrt(daysAhead)
  const clamped = Math.max(smoothedLast - maxChange, Math.min(smoothedLast + maxChange, predicted))

  return Math.round(clamped)
}

export function usePriceHistory(
  komoditas: string | null,
  provinsi: string | null,
  mode: ChartMode = 'month'
) {
  const [data, setData] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!komoditas || !provinsi) return

    async function fetch() {
      setLoading(true)

      // Ambil tanggal terbaru di dataset
      const { data: latestRow } = await supabase
        .from('database_pangan_indonesia')
        .select('Tanggal')
        .eq('Komoditas', komoditas)
        .eq('Provinsi', provinsi)
        .order('Tanggal', { ascending: false })
        .limit(1)

      if (!latestRow || latestRow.length === 0) { setLoading(false); return }

      const latestDate = new Date(latestRow[0].Tanggal)

      // Tentukan range historis dan prediksi per mode
      let histDays: number
      let predDays: number

      if (mode === 'week') {
        histDays = 5
        predDays = 2
      } else if (mode === 'month') {
        histDays = 23
        predDays = 7
      } else {
        histDays = 300  // ~10 bulan
        predDays = 60   // ~2 bulan
      }

      const fromDate = new Date(latestDate)
      fromDate.setDate(fromDate.getDate() - histDays)
      const fromDateStr = fromDate.toISOString().split('T')[0]
      const latestDateStr = latestDate.toISOString().split('T')[0]

      const { data: rows, error } = await supabase
        .from('database_pangan_indonesia')
        .select('Tanggal, Harga')
        .eq('Komoditas', komoditas)
        .eq('Provinsi', provinsi)
        .gte('Tanggal', fromDateStr)
        .lte('Tanggal', latestDateStr)
        .order('Tanggal', { ascending: true })

      if (error || !rows || rows.length === 0) { setLoading(false); return }

      const historical: PricePoint[] = rows.map((r) => ({
        date: r.Tanggal.slice(5),
        price: Math.round(r.Harga),
        isPrediction: false,
      }))

      // Ambil lebih banyak data historis untuk prediksi yang akurat (min 90 hari)
      const { data: longRows } = await supabase
        .from('database_pangan_indonesia')
        .select('Harga')
        .eq('Komoditas', komoditas)
        .eq('Provinsi', provinsi)
        .order('Tanggal', { ascending: false })
        .limit(90)

      const longPrices = (longRows ?? []).map(r => r.Harga).reverse()
      const basePrices = longPrices.length > 0 ? longPrices : historical.map(h => h.price)

      // Generate prediksi
      const predictions: PricePoint[] = []
      for (let i = 1; i <= predDays; i++) {
        const d = new Date(latestDate)
        d.setDate(d.getDate() + i)
        const label = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

        const predictedPrice = predictPrice(komoditas, basePrices, latestDate, i)

        predictions.push({
          date: label,
          price: predictedPrice,
          isPrediction: true,
        })
      }

      setData([...historical, ...predictions])
      setLoading(false)
    }

    fetch()
  }, [komoditas, provinsi, mode])

  return { data, loading }
}