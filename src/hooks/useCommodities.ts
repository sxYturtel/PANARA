import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CommodityWithPrice } from '../types'

const ICONS: Record<string, string> = {
  'Beras Premium': '🌾',
  'Beras Medium': '🍚',
  'Gula Konsumsi': '🧂',
  'Daging Ayam Ras': '🍗',
  'Daging Sapi Murni': '🥩',
  'Telur Ayam Ras': '🥚',
  'Cabai Merah Keriting': '🌶️',
  'Cabai Rawit Merah': '🌶️',
  'Bawang Merah': '🧅',
  'Tepung Terigu (Curah)': '🌾',
}

export function useCommodities(provinsi: string | null) {
  const [commodities, setCommodities] = useState<CommodityWithPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!provinsi) return

    async function fetch() {
      setLoading(true)

      // Ambil tanggal terbaru dulu
      const { data: latestRow } = await supabase
        .from('database_pangan_indonesia')
        .select('Tanggal')
        .eq('Provinsi', provinsi)
        .order('Tanggal', { ascending: false })
        .limit(1)

      if (!latestRow || latestRow.length === 0) { setLoading(false); return }

      const latestDate = latestRow[0].Tanggal

      // Hitung tanggal 1 bulan sebelumnya
      const oneMonthAgo = new Date(latestDate)
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0]

      // Query harga terbaru per komoditas
      const { data: latestData } = await supabase
        .from('database_pangan_indonesia')
        .select('Komoditas, Harga')
        .eq('Provinsi', provinsi)
        .eq('Tanggal', latestDate)

      // Query harga bulan lalu per komoditas
      const { data: oldData } = await supabase
        .from('database_pangan_indonesia')
        .select('Komoditas, Harga')
        .eq('Provinsi', provinsi)
        .eq('Tanggal', oneMonthAgoStr)

      if (!latestData) { setLoading(false); return }

      // Bikin map harga lama
      const oldMap = new Map<string, number>()
      for (const row of (oldData ?? [])) {
        oldMap.set(row.Komoditas, row.Harga)
      }

      // Susun hasil — konversi harga x10 (per 100gr → per kg)
      const result: CommodityWithPrice[] = latestData.map((row) => {
        const harga = Math.round(row.Harga )
        const hargaLama = oldMap.get(row.Komoditas)
        const hargaLamaKg = hargaLama ? Math.round(hargaLama) : null
        const change = hargaLamaKg
          ? parseFloat((((harga - hargaLamaKg) / hargaLamaKg) * 100).toFixed(1))
          : 0

        return {
          name: row.Komoditas,
          icon: ICONS[row.Komoditas] ?? '📦',
          unit: 'kg',
          price: harga,
          change,
        }
      })

      setCommodities(result)
      setLoading(false)
    }

    fetch()
  }, [provinsi])

  return { commodities, loading }
}