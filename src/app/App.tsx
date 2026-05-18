import { useState } from "react";
import { Header } from "./components/Header";
import { CommodityCard } from "./components/CommodityCard";
import { NewsCard } from "./components/NewsCard";
import { StatCard } from "./components/StatCard";
import { CommodityDetailModal } from "./components/CommodityDetailModal";
import { FarmerPriceModal } from "./components/FarmerPriceModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Package, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";

// Data komoditas per kota
const commoditiesData = {
  jakarta: [
    { name: "Beras Premium", price: 15500, unit: "kg", change: 2.5, icon: "🌾" },
    { name: "Beras Medium", price: 12500, unit: "kg", change: 1.8, icon: "🍚" },
    { name: "Gula Pasir", price: 17500, unit: "kg", change: -1.2, icon: "🧂" },
    { name: "Minyak Goreng", price: 18500, unit: "liter", change: -3.5, icon: "🛢️" },
    { name: "Daging Ayam", price: 40000, unit: "kg", change: 0.8, icon: "🍗" },
    { name: "Daging Sapi", price: 135000, unit: "kg", change: 1.5, icon: "🥩" },
    { name: "Telur Ayam", price: 29000, unit: "kg", change: -0.5, icon: "🥚" },
    { name: "Cabai Merah", price: 48000, unit: "kg", change: 5.2, icon: "🌶️" },
    { name: "Bawang Merah", price: 36000, unit: "kg", change: -2.1, icon: "🧅" },
    { name: "Bawang Putih", price: 44000, unit: "kg", change: 1.3, icon: "🧄" },
    { name: "Tomat", price: 13000, unit: "kg", change: -1.8, icon: "🍅" },
    { name: "Kentang", price: 16000, unit: "kg", change: 0.3, icon: "🥔" },
  ],
  bandung: [
    { name: "Beras Premium", price: 14800, unit: "kg", change: 2.2, icon: "🌾" },
    { name: "Beras Medium", price: 11800, unit: "kg", change: 1.5, icon: "🍚" },
    { name: "Gula Pasir", price: 16800, unit: "kg", change: -1.5, icon: "🧂" },
    { name: "Minyak Goreng", price: 17500, unit: "liter", change: -3.8, icon: "🛢️" },
    { name: "Daging Ayam", price: 38000, unit: "kg", change: 0.5, icon: "🍗" },
    { name: "Daging Sapi", price: 128000, unit: "kg", change: 1.2, icon: "🥩" },
    { name: "Telur Ayam", price: 27500, unit: "kg", change: -0.8, icon: "🥚" },
    { name: "Cabai Merah", price: 45000, unit: "kg", change: 4.8, icon: "🌶️" },
    { name: "Bawang Merah", price: 34000, unit: "kg", change: -2.5, icon: "🧅" },
    { name: "Bawang Putih", price: 42000, unit: "kg", change: 1.0, icon: "🧄" },
    { name: "Tomat", price: 11500, unit: "kg", change: -2.1, icon: "🍅" },
    { name: "Kentang", price: 14000, unit: "kg", change: 0.1, icon: "🥔" },
  ]
};

// Data untuk petani dengan harga di berbagai kota
const farmerPriceData = [
  { 
    name: "Beras Premium", 
    icon: "🌾", 
    unit: "kg",
    priceJakarta: 15500, 
    priceBandung: 14800, 
    priceNational: 15000,
    changeJakarta: 2.5,
    changeBandung: 2.2
  },
  { 
    name: "Beras Medium", 
    icon: "🍚", 
    unit: "kg",
    priceJakarta: 12500, 
    priceBandung: 11800, 
    priceNational: 12000,
    changeJakarta: 1.8,
    changeBandung: 1.5
  },
  { 
    name: "Gula Pasir", 
    icon: "🧂", 
    unit: "kg",
    priceJakarta: 17500, 
    priceBandung: 16800, 
    priceNational: 17000,
    changeJakarta: -1.2,
    changeBandung: -1.5
  },
  { 
    name: "Minyak Goreng", 
    icon: "🛢️", 
    unit: "liter",
    priceJakarta: 18500, 
    priceBandung: 17500, 
    priceNational: 18000,
    changeJakarta: -3.5,
    changeBandung: -3.8
  },
  { 
    name: "Daging Ayam", 
    icon: "🍗", 
    unit: "kg",
    priceJakarta: 40000, 
    priceBandung: 38000, 
    priceNational: 38000,
    changeJakarta: 0.8,
    changeBandung: 0.5
  },
  { 
    name: "Daging Sapi", 
    icon: "🥩", 
    unit: "kg",
    priceJakarta: 135000, 
    priceBandung: 128000, 
    priceNational: 130000,
    changeJakarta: 1.5,
    changeBandung: 1.2
  },
  { 
    name: "Telur Ayam", 
    icon: "🥚", 
    unit: "kg",
    priceJakarta: 29000, 
    priceBandung: 27500, 
    priceNational: 28000,
    changeJakarta: -0.5,
    changeBandung: -0.8
  },
  { 
    name: "Cabai Merah", 
    icon: "🌶️", 
    unit: "kg",
    priceJakarta: 48000, 
    priceBandung: 45000, 
    priceNational: 45000,
    changeJakarta: 5.2,
    changeBandung: 4.8
  },
  { 
    name: "Bawang Merah", 
    icon: "🧅", 
    unit: "kg",
    priceJakarta: 36000, 
    priceBandung: 34000, 
    priceNational: 35000,
    changeJakarta: -2.1,
    changeBandung: -2.5
  },
  { 
    name: "Bawang Putih", 
    icon: "🧄", 
    unit: "kg",
    priceJakarta: 44000, 
    priceBandung: 42000, 
    priceNational: 42000,
    changeJakarta: 1.3,
    changeBandung: 1.0
  },
  { 
    name: "Tomat", 
    icon: "🍅", 
    unit: "kg",
    priceJakarta: 13000, 
    priceBandung: 11500, 
    priceNational: 12000,
    changeJakarta: -1.8,
    changeBandung: -2.1
  },
  { 
    name: "Kentang", 
    icon: "🥔", 
    unit: "kg",
    priceJakarta: 16000, 
    priceBandung: 14000, 
    priceNational: 15000,
    changeJakarta: 0.3,
    changeBandung: 0.1
  },
];

