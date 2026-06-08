import { useState } from 'react'

interface AIAnalysisResult {
  analisis: string
  prediksi: string
  faktorRisiko: string
  loading: boolean
  error: string | null
}

export function useAIAnalysis() {
  const [result, setResult] = useState<AIAnalysisResult>({
    analisis: '',
    prediksi: '',
    faktorRisiko: '',
    loading: false,
    error: null
  })

  async function analyze(
    komoditas: string,
    provinsi: string,
    hargaTerkini: number,
    hargaData: Array<{ date: string; price: number }>,
    bulan: number
  ) {
    setResult(prev => ({ ...prev, loading: true, error: null }))

    const bulanNama = ['Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'][bulan]

    // Hitung statistik dari data historis
    const prices = hargaData.map(d => d.price)
    const avgPrice = Math.round(prices.reduce((a,b) => a+b, 0) / prices.length)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const firstPrice = prices[0]
    const trendPct = ((hargaTerkini - firstPrice) / firstPrice * 100).toFixed(1)

    const prompt = `Kamu adalah analis harga pangan Indonesia yang ahli dalam ekonomi pertanian.

Analisis data harga berikut dan berikan insight dalam Bahasa Indonesia:

Komoditas: ${komoditas}
Provinsi: ${provinsi}
Bulan saat ini: ${bulanNama}
Harga terkini: Rp ${hargaTerkini.toLocaleString('id-ID')}/kg
Harga rata-rata periode ini: Rp ${avgPrice.toLocaleString('id-ID')}/kg
Harga terendah: Rp ${minPrice.toLocaleString('id-ID')}/kg
Harga tertinggi: Rp ${maxPrice.toLocaleString('id-ID')}/kg
Tren: ${Number(trendPct) > 0 ? '+' : ''}${trendPct}% dari awal periode

Berikan analisis dalam format JSON berikut (tanpa markdown, langsung JSON):
{
  "analisis": "2-3 kalimat analisis kondisi harga saat ini berdasarkan data",
  "prediksi": "2-3 kalimat prediksi harga 2 minggu ke depan dengan mempertimbangkan musim dan hari besar di bulan ${bulanNama}",
  "faktorRisiko": "2-3 kalimat faktor risiko yang bisa pengaruhi harga"
}`

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 500
        })
      })

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content ?? ''

      // Parse JSON response
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      setResult({
        analisis: parsed.analisis ?? '',
        prediksi: parsed.prediksi ?? '',
        faktorRisiko: parsed.faktorRisiko ?? '',
        loading: false,
        error: null
      })
    } catch (err) {
      setResult(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat analisis AI. Coba lagi.'
      }))
    }
  }

  return { ...result, analyze }
}