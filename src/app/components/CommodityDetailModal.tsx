import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";

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
  trendData: Array<{
    date: string;
    price: number;
    isPrediction: boolean;
  }>;
}

export function CommodityDetailModal({ isOpen, onClose, commodity, trendData }: CommodityDetailModalProps) {
  if (!commodity) return null;

  const isPositive = commodity.change > 0;

  // Pisahkan data historis dan prediksi
  const historicalData = trendData.filter(d => !d.isPrediction);
  const predictionData = trendData.filter(d => d.isPrediction);

  // Buat dataset dengan kolom terpisah untuk historis dan prediksi
  const chartData = trendData.map((item, index) => {
    if (item.isPrediction) {
      // Untuk prediksi, set priceHistorical = null
      return {
        date: item.date,
        priceHistorical: null,
        pricePrediction: item.price,
        isPrediction: true
      };
    } else {
      // Untuk historis, set pricePrediction = null
      // Kecuali titik terakhir historis, yang juga perlu ada di pricePrediction untuk koneksi
      const isLastHistorical = index === historicalData.length - 1;
      return {
        date: item.date,
        priceHistorical: item.price,
        pricePrediction: isLastHistorical ? item.price : null,
        isPrediction: false
      };
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
            Lihat harga terkini dan tren pergerakan harga {commodity.name} di {commodity.city} selama 30 hari terakhir plus prediksi 3 hari ke depan
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
              <span>{isPositive ? '+' : ''}{commodity.change}% dari minggu lalu</span>
            </div>
          </div>

          {/* Grafik Tren */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Tren Harga 30 Hari Terakhir & Prediksi 3 Hari</h3>
            <div className="flex gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-600"></div>
                <span className="text-gray-600">Data Historis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-amber-500 border-dashed border-t-2 border-amber-500"></div>
                <span className="text-gray-600">Prediksi</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                  interval="preserveStartEnd"
                  minTickGap={20}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (!value) return null;
                    const label = name === 'priceHistorical' ? 'Harga Historis' : 'Prediksi Harga';
                    return [`Rp ${value.toLocaleString('id-ID')}`, label];
                  }}
                />

                {/* Garis data historis - jelas dan solid */}
                <Line
                  type="monotone"
                  dataKey="priceHistorical"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={(props) => {
                    const { cx, cy, index } = props;
                    // Hanya tampilkan dot untuk data terakhir historis (hari ini)
                    if (index === historicalData.length - 1) {
                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill="#16a34a"
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      );
                    }
                    return null;
                  }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />

                {/* Garis prediksi - buram dan putus-putus dengan warna kuning */}
                <Line
                  type="monotone"
                  dataKey="pricePrediction"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  strokeOpacity={0.6}
                  dot={false}
                  activeDot={{ r: 6, fill: '#f59e0b', fillOpacity: 0.8 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Info Tambahan */}
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 Info:</strong> Harga dapat bervariasi antar pasar dan toko. Data ini merupakan rata-rata dari berbagai sumber di {commodity.city}.
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-amber-900">
                <strong>🔮 Prediksi:</strong> Prediksi harga 3 hari ke depan dihitung berdasarkan tren 7 hari terakhir. Harga aktual dapat berbeda dari prediksi.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}