// Fungsi untuk generate data tren 30 hari (1 bulan)
function generateTrendData(basePrice: number, change: number) {
  const data = [];
  const today = new Date();

  // Generate data historis 30 hari ke belakang
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;

    // Simulasi fluktuasi harga dengan perubahan acak kecil
    const randomFluctuation = (Math.random() - 0.5) * (basePrice * 0.02); // ±2% fluktuasi
    const trendPrice = basePrice - (basePrice * change / 100) * (i / 30);
    const dayPrice = Math.round(trendPrice + randomFluctuation);

    data.push({
      date: dayLabel,
      price: dayPrice,
      isPrediction: false
    });
  }

  return data;
}

// Fungsi untuk generate prediksi 3 hari ke depan
function generatePredictionData(historicalData: Array<{date: string, price: number, isPrediction: boolean}>) {
  const predictions = [];
  const today = new Date();

  // Hitung trend menggunakan 7 hari terakhir
  const lastSevenDays = historicalData.slice(-7);
  const prices = lastSevenDays.map(d => d.price);
  const avgChange = (prices[prices.length - 1] - prices[0]) / 7;

  // Generate 3 hari prediksi
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;

    const lastPrice = i === 1 ? historicalData[historicalData.length - 1].price : predictions[i - 2].price;
    const predictedPrice = Math.round(lastPrice + avgChange);

    predictions.push({
      date: dayLabel,
      price: predictedPrice,
      isPrediction: true
    });
  }

  return predictions;
}

