const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getPrediction(
  komoditas: string,
  provinsi: string
) {
  const today = new Date().toISOString().split("T")[0]

  try {
    const response = await fetch(
      `${API_BASE_URL}/predict?komoditas=${encodeURIComponent(komoditas)}&provinsi=${encodeURIComponent(provinsi)}&tanggal=${today}`
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Prediction API Error:', error)
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Gagal mengambil prediksi dari AI'
    )
  }
}
