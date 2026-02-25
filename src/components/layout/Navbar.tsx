import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Settings,
  HelpCircle,
  ChevronDown,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from './UserMenu';
import { ColorPicker } from '../theme/ColorPicker';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/monitoring': 'Live Monitoring',
  '/insights': 'AI Insights & Risk',
  '/forecasting': 'AI Forecasting',
  '/map': 'Map & Sustainability',
  '/smart-map': 'Neural Map',
  '/settings': 'System Settings',
  '/admin': 'Admin Panel',
};

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'GridAI';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white/70 hover:text-white"
          onClick={onMenuClick}
        >
          <ChevronDown className="w-6 h-6 rotate-90" />
        </Button>
        <h1 className="text-lg font-bold tracking-tight text-white hidden md:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-white/40 mr-4">
          <Wifi className="w-4 h-4 text-energy" />
          <span className="hidden sm:inline">System Live</span>
          <span className="w-2 h-2 rounded-full bg-energy animate-pulse" />
        </div>

        <ColorPicker />

        <Button variant="ghost" size="icon" className="relative text-white/50 hover:text-white hover:bg-white/5 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}

