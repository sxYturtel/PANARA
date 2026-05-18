import { MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface LocationSelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export function LocationSelector({ selectedCity, onCityChange }: LocationSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-5 h-5 text-green-100" />
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="bg-green-500 border-green-400 text-white hover:bg-green-600 w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="jakarta">Jakarta</SelectItem>
          <SelectItem value="bandung">Bandung</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
