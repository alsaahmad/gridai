import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Zap, Sun, Thermometer, Activity, Clock, Radio } from 'lucide-react';
import type { LiveData as LiveDataType } from './types';

interface LiveDataProps {
  data: LiveDataType | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Smooth animated number counter
function AnimatedNumber({ value, decimals = 1 }: { value: number | undefined | null; decimals?: number }) {
  const [display, setDisplay] = useState(value ?? 0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (value == null) return;
    const start = display;
    const end = value;
    const startTime = performance.now();
    const duration = 600;

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + (end - start) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{display.toFixed(decimals)}</>;
}

const metrics = [
  {
    key: 'household_load' as keyof LiveDataType,
    label: 'Household Load',
    unit: 'kW',
    icon: Zap,
    color: 'text-primary',
    iconBg: 'bg-primary/10',
    glow: 'hover:border-primary/30',
  },
  {
    key: 'solar_generation' as keyof LiveDataType,
    label: 'Solar Generation',
    unit: 'kW',
    icon: Sun,
    color: 'text-warning',
    iconBg: 'bg-warning/10',
    glow: 'hover:border-warning/30',
  },
  {
    key: 'grid_load' as keyof LiveDataType,
    label: 'Grid Load',
    unit: 'kW',
    icon: Activity,
    color: 'text-energy',
    iconBg: 'bg-energy/10',
    glow: 'hover:border-energy/30',
  },
  {
    key: 'temperature' as keyof LiveDataType,
    label: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    color: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    glow: 'hover:border-blue-400/30',
    decimals: 0,
  },
];

export default function LiveData({ data, isLoading, error, lastUpdated }: LiveDataProps) {
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Live Grid Data</h2>
            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
              {data?.zone ? `Zone: ${data.zone}` : 'Connecting to /live-data...'}
            </p>
          </div>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Clock className="w-3 h-3 text-white/40" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{fmt(lastUpdated)}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-energy animate-pulse" />
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-destructive/30 bg-destructive/5 py-3 px-5 flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse shrink-0" />
          <p className="text-sm text-destructive font-medium">{error}</p>
          <span className="text-[10px] text-white/30 ml-auto shrink-0">Retrying in 5s...</span>
        </motion.div>
      )}

      {/* Zone + timestamp badge */}
      {data && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Zone: {data.zone}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              {new Date(data.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'medium' })}
            </span>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      {isLoading && !data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card animate-pulse space-y-4 py-6">
              <div className="h-4 bg-white/10 rounded-full w-2/3" />
              <div className="h-10 bg-white/5 rounded-xl w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => {
            const raw = data?.[m.key];
            const num = typeof raw === 'number' ? raw : null;

            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`glass-card flex flex-col gap-3 transition-all duration-300 ${m.glow}`}
              >
                <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{m.label}</p>
                  <p className={`text-3xl font-black tracking-tight ${m.color}`}>
                    {num != null
                      ? <><AnimatedNumber value={num} decimals={m.decimals ?? 1} />{m.unit}</>
                      : <span className="text-white/20 text-lg">—</span>}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !data && !error && (
        <div className="glass-card py-16 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
            <Radio className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/40 text-sm font-medium">No live data received yet.</p>
          <p className="text-white/20 text-xs">
            Make sure the server at <span className="text-primary font-mono">localhost:8005/live-data</span> is running.
          </p>
        </div>
      )}
    </div>
  );
}
