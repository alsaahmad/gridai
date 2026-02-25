import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Activity, Brain, Map, Zap, ChevronLeft, ChevronRight,
  TrendingUp, Globe, Settings as SettingsIcon, ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/monitoring', label: 'Monitoring', icon: Activity },
  { path: '/insights', label: 'AI Risk Hub', icon: Brain },
  { path: '/forecasting', label: 'AI Forecasting', icon: TrendingUp },
  { path: '/map', label: 'Sustainability Map', icon: Map },
  { path: '/smart-map', label: 'Neural Map', icon: Globe },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
  { path: '/admin', label: 'Admin Panel', icon: ShieldCheck },
];

interface SidebarProps {
  mobile?: boolean;
}

export default function Sidebar({ mobile = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isCollapsed = collapsed && !mobile;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-white/10 ${mobile ? 'w-[240px]' : ''}`}
      style={{ background: 'rgba(5, 12, 26, 0.95)', backdropFilter: 'blur(32px)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 glow-primary shadow-lg ring-1 ring-white/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white font-bold text-sm tracking-tighter whitespace-nowrap uppercase italic"
          >
            GridAI <span className="text-white/40 not-italic">Central</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto">
        <p className={`text-[10px] font-bold text-white/20 uppercase tracking-[2px] mb-4 px-3 ${isCollapsed ? 'hidden' : 'block'}`}>
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group
                ${isActive
                  ? 'bg-primary/20 text-white shadow-[0_0_20px_rgba(14,165,233,0.1)] border border-primary/20'
                  : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
                }
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1 h-5 rounded-full bg-primary glow-primary"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Action */}
      {!mobile && (
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all duration-300"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </motion.aside>
  );
}


