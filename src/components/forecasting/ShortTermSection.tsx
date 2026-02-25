import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, AlertTriangle, Activity,
  Zap, Clock, ShieldAlert, Gauge
} from 'lucide-react';
import type { ForecastBundle } from './types';

// ─── helpers ────────────────────────────────────────────────────────────────
const riskColors: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  LOW:    { text: 'text-energy',      border: 'border-energy/30',      bg: 'bg-energy/10',      dot: 'bg-energy' },
  MEDIUM: { text: 'text-warning',     border: 'border-warning/30',     bg: 'bg-warning/10',     dot: 'bg-warning' },
  HIGH:   { text: 'text-destructive', border: 'border-destructive/30', bg: 'bg-destructive/10', dot: 'bg-destructive' },
};
const riskCfg = (r?: string) => riskColors[(r || 'LOW').toUpperCase()] || riskColors.LOW;

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
}

function StatCard({
  icon: Icon, label, value, sub, color, delay = 0, badge, glow = false,
}: {
  icon: React.ElementType; label: string; value: React.ReactNode;
  sub?: string; color: string; delay?: number; badge?: React.ReactNode; glow?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className={`glass-card flex flex-col gap-4 relative overflow-hidden ${glow ? 'border-destructive/40' : ''}`}
    >
      {glow && (
        <div className="absolute inset-0 animate-pulse rounded-2xl pointer-events-none"
          style={{ boxShadow: 'inset 0 0 40px rgba(239,68,68,0.12)' }} />
      )}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}/10 border border-${color}/20`}
          style={{ background: `color-mix(in srgb, currentColor 8%, transparent)` }}>
          <Icon className={`w-5 h-5 text-${color}`} style={{ color: `var(--tw-${color}, inherit)` }} />
        </div>
        {badge}
      </div>
      <div>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
        {sub && <p className="text-[10px] text-white/30 mt-1 font-medium">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── component ──────────────────────────────────────────────────────────────
export default function ShortTermSection({ prediction, risk, blackout, live, isLoading }: ForecastBundle) {
  const pct = prediction?.spike_percent ?? 0;
  const isUp = pct >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp ? '#ef4444' : '#22c55e';

  const overloadPct = risk?.risk_score ?? 0;
  const rf = riskCfg(risk?.risk_level);

  const blackoutProb = Math.round(blackout?.probability ?? (overloadPct > 90 ? 70 : overloadPct > 70 ? 40 : 10));
  const blackoutLevel = blackout?.level ?? (blackoutProb > 50 ? 'HIGH' : blackoutProb > 20 ? 'MEDIUM' : 'LOW');

  const now = new Date();
  const hour = now.getHours();
  const isEveningPeak = hour >= 18 && hour <= 22;
  const peakTimeLabel = isEveningPeak ? 'Active Now' : '18:00 – 22:00';

  const spikeDetected = prediction?.spike_detected;

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">⚡ Short-Term Grid Intelligence</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Real-time demand prediction & criticality</p>
        </div>
      </div>

      {/* ── Spike Warning Banner ── */}
      {spikeDetected && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card border-destructive/50 bg-destructive/10 py-4 px-6 flex items-center gap-4 relative overflow-hidden"
          style={{ boxShadow: '0 0 40px rgba(239,68,68,0.2), inset 0 0 40px rgba(239,68,68,0.05)' }}
        >
          <div className="absolute inset-0 animate-pulse pointer-events-none"
            style={{ background: 'radial-gradient(circle at 20% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-destructive uppercase tracking-wider">⚠ Demand Spike Detected</p>
            <p className="text-[11px] text-white/60 mt-0.5">
              +{pct.toFixed(1)}% surge detected versus baseline
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-black text-destructive">+{pct.toFixed(1)}%</p>
          </div>
        </motion.div>
      )}

      {/* ── Four KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* 1 — Next Hour Load */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.4 }}
          className={`glass-card flex flex-col gap-3 relative overflow-hidden ${spikeDetected ? 'border-destructive/30' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            {isUp
              ? <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/30 uppercase">↑ Spike</span>
              : <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-energy/10 text-energy border border-energy/30 uppercase">↓ Normal</span>}
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Next Hour Forecast</p>
            {isLoading ? <Skeleton className="h-8 w-3/4 mb-2" /> : (
              <p className="text-3xl font-black text-white">
                {prediction?.predicted_load ?? '—'}
                <span className="text-sm font-bold text-white/40 ml-1">kW</span>
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <TrendIcon className="w-3 h-3" style={{ color: trendColor }} />
              <span className="text-[10px] font-bold" style={{ color: trendColor }}>
                {isUp ? '+' : ''}{pct.toFixed(1)}% vs now
              </span>
            </div>
            <p className="text-[10px] text-white/30 mt-2 font-medium">Updated 3s ago</p>
          </div>
        </motion.div>

        {/* 2 — Peak Load Window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="glass-card flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Peak Load Window</p>
            {isLoading ? <Skeleton className="h-8 w-3/4 mb-2" /> : (
              <p className="text-xl font-black text-warning uppercase">{peakTimeLabel}</p>
            )}
            <p className="text-[10px] text-white/40 font-bold mt-1">EST. PEAK: {prediction ? `${(prediction.predicted_load * 1.15).toFixed(0)} kW` : '—'}</p>
            <div className="mt-2 flex items-center gap-1">
               <span className={`w-2 h-2 rounded-full ${isEveningPeak ? 'bg-destructive animate-pulse' : 'bg-warning/20'}`} />
               <span className="text-[9px] font-black text-white/20 uppercase tracking-tighter">System Criticality High</span>
            </div>
          </div>
        </motion.div>

        {/* 3 — Overload Probability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.4 }}
          className={`glass-card flex flex-col gap-3 ${rf.border} ${rf.bg}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rf.bg}`}>
            <Gauge className={`w-5 h-5 ${rf.text}`} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Overload Probability</p>
            {isLoading ? <Skeleton className="h-8 w-3/4 mb-2" /> : (
              <p className={`text-3xl font-black ${rf.text}`}>
                {overloadPct.toFixed(1)}%
              </p>
            )}
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${overloadPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${rf.dot}`}
              />
            </div>
            <p className="text-[10px] text-white/30 mt-2 font-medium">Risk: <span className={rf.text}>{risk?.risk_level || 'OK'}</span></p>
          </div>
        </motion.div>

        {/* 4 — Blackout Probability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.4 }}
          className={`glass-card flex flex-col gap-3 relative overflow-hidden ${blackoutProb > 50 ? 'border-destructive/40' : ''}`}
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Blackout Probability</p>
            {isLoading ? <Skeleton className="h-8 w-3/4 mb-2" /> : (
              <p className={`text-3xl font-black ${blackoutProb > 50 ? 'text-destructive' : blackoutProb > 20 ? 'text-warning' : 'text-energy'}`}>
                {blackoutProb}%
              </p>
            )}
             <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${blackoutProb}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${blackoutProb > 50 ? 'bg-destructive' : blackoutProb > 20 ? 'bg-warning' : 'bg-energy'}`}
              />
            </div>
            <p className="text-[10px] text-white/30 mt-2 font-medium">Criticality: <span className="text-white/60">{blackoutLevel}</span></p>
          </div>
        </motion.div>
      </div>

      {/* ── Emergency Forecast Panel (Standardised positioning BELOW Row) ── */}
      {spikeDetected && prediction && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card border-destructive/50 border-2 bg-destructive/5 relative overflow-hidden"
        >
          <div className="absolute right-4 top-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-destructive/20 rounded-full border border-destructive/30 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                <span className="text-[9px] font-black text-destructive uppercase tracking-widest">Emergency Active</span>
             </div>
          </div>
          
          <h3 className="text-sm font-black text-destructive mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            CRITICAL DEMAND RESPONSE PANEL
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Observed Load',       value: `${prediction.current_load} kW`,                   color: 'text-white' },
              { label: 'Delta Surge',        value: `+${pct.toFixed(1)}%`,                    color: 'text-destructive' },
              { label: 'Projected Peak',      value: `${prediction.predicted_load} kW`,                  color: 'text-warning' },
              { label: 'Risk Protocol',      value: risk?.risk_level === 'HIGH' ? 'LEVEL 3' : 'LEVEL 1', color: rf.text },
            ].map(({ label, value, color }) => (
              <div key={label} className="space-y-1">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</p>
                <p className={`text-2xl font-black ${color} tracking-tighter`}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
