import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, TrendingUp, TrendingDown } from "lucide-react";
import { usePriceHistory, ChartMode } from "../../hooks/usePriceHistory";
import { useNeighborProvinces } from "../../hooks/useNeighborProvinces";

interface FarmerPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity: {
    name: string;
    icon: string;
    unit: string;
    price: number;
    change: number;
    provinsi: string;
  } | null;
}

export function FarmerPriceModal({ isOpen, onClose, commodity }: FarmerPriceModalProps) {
  const [chartMode, setChartMode] = useState<ChartMode>('month')

  const { data: trendData } = usePriceHistory(
    commodity?.name ?? null,
    commodity?.provinsi ?? null,
    chartMode
  )

  const { neighbors } = useNeighborProvinces(
    commodity?.name ?? null,
    commodity?.provinsi ?? null
  )

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-4xl">{commodity.icon}</span>
            <div>
              <div className="text-xl">{commodity.name}</div>
              <div className="text-sm text-gray-600 font-normal mt-1">
                Informasi Harga untuk Petani
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Perbandingan harga {commodity.name} di {commodity.provinsi} dan provinsi sekitarnya
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Harga Provinsi Saat Ini - Rekomendasi */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Rekomendasi Harga Jual
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-amber-700" />
              <p className="text-sm text-gray-700">{commodity.provinsi}</p>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-bold text-amber-700">
                Rp {commodity.price.toLocaleString('id-ID')}
              </span>
              <span className="text-xl text-gray-600">/{commodity.unit}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isPositive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{commodity.change}% dari bulan lalu</span>
            </div>
            <p className="text-sm text-amber-800 mt-3">
              💡 Gunakan harga ini sebagai acuan untuk menjual hasil panen Anda
            </p>
          </div>

          {/* Harga Provinsi Tetangga */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Harga di Provinsi Sekitar</h3>
            {neighbors.length === 0 ? (
              <p className="text-gray-400 text-sm">Memuat data provinsi sekitar...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {neighbors.map((n) => (
                  <div key={n.provinsi} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-green-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-800 text-sm">{n.provinsi}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-green-700">
                        Rp {n.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-gray-500 text-sm">/{commodity.unit}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      n.change > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {n.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{n.change > 0 ? '+' : ''}{n.change}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grafik Tren */}
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
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '11px' }} interval="preserveStartEnd" minTickGap={20} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px' }}
                  formatter={(value: number, name: string) => {
                    if (!value) return null;
                    return [`Rp ${value.toLocaleString('id-ID')}`, name === 'priceHistorical' ? 'Historis' : 'Prediksi'];
                  }}
                />
                <Line type="monotone" dataKey="priceHistorical" stroke="#16a34a" strokeWidth={3} dot={false} activeDot={{ r: 6 }} connectNulls={false} />
                <Line type="monotone" dataKey="pricePrediction" stroke="#f59e0b" strokeWidth={3} strokeDasharray="8 4" strokeOpacity={0.6} dot={false} connectNulls={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tips */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-bold text-green-900 mb-2">📊 Tips Penjualan:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Pertimbangkan biaya transportasi ke provinsi dengan harga lebih tinggi</li>
              <li>• Jual saat harga naik untuk keuntungan maksimal</li>
              <li>• Bandingkan harga lokal dengan provinsi tetangga</li>
              <li>• Hubungi tengkulak atau koperasi untuk harga terbaik</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}