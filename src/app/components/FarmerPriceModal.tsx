import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { MapPin, TrendingUp } from "lucide-react";

interface FarmerPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  commodity: {
    name: string;
    icon: string;
    unit: string;
    priceJakarta: number;
    priceBandung: number;
    priceNational: number;
    changeJakarta: number;
    changeBandung: number;
  } | null;
}

export function FarmerPriceModal({ isOpen, onClose, commodity }: FarmerPriceModalProps) {
  if (!commodity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
            Bandingkan harga {commodity.name} di Jakarta dan Bandung dengan harga rata-rata nasional untuk menentukan harga jual terbaik
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Harga Nasional - Highlighted */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Rekomendasi
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">Harga Rata-rata Nasional</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-amber-700">
                Rp {commodity.priceNational.toLocaleString('id-ID')}
              </span>
              <span className="text-xl text-gray-600">/{commodity.unit}</span>
            </div>
            <p className="text-sm text-amber-800 mt-3">
              💡 Gunakan harga ini sebagai acuan untuk menjual hasil panen Anda
            </p>
          </div>

          {/* Harga per Kota */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Harga di Kota Besar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jakarta */}
              <div className="bg-white rounded-lg p-5 border-2 border-gray-200 hover:border-green-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-gray-800">Jakarta</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-green-700">
                    Rp {commodity.priceJakarta.toLocaleString('id-ID')}
                  </span>
                  <span className="text-gray-600">/{commodity.unit}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  commodity.changeJakarta > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{commodity.changeJakarta > 0 ? '+' : ''}{commodity.changeJakarta}%</span>
                </div>
              </div>

              {/* Bandung */}
              <div className="bg-white rounded-lg p-5 border-2 border-gray-200 hover:border-green-300 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-gray-800">Bandung</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-green-700">
                    Rp {commodity.priceBandung.toLocaleString('id-ID')}
                  </span>
                  <span className="text-gray-600">/{commodity.unit}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  commodity.changeBandung > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{commodity.changeBandung > 0 ? '+' : ''}{commodity.changeBandung}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips untuk Petani */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-bold text-green-900 mb-2">📊 Tips Penjualan:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Pertimbangkan biaya transportasi ke masing-masing kota</li>
              <li>• Jual saat harga naik untuk keuntungan maksimal</li>
              <li>• Bandingkan harga lokal dengan harga nasional</li>
              <li>• Hubungi tengkulak atau koperasi untuk harga terbaik</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}