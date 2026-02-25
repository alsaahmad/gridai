import { motion } from 'framer-motion';
import { Sun, Wind, Leaf, Zap, CloudSun, BarChart2 } from 'lucide-react';
import type { ForecastBundle } from './types';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
}

// Derive solar output estimate from solar_generation (kW) and temperature
function estimateSolarOutput(solarKW: number, tempC: number) {
  // High temp slightly reduces panel efficiency (>35°C = -0.4%/°C above 25°C)
  const tempPenalty = tempC > 25 ? (tempC - 25) * 0.004 : 0;
  const efficiency = Math.max(0.75, 1 - tempPenalty);
  return +(solarKW * efficiency).toFixed(1);
}

function availabilityLevel(pct: number) {
  if (pct >= 60) return { label: 'High', color: 'text-energy', dot: 'bg-energy' };
  if (pct >= 30) return { label: 'Medium', color: 'text-warning', dot: 'bg-warning' };
  return { label: 'Low', color: 'text-destructive', dot: 'bg-destructive' };
}

// ─── component ──────────────────────────────────────────────────────────────
export default function RenewableSection({ sustain, live, renewable: backupRenewable, isLoading }: ForecastBundle) {
  const renewableData = sustain || backupRenewable;

  const renewablePct = renewableData?.renewable_percentage ?? 0;
  const co2Efficiency = renewableData?.reduction_potential ?? 0;
  const predictedEmission = renewableData?.predicted_emission ?? 0;
  const co2Saved = renewableData?.co2_saved ?? 0;

  const solarOutput = live?.solar_generation ?? 0;
  const windOutput = Math.max(0, (renewablePct / 100 * (live?.grid_load ?? 0)) - solarOutput);

  const avail = availabilityLevel(renewablePct);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-energy/10 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-energy" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">🌱 Renewable Intelligence</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Carbon forecast & renewable efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 — Renewable Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="glass-card flex flex-col gap-4 border-energy/10"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-energy/10 flex items-center justify-center">
              <Sun className="w-5 h-5 text-energy" />
            </div>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${avail.color} ${avail.dot.replace('bg-', 'bg-')}/10 uppercase`}>
              {avail.label}
            </span>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3">Generation Output</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[10px] text-white/40 font-medium">Solar Contribution</span>
                <span className="text-sm font-black text-warning">{solarOutput} kW</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[10px] text-white/40 font-medium">Wind (Estimated)</span>
                <span className="text-sm font-black text-primary">{windOutput.toFixed(1)} kW</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI 2 — Efficiency Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass-card flex flex-col gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Renewable Efficiency</p>
            <p className="text-4xl font-black text-white">{renewablePct.toFixed(1)}%</p>
            <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${renewablePct}%` }}
                className="h-full bg-energy"
              />
            </div>
            <p className="text-[10px] text-white/30 mt-3 font-medium">Reduction Potential: <span className="text-energy">{co2Efficiency}%</span></p>
          </div>
        </motion.div>

        {/* KPI 3 — Carbon Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass-card flex flex-col gap-4 border-white/10"
        >
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white/40" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-3">Carbon Metrics</p>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] text-white/30 uppercase">Predicted Emission</p>
                <p className="text-xl font-black text-destructive">{predictedEmission} kg CO₂/h</p>
              </div>
              <div>
                <p className="text-[9px] text-white/30 uppercase">Carbon Offset (Saved)</p>
                <p className="text-xl font-black text-energy">{co2Saved} kg</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
