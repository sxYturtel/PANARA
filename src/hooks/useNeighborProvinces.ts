import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Mapping provinsi ke tetangganya
const NEIGHBORS: Record<string, string[]> = {
  'Aceh': ['Sumatera Utara'],
  'Sumatera Utara': ['Aceh', 'Sumatera Barat', 'Riau'],
  'Sumatera Barat': ['Sumatera Utara', 'Riau', 'Jambi', 'Bengkulu'],
  'Riau': ['Sumatera Utara', 'Sumatera Barat', 'Jambi'],
  'Kepulauan Riau': ['Riau'],
  'Jambi': ['Riau', 'Sumatera Barat', 'Bengkulu', 'Sumatera Selatan'],
  'Bengkulu': ['Sumatera Barat', 'Jambi', 'Sumatera Selatan', 'Lampung'],
  'Sumatera Selatan': ['Jambi', 'Bengkulu', 'Lampung', 'Bangka Belitung'],
  'Bangka Belitung': ['Sumatera Selatan'],
  'Lampung': ['Bengkulu', 'Sumatera Selatan', 'Banten'],
  'Banten': ['Lampung', 'DKI Jakarta', 'Jawa Barat'],
  'DKI Jakarta': ['Banten', 'Jawa Barat'],
  'Jawa Barat': ['Banten', 'DKI Jakarta', 'Jawa Tengah'],
  'Jawa Tengah': ['Jawa Barat', 'DI Yogyakarta', 'Jawa Timur'],
  'DI Yogyakarta': ['Jawa Tengah', 'Jawa Timur'],
  'Jawa Timur': ['Jawa Tengah', 'DI Yogyakarta', 'Bali'],
  'Bali': ['Jawa Timur', 'Nusa Tenggara Barat'],
  'Nusa Tenggara Barat': ['Bali', 'Nusa Tenggara Timur'],
  'Nusa Tenggara Timur': ['Nusa Tenggara Barat'],
  'Kalimantan Barat': ['Kalimantan Tengah'],
  'Kalimantan Tengah': ['Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Timur'],
  'Kalimantan Selatan': ['Kalimantan Tengah', 'Kalimantan Timur'],
  'Kalimantan Timur': ['Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Utara'],
  'Kalimantan Utara': ['Kalimantan Timur'],
  'Sulawesi Utara': ['Gorontalo'],
  'Gorontalo': ['Sulawesi Utara', 'Sulawesi Tengah'],
  'Sulawesi Tengah': ['Gorontalo', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara'],
  'Sulawesi Barat': ['Sulawesi Tengah', 'Sulawesi Selatan'],
  'Sulawesi Selatan': ['Sulawesi Barat', 'Sulawesi Tengah', 'Sulawesi Tenggara'],
  'Sulawesi Tenggara': ['Sulawesi Tengah', 'Sulawesi Selatan'],
  'Maluku': ['Maluku Utara'],
  'Maluku Utara': ['Maluku'],
  'Papua Barat': ['Papua'],
  'Papua': ['Papua Barat'],
}

export interface NeighborPrice {
  provinsi: string
  price: number
  change: number
}

export function useNeighborProvinces(komoditas: string | null, provinsi: string | null) {
  const [neighbors, setNeighbors] = useState<NeighborPrice[]>([])

  useEffect(() => {
    if (!komoditas || !provinsi) return

    async function fetch() {
      const neighborList = NEIGHBORS[provinsi!] ?? []
      if (neighborList.length === 0) return

      // Ambil tanggal terbaru
      const { data: latestRow } = await supabase
        .from('database_pangan_indonesia')
        .select('Tanggal')
        .eq('Komoditas', komoditas)
        .order('Tanggal', { ascending: false })
        .limit(1)

      if (!latestRow || latestRow.length === 0) return

      const latestDate = latestRow[0].Tanggal
      const oneMonthAgo = new Date(latestDate)
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0]

      // Ambil harga terbaru untuk semua provinsi tetangga sekaligus
      const { data: latestData } = await supabase
        .from('database_pangan_indonesia')
        .select('Provinsi, Harga')
        .eq('Komoditas', komoditas)
        .eq('Tanggal', latestDate)
        .in('Provinsi', neighborList)

      const { data: oldData } = await supabase
        .from('database_pangan_indonesia')
        .select('Provinsi, Harga')
        .eq('Komoditas', komoditas)
        .eq('Tanggal', oneMonthAgoStr)
        .in('Provinsi', neighborList)

      if (!latestData) return

      const oldMap = new Map<string, number>()
      for (const row of (oldData ?? [])) {
        oldMap.set(row.Provinsi, row.Harga)
      }

      const result: NeighborPrice[] = latestData.map((row) => {
        const hargaLama = oldMap.get(row.Provinsi)
        const change = hargaLama
          ? parseFloat((((row.Harga - hargaLama) / hargaLama) * 100).toFixed(1))
          : 0
        return { provinsi: row.Provinsi, price: row.Harga, change }
      })

      setNeighbors(result)
    }

    fetch()
  }, [komoditas, provinsi])

  return { neighbors }
}