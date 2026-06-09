const HF_API = 'https://peenapel-panara.hf.space'

export async function getPrediction(komoditas: string, provinsi: string) {
  const tomorrow = new Date('2024-09-30')
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tanggal = tomorrow.toISOString().split('T')[0]

  const res = await fetch(
    `${HF_API}/predict?komoditas=${encodeURIComponent(komoditas)}&provinsi=${encodeURIComponent(provinsi)}&tanggal=${tanggal}`
  )

  if (!res.ok) throw new Error('Gagal koneksi ke API')

  const data = await res.json()
  if (data.error) throw new Error(data.error)

  return { prediksi: data.prediksi }
}