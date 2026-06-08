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

  function analyze(
    komoditas: string,
    provinsi: string,
    hargaTerkini: number,
    hargaData: Array<{ date: string; price: number }>
  ) {
    setResult(prev => ({ ...prev, loading: true }))

    const prices = hargaData.map(d => d.price)

    const avg =
      prices.reduce((a, b) => a + b, 0) /
      prices.length

    const trend =
      ((hargaTerkini - prices[0]) /
        prices[0]) *
      100

    let kondisi = ''
    let prediksi = ''
    let risiko = ''

<<<<<<< HEAD
    if (trend > 5) {
      kondisi =
        `Harga ${komoditas} di ${provinsi} menunjukkan tren kenaikan sebesar ${trend.toFixed(1)}%.`
      prediksi =
        'Jika tren berlanjut, harga berpotensi naik dalam beberapa minggu ke depan.'
    } else if (trend < -5) {
      kondisi =
        `Harga ${komoditas} di ${provinsi} mengalami penurunan sebesar ${Math.abs(trend).toFixed(1)}%.`
      prediksi =
        'Harga diperkirakan tetap stabil atau sedikit menurun.'
    } else {
      kondisi =
        `Harga ${komoditas} relatif stabil dibanding periode sebelumnya.`
      prediksi =
        'Harga diperkirakan bergerak dalam rentang yang tidak jauh berbeda.'
=======
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
          model: 'llama-3.3-70b-versatile',
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
>>>>>>> 5c120f2af5c06830eb7a9ea9903fa8a6a838dc8c
    }

    risiko =
      'Perubahan cuaca, distribusi, dan pasokan dapat memengaruhi harga di masa mendatang.'

    setResult({
      analisis: kondisi,
      prediksi,
      faktorRisiko: risiko,
      loading: false,
      error: null
    })
  }

<<<<<<< HEAD
  return {
    ...result,
    analyze
  }
}
=======
  return { ...result, analyze }
}
>>>>>>> 5c120f2af5c06830eb7a9ea9903fa8a6a838dc8c
