import { MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface LocationSelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  provinces: string[];
  loading?: boolean;
}

export function LocationSelector({ selectedCity, onCityChange, provinces, loading }: LocationSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-5 h-5 text-green-100" />
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="bg-green-500 border-green-400 text-white hover:bg-green-600 w-[200px]">
          <SelectValue placeholder={loading ? "Memuat..." : "Pilih Provinsi"} />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((prov) => (
            <SelectItem key={prov} value={prov}>
              {prov}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
