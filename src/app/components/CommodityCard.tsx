import { TrendingUp, TrendingDown } from "lucide-react";

interface CommodityCardProps {
  name: string;
  price: number;
  unit: string;
  change: number;
  icon: string;
  onClick: () => void;
}

export function CommodityCard({ name, price, unit, change, icon, onClick }: CommodityCardProps) {
  const isPositive = change > 0;
  
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all border border-gray-100 hover:border-green-300 text-left w-full hover:scale-105 transform"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-green-50 p-3 rounded-lg">
          <span className="text-3xl">{icon}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
          isPositive ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-gray-800 mb-2">{name}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-green-700">
          Rp {price.toLocaleString('id-ID')}
        </span>
        <span className="text-gray-500 text-sm">/{unit}</span>
      </div>
    </button>
  );
}