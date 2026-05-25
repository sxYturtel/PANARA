import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CommodityCard } from "./components/CommodityCard";
import { NewsCard } from "./components/NewsCard";
import { StatCard } from "./components/StatCard";
import { CommodityDetailModal } from "./components/CommodityDetailModal";
import { FarmerPriceModal } from "./components/FarmerPriceModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Package, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import { useProvinces } from "../hooks/useProvinces";
import { useCommodities } from "../hooks/useCommodities";
import { usePriceHistory } from "../hooks/usePriceHistory";


// Data berita tetap static dulu
const news = [
  {
    title: "Harga Beras Stabil di Pasar Tradisional",
    summary: "Pemerintah berhasil menjaga stabilitas harga beras melalui berbagai kebijakan intervensi pasar.",
    date: "12 Des 2024",
    image: "https://images.unsplash.com/photo-1743300290267-3ba7a8ce7095?w=1080",
    category: "Kebijakan"
  },
  {
    title: "Produksi Cabai Meningkat, Harga Diprediksi Turun",
    summary: "Musim panen cabai merah di Jawa Tengah dan Jawa Timur diperkirakan menurunkan harga cabai.",
    date: "11 Des 2024",
    image: "https://images.unsplash.com/photo-1619338098121-5925681fc9ab?w=1080",
    category: "Produksi"
  },
  {
    title: "Program Bantuan Pangan untuk Masyarakat Kurang Mampu",
    summary: "Kementerian Sosial meluncurkan program bantuan pangan berupa beras untuk 10 juta keluarga.",
    date: "10 Des 2024",
    image: "https://images.unsplash.com/photo-1562988330-1dbb410b4bfa?w=1080",
    category: "Program Sosial"
  },
  {
    title: "Harga Minyak Goreng Turun 3,5% dalam Sepekan",
    summary: "Turunnya harga CPO global berdampak positif terhadap penurunan harga minyak goreng domestik.",
    date: "9 Des 2024",
    image: "https://images.unsplash.com/photo-1619338098121-5925681fc9ab?w=1080",
    category: "Harga"
  },
  {
    title: "Kementan Dorong Petani Tingkatkan Produksi Lokal",
    summary: "Program swasembada pangan terus digalakkan untuk mengurangi ketergantungan impor.",
    date: "8 Des 2024",
    image: "https://images.unsplash.com/photo-1562988330-1dbb410b4bfa?w=1080",
    category: "Pertanian"
  },
  {
    title: "Inflasi Pangan November 2024 Terkendali di 0,8%",
    summary: "BPS mencatat inflasi pangan November 2024 tetap terkendali berkat upaya stabilisasi pemerintah.",
    date: "7 Des 2024",
    image: "https://images.unsplash.com/photo-1743300290267-3ba7a8ce7095?w=1080",
    category: "Ekonomi"
  }
]

export default function App() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [role, setRole] = useState<'consumer' | 'farmer'>('consumer')
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false)

  // Hooks ambil data dari Supabase
  const { provinces, loading: loadingProvinces } = useProvinces()
  const { commodities, loading: loadingCommodities } = useCommodities(selectedProvince)
  const { data: priceHistory } = usePriceHistory(selectedCommodity, selectedProvince)

  // Set provinsi default begitu data provinsi keload
  // GANTI JADI INI — taruh setelah baris const { commodities, loading: loadingCommodities }
useEffect(() => {
  if (!selectedProvince && provinces.length > 0) {
    setSelectedProvince(provinces[0])
  }
}, [provinces])

  const handleCommodityClick = (name: string) => {
    setSelectedCommodity(name)
    if (role === 'consumer') {
      setIsDetailModalOpen(true)
    } else {
      setIsFarmerModalOpen(true)
    }
  }

  const activeCommodity = commodities.find(c => c.name === selectedCommodity)
  const priceIncreaseCount = commodities.filter(c => c.change > 0).length
  const priceDecreaseCount = commodities.filter(c => c.change < 0).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedCity={selectedProvince ?? ''}
        onCityChange={setSelectedProvince}
        role={role}
        onRoleChange={setRole}
        provinces={provinces}
        loadingProvinces={loadingProvinces}
      />

      <main className="container mx-auto px-4 py-8">
        {role === 'farmer' && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🌾</span>
              <div>
                <h2 className="text-xl font-bold mb-2">Mode Petani Aktif</h2>
                <p className="text-amber-50">
                  Klik komoditas untuk melihat perbandingan harga antar provinsi dan rekomendasi harga jual terbaik!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Komoditas" value={commodities.length.toString()} icon={Package} />
          <StatCard title="Lokasi Saat Ini" value={selectedProvince ?? '-'} icon={TrendingUp} />
          <StatCard
            title="Harga Naik"
            value={priceIncreaseCount.toString()}
            icon={AlertCircle}
            trend={`dari ${commodities.length} komoditas`}
            trendUp={false}
          />
          <StatCard
            title="Harga Turun"
            value={priceDecreaseCount.toString()}
            icon={BarChart3}
            trend={`dari ${commodities.length} komoditas`}
            trendUp={true}
          />
        </div>

        <Tabs defaultValue="harga" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="harga">Harga Komoditas</TabsTrigger>
            <TabsTrigger value="berita">Berita Pangan</TabsTrigger>
          </TabsList>

          <TabsContent value="harga">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Harga Komoditas Pangan — {selectedProvince ?? '...'}
              </h2>
              <p className="text-gray-600 mb-6">
                {role === 'consumer'
                  ? 'Klik komoditas untuk melihat tren harga'
                  : 'Klik komoditas untuk melihat harga jual'}
              </p>

              {loadingCommodities ? (
                <p className="text-gray-400 text-center py-12">Memuat data...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {commodities.map((commodity) => (
                    <CommodityCard
                      key={commodity.name}
                      {...commodity}
                      onClick={() => handleCommodityClick(commodity.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="berita">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Berita Terkini Pangan Nasional
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, index) => (
                  <NewsCard key={index} {...article} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Informasi Penting</h3>
              <p className="text-gray-700 text-sm">
                Data harga komoditas pangan bersumber dari 34 provinsi di Indonesia (2022–2024).
                Harga dapat berbeda di setiap daerah dan pasar. Untuk informasi lebih lanjut,
                hubungi Dinas Perdagangan setempat.
              </p>
            </div>
          </div>
        </div>
      </main>

      {activeCommodity && (
        <CommodityDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          commodity={{
            ...activeCommodity,
            city: selectedProvince ?? ''
          }}
          trendData={priceHistory}
        />
      )}

      {activeCommodity && (
        <FarmerPriceModal
          isOpen={isFarmerModalOpen}
          onClose={() => setIsFarmerModalOpen(false)}
          commodity={{
            name: activeCommodity.name,
            icon: activeCommodity.icon,
            unit: activeCommodity.unit,
            priceJakarta: 0,
            priceBandung: 0,
            priceNational: activeCommodity.price,
            changeJakarta: 0,
            changeBandung: 0,
          }}
        />
      )}
    </div>
  )
}