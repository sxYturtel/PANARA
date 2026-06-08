import SLR from 'ml-regression-simple-linear'

export function predictPrice(
  hargaData: Array<{ date: string; price: number }>
) {
  const x = hargaData.map((_, index) => index)
  const y = hargaData.map(item => item.price)

  const regression = new SLR(x, y)

  const nextDay = hargaData.length

  const prediction = regression.predict(nextDay)

  return Math.round(prediction)
}