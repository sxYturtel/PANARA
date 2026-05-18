import { User, Sprout } from "lucide-react";

interface RoleToggleProps {
  role: 'consumer' | 'farmer';
  onRoleChange: (role: 'consumer' | 'farmer') => void;
}

export function RoleToggle({ role, onRoleChange }: RoleToggleProps) {
  return (
    <div className="bg-green-500 rounded-lg p-1 flex gap-1">
      <button
        onClick={() => onRoleChange('consumer')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          role === 'consumer' 
            ? 'bg-white text-green-700 shadow-md' 
            : 'text-green-100 hover:text-white'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Konsumen</span>
      </button>
      <button
        onClick={() => onRoleChange('farmer')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          role === 'farmer' 
            ? 'bg-white text-green-700 shadow-md' 
            : 'text-green-100 hover:text-white'
        }`}
      >
        <Sprout className="w-4 h-4" />
        <span>Petani</span>
      </button>
    </div>
  );
}
