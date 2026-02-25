import { motion } from 'framer-motion';
import { type LucideIcon, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color: 'primary' | 'energy' | 'warning' | 'destructive';
  trend?: 'up' | 'down';
  delay?: number;
  description?: string;
}

const colorMap = {
  primary: { icon: 'text-primary', glow: 'glow-primary', bg: 'bg-primary/10' },
  energy: { icon: 'text-energy', glow: 'glow-energy', bg: 'bg-energy/10' },
  warning: { icon: 'text-warning', glow: 'glow-warning', bg: 'bg-warning/10' },
  destructive: { icon: 'text-destructive', glow: 'glow-danger', bg: 'bg-destructive/10' },
};

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  color, 
  trend, 
  delay = 0,
  description 
}: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const c = colorMap[color];

  useEffect(() => {
    const duration = 1000;
    const start = displayValue;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // Quart easing for extra smoothness
      setDisplayValue(start + diff * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
            className="glass-card group cursor-pointer relative overflow-hidden"
          >
            {/* Subtle backlight glow on hover */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none bg-${color}`} />
            
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40">{title}</span>
              <div className={`p-2.5 rounded-xl ${c.bg} group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}>
                <Icon className={`w-5 h-5 ${c.icon}`} />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white glow-text tabular-nums">
                {displayValue.toFixed(value >= 100 ? 0 : 1)}
              </span>
              <span className="text-sm font-medium text-white/30 uppercase">{unit}</span>
              {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${
                  trend === 'up' ? 'bg-energy/10 text-energy' : 'bg-destructive/10 text-destructive'
                }`}>
                  {trend === 'up' ? '↑' : '↓'} 3.2%
                </div>
              )}
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="glass-card-sm border-white/10 text-white/80">
          <p className="text-xs font-semibold">{description || `Current ${title} real-time feedback.`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

