import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { usePriceHistory, ChartMode } from "../../hooks/usePriceHistory";
import { getPrediction } from "../../hooks/usePrediction";

interface CommodityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity: {
    name: string;
    price: number;
    unit: string;
    change: number;
    icon: string;
    city: string;
  } | null;
}

export function CommodityDetailModal({ isOpen, onClose, commodity }: CommodityDetailModalProps) {
  const [chartMode, setChartMode] = useState<ChartMode>('month')
  const { data: trendData } = usePriceHistory(commodity?.name ?? null, commodity?.city ?? null, chartMode)
  const [prediksiAI, setPrediksiAI] = useState<number | null>(null)
const [aiLoading, setAiLoading] = useState(false)
const [aiError, setAiError] = useState<string | null>(null)
 
async function handlePrediction() {
  try {
    setAiLoading(true)
    setAiError(null)

    const data = await getPrediction(
      commodity!.name,
      commodity!.city
    )

    setPrediksiAI(data.prediksi)

  } catch (error) {
    setAiError("Gagal mengambil prediksi AI")
  } finally {
    setAiLoading(false)
  }
}

  if (!commodity) return null;

  const isPositive = commodity.change > 0;
  const historicalData = trendData.filter(d => !d.isPrediction);

  const chartData = trendData.map((item, index) => {
    if (item.isPrediction) {
      return { date: item.date, priceHistorical: null, pricePrediction: item.price }
    } else {
      const isLast = index === historicalData.length - 1;
      return { date: item.date, priceHistorical: item.price, pricePrediction: isLast ? item.price : null }
    }
  });

  const modeLabel = { week: '1 Minggu', month: '1 Bulan', year: '1 Tahun' }
  const modeDesc = {
    week: '5 hari historis + 2 hari prediksi',
    month: '3 minggu historis + 1 minggu prediksi',
    year: '10 bulan historis + 2 bulan prediksi'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-4xl">{commodity.icon}</span>
            <div>
              <div className="text-xl">{commodity.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-normal mt-1">
                <MapPin className="w-4 h-4" />
                <span>{commodity.city}</span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Tren pergerakan harga {commodity.name} di {commodity.city}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Harga Saat Ini */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Harga Saat Ini</p>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl font-bold text-green-700">
                Rp {commodity.price.toLocaleString('id-ID')}
              </span>
              <span className="text-xl text-gray-600">/{commodity.unit}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              isPositive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{commodity.change}% dari bulan lalu</span>
            </div>
          </div>

          {/* Toggle Mode Grafik */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">Tren Harga — {modeLabel[chartMode]}</h3>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(['week', 'month', 'year'] as ChartMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setChartMode(m)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      chartMode === m ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {modeLabel[m]}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">{modeDesc[chartMode]}</p>
            <div className="flex gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-600"></div>
                <span className="text-gray-600">Data Historis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-amber-500"></div>
                <span className="text-gray-600">Prediksi</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '11px' }} interval="preserveStartEnd" minTickGap={20} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px' }}
                  formatter={(value: number, name: string) => {
                    if (!value) return null;
                    return [`Rp ${value.toLocaleString('id-ID')}`, name === 'priceHistorical' ? 'Harga Historis' : 'Prediksi Harga'];
                  }}
                />
                <Line type="monotone" dataKey="priceHistorical" stroke="#16a34a" strokeWidth={3}
                  dot={(props: any) => {
                    const { cx, cy, index } = props;
                    if (index === historicalData.length - 1) {
                      return <circle key={index} cx={cx} cy={cy} r={6} fill="#16a34a" stroke="#fff" strokeWidth={2} />;
                    }
                    return <g key={index} />;
                  }}
                  activeDot={{ r: 6 }} connectNulls={false}
                />
                <Line type="monotone" dataKey="pricePrediction" stroke="#f59e0b" strokeWidth={3}
                  strokeDasharray="8 4" strokeOpacity={0.6} dot={false}
                  activeDot={{ r: 6, fill: '#f59e0b' }} connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Analisis AI */}
          <div className="border border-green-200 rounded-xl overflow-hidden">
            <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">🤖 Analisis AI</span>
              </div>
              <button
                onClick={handlePrediction}
                disabled={aiLoading}
                className="bg-white text-green-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-50 disabled:opacity-50 transition-all"
              >
                 {aiLoading ? "Memproses..." : "Prediksi AI"}
              </button>
            </div>
                
            {aiError && <div className="p-4 text-red-600 text-sm">{aiError}</div>}

            {!prediksiAI && !aiLoading && !aiError && (
              <div className="p-4 text-gray-400 text-sm text-center">
                Klik "Analisis Sekarang" untuk mendapatkan insight AI tentang harga ini
              </div>
            )}

            {prediksiAI && (
             <div className="p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                  🔮 Prediksi Harga AI
                </p>

                <p className="text-2xl font-bold text-green-700">
                  Rp {prediksiAI.toLocaleString("id-ID")}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Prediksi harga berdasarkan model XGBoost yang dilatih menggunakan data historis komoditas pangan.
                </p>
              </div>
            )}
         {/* Info */}
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 Info:</strong> Harga dapat bervariasi antar pasar dan toko. Data ini merupakan rata-rata dari berbagai sumber di {commodity.city}.
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-amber-900">
                <strong>🔮 Prediksi:</strong> Prediksi dihitung berdasarkan tren historis. Harga aktual dapat berbeda dari prediksi.
              </p>
            </div>
          </div>
        </div>
        </div> 
      </DialogContent>
    </Dialog>
  );
}