import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { LocationSelector } from "./LocationSelector";
import { RoleToggle } from "./RoleToggle";

interface HeaderProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  role: 'consumer' | 'farmer';
  onRoleChange: (role: 'consumer' | 'farmer') => void;
  provinces: string[];
  loadingProvinces?: boolean;
}

export function Header({ selectedCity, onCityChange, role, onRoleChange, provinces, loadingProvinces }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold">PANARA</h1>
              <p className="text-sm text-green-100">Pangan Nusantara</p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <RoleToggle role={role} onRoleChange={onRoleChange} />
            <LocationSelector
              selectedCity={selectedCity}
              onCityChange={onCityChange}
              provinces={provinces}
              loading={loadingProvinces}
            />
            <button className="p-2 hover:bg-green-500 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}