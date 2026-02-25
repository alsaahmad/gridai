import { motion } from 'framer-motion';
import { Leaf, Wind, Sparkles } from 'lucide-react';
import type { SustainabilityData } from './types';

interface SustainabilityProps {
  data: SustainabilityData | null;
  isLoading: boolean;
}

function CircularProgress({ value, size = 140, strokeWidth = 11, color = '#22c55e' }: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const safe = Math.min(100, Math.max(0, value));
  const offset = circ - (safe / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-white tabular-nums">{safe.toFixed(1)}%</span>
        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Renewable</span>
      </div>
    </div>
  );
}

export default function Sustainability({ data, isLoading }: SustainabilityProps) {
  const renewable = data?.renewable_percentage ?? 0;
  const co2 = data?.co2_saved ?? 0;

  const grade =
    renewable >= 75 ? 'Excellent' :
    renewable >= 50 ? 'Good' :
    renewable >= 30 ? 'Moderate' : 'Low';

  const gradeColor =
    renewable >= 75 ? '#22c55e' :
    renewable >= 50 ? '#0EA5E9' :
    renewable >= 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-energy/10 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-energy" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Sustainability</h2>
          <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">From /sustainability endpoint</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Circular gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-card flex flex-col items-center justify-center gap-5 py-8 relative overflow-hidden border-energy/20"
        >
          <div className="absolute inset-0 bg-energy/5 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-energy/8 blur-3xl rounded-full pointer-events-none" />

          {isLoading ? (
            <div className="w-36 h-36 rounded-full border-4 border-white/5 bg-white/5 animate-pulse" />
          ) : (
            <CircularProgress value={renewable} color="#22c55e" />
          )}

          <div className="text-center relative z-10">
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Sustainability Index</p>
            <p className="text-xl font-black" style={{ color: gradeColor }}>{grade}</p>
          </div>
        </motion.div>

        {/* CO₂ Saved card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-card flex flex-col gap-4 bg-primary/5 border-primary/20 relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wind className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">CO₂ Saved</p>
            {isLoading ? (
              <div className="h-10 bg-white/10 rounded-full w-1/2 animate-pulse" />
            ) : (
              <motion.p
                key={co2}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-primary tabular-nums"
              >
                {co2.toFixed(2)}
                <span className="text-base font-bold text-primary/60 ml-1">kg</span>
              </motion.p>
            )}
            <p className="text-[10px] text-white/30 mt-2 italic">Carbon offset from solar generation</p>
          </div>
        </motion.div>

        {/* Renewable % card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="glass-card flex flex-col gap-4 bg-energy/5 border-energy/20 relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-energy/10 blur-2xl rounded-full pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-energy/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-energy" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">Renewable Share</p>
            {isLoading ? (
              <div className="h-10 bg-white/10 rounded-full w-1/2 animate-pulse" />
            ) : (
              <motion.p
                key={renewable}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-energy tabular-nums"
              >
                {renewable.toFixed(2)}
                <span className="text-base font-bold text-energy/60 ml-1">%</span>
              </motion.p>
            )}
            {/* Mini progress bar */}
            <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, renewable)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-energy/80 to-energy rounded-full"
                style={{ boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}
              />
            </div>
            <p className="text-[10px] text-white/30 mt-2 italic">(solar_generation / grid_load) × 100</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