// Data berita
const news = [
  {
    title: "Harga Beras Stabil di Pasar Tradisional Jakarta dan Bandung",
    summary: "Pemerintah berhasil menjaga stabilitas harga beras melalui berbagai kebijakan intervensi pasar dan distribusi beras bulog ke seluruh wilayah.",
    date: "12 Des 2024",
    image: "https://images.unsplash.com/photo-1743300290267-3ba7a8ce7095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzY1NjMzNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Kebijakan"
  },
  {
    title: "Produksi Cabai Meningkat, Harga Diprediksi Turun Minggu Depan",
    summary: "Musim panen cabai merah di Jawa Tengah dan Jawa Timur diperkirakan akan menurunkan harga cabai yang sempat melonjak dalam beberapa minggu terakhir.",
    date: "11 Des 2024",
    image: "https://images.unsplash.com/photo-1619338098121-5925681fc9ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZm9vZCUyMG1hcmtldCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzY1NjMzNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Produksi"
  },
  {
    title: "Pemerintah Rilis Program Bantuan Pangan untuk Masyarakat Kurang Mampu",
    summary: "Kementerian Sosial meluncurkan program bantuan pangan berupa beras dan minyak goreng untuk 10 juta keluarga penerima manfaat di seluruh Indonesia.",
    date: "10 Des 2024",
    image: "https://images.unsplash.com/photo-1562988330-1dbb410b4bfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG1hcmtldCUyMGluZG9uZXNpYXxlbnwxfHx8fDE3NjU1MzM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Program Sosial"
  },
  {
    title: "Harga Minyak Goreng Turun 3,5% dalam Sepekan Terakhir",
    summary: "Turunnya harga minyak kelapa sawit (CPO) global berdampak positif terhadap penurunan harga minyak goreng di pasar domestik.",
    date: "9 Des 2024",
    image: "https://images.unsplash.com/photo-1619338098121-5925681fc9ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZm9vZCUyMG1hcmtldCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzY1NjMzNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Harga"
  },
  {
    title: "Kementan Dorong Petani Tingkatkan Produksi Bawang Putih Lokal",
    summary: "Program swasembada bawang putih terus digalakkan untuk mengurangi ketergantungan impor dan menstabilkan harga di pasar dalam negeri.",
    date: "8 Des 2024",
    image: "https://images.unsplash.com/photo-1562988330-1dbb410b4bfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG1hcmtldCUyMGluZG9uZXNpYXxlbnwxfHx8fDE3NjU1MzM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Pertanian"
  },
  {
    title: "Inflasi Pangan November 2024 Terkendali di Angka 0,8%",
    summary: "Badan Pusat Statistik (BPS) mencatat inflasi pangan pada November 2024 tetap terkendali berkat berbagai upaya stabilisasi harga oleh pemerintah.",
    date: "7 Des 2024",
    image: "https://images.unsplash.com/photo-1743300290267-3ba7a8ce7095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzY1NjMzNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Ekonomi"
  }
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string>("jakarta");
  const [role, setRole] = useState<'consumer' | 'farmer'>('consumer');
  const [selectedCommodityIndex, setSelectedCommodityIndex] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);

  const currentCommodities = commoditiesData[selectedCity as keyof typeof commoditiesData];
  
  const handleCommodityClick = (index: number) => {
    setSelectedCommodityIndex(index);
    if (role === 'consumer') {
      setIsDetailModalOpen(true);
    } else {
      setIsFarmerModalOpen(true);
    }
  };

  const selectedCommodity = selectedCommodityIndex !== null 
    ? currentCommodities[selectedCommodityIndex] 
    : null;

  const selectedFarmerData = selectedCommodityIndex !== null
    ? farmerPriceData[selectedCommodityIndex]
    : null;

  const historicalData = selectedCommodity
    ? generateTrendData(selectedCommodity.price, selectedCommodity.change)
    : [];

  const predictionData = historicalData.length > 0
    ? generatePredictionData(historicalData)
    : [];

  const combinedData = [...historicalData, ...predictionData];

  // Hitung statistik
  const priceIncreaseCount = currentCommodities.filter(c => c.change > 0).length;
  const priceDecreaseCount = currentCommodities.filter(c => c.change < 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        role={role}
        onRoleChange={setRole}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Banner Info Role */}
        {role === 'farmer' && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🌾</span>
              <div>
                <h2 className="text-xl font-bold mb-2">Mode Petani Aktif</h2>
                <p className="text-amber-50">
                  Klik komoditas untuk melihat harga jual di Jakarta, Bandung, dan harga rata-rata nasional. 
                  Gunakan informasi ini untuk menentukan harga jual terbaik!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Komoditas"
            value="12"
            icon={Package}
          />
          <StatCard 
            title={`Lokasi Saat Ini`}
            value={selectedCity === 'jakarta' ? 'Jakarta' : 'Bandung'}
            icon={TrendingUp}
          />
          <StatCard 
            title="Harga Naik"
            value={priceIncreaseCount.toString()}
            icon={AlertCircle}
            trend={`dari ${currentCommodities.length} komoditas`}
            trendUp={false}
          />
          <StatCard 
            title="Harga Turun"
            value={priceDecreaseCount.toString()}
            icon={BarChart3}
            trend={`dari ${currentCommodities.length} komoditas`}
            trendUp={true}
          />
        </div>

        {/* Tab Section */}
        <Tabs defaultValue="harga" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="harga">Harga Komoditas</TabsTrigger>
            <TabsTrigger value="berita">Berita Pangan</TabsTrigger>
          </TabsList>

          {/* Harga Komoditas */}
          <TabsContent value="harga">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Harga Komoditas Pangan - {selectedCity === 'jakarta' ? 'Jakarta' : 'Bandung'}
              </h2>
              <p className="text-gray-600 mb-6">
                Update terakhir: Sabtu, 13 Desember 2024 - 14:00 WIB • 
                {role === 'consumer' ? ' Klik komoditas untuk melihat tren harga' : ' Klik komoditas untuk melihat harga jual'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentCommodities.map((commodity, index) => (
                  <CommodityCard 
                    key={commodity.name} 
                    {...commodity}
                    onClick={() => handleCommodityClick(index)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Berita Pangan */}
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

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-start gap-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                Informasi Penting
              </h3>
              <p className="text-gray-700 text-sm">
                Data harga komoditas pangan bersumber dari berbagai pasar tradisional dan modern di Jakarta dan Bandung. 
                Harga dapat berbeda di setiap daerah dan pasar. Untuk informasi lebih lanjut, hubungi Dinas Perdagangan setempat.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal untuk konsumen - Tren harga */}
      {selectedCommodity && (
        <CommodityDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          commodity={{
            ...selectedCommodity,
            city: selectedCity === 'jakarta' ? 'Jakarta' : 'Bandung'
          }}
          trendData={combinedData}
        />
      )}

      {/* Modal untuk petani - Harga jual */}
      {selectedFarmerData && (
        <FarmerPriceModal 
          isOpen={isFarmerModalOpen}
          onClose={() => setIsFarmerModalOpen(false)}
          commodity={selectedFarmerData}
        />
      )}
    </div>
  );
}