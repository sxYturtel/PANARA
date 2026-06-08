export async function getPrediction(
  komoditas: string,
  provinsi: string
) {
  const today = new Date().toISOString().split("T")[0]

  const response = await fetch(
    `http://127.0.0.1:8000/predict?komoditas=${encodeURIComponent(komoditas)}&provinsi=${encodeURIComponent(provinsi)}&tanggal=${today}`
  )

  return await response.json()
}