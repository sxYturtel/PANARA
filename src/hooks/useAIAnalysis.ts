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

  return {
    ...result,
    analyze
  }
}