import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface PricePoint {
  date: string
  price: number
  isPrediction: boolean
}

export type ChartMode = 'week' | 'month' | 'year'

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

      // Ambil tanggal TERBARU yang ada di dataset (bukan new Date())
      const { data: latestRow } = await supabase
        .from('database_pangan_indonesia')
        .select('Tanggal')
        .eq('Komoditas', komoditas)
        .eq('Provinsi', provinsi)
        .order('Tanggal', { ascending: false })
        .limit(1)

      if (!latestRow || latestRow.length === 0) { setLoading(false); return }

      const latestDate = new Date(latestRow[0].Tanggal)

      // Tentukan range historis dan prediksi berdasarkan mode
      let histDays: number
      let predDays: number

      if (mode === 'week') {
        histDays = 6
        predDays = 1
      } else if (mode === 'month') {
        histDays = 23
        predDays = 7
      } else {
        // year: 10 bulan historis + 2 bulan prediksi
        histDays = 300
        predDays = 60
      }

      // Hitung fromDate mundur dari latestDate
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

      if (error || !rows) { setLoading(false); return }

      const historical: PricePoint[] = rows.map((r) => ({
        date: r.Tanggal.slice(5), // format MM-DD
        price: Math.round(r.Harga),
        isPrediction: false,
      }))

      // Hitung prediksi pakai rata-rata tren dari data historis
      const last7 = historical.slice(-7)
      const avgChange = last7.length > 1
        ? (last7[last7.length - 1].price - last7[0].price) / last7.length
        : 0

      const predictions: PricePoint[] = []
      for (let i = 1; i <= predDays; i++) {
        // Pakai latestDate sebagai acuan, bukan new Date()
        const d = new Date(latestDate)
        d.setDate(d.getDate() + i)
        const label = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const lastPrice = i === 1
          ? historical[historical.length - 1]?.price ?? 0
          : predictions[i - 2].price
        predictions.push({
          date: label,
          price: Math.round(lastPrice + avgChange),
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