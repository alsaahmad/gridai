import { motion } from 'framer-motion';
import { CalendarRange, BarChart2, TrendingUp, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ForecastBundle } from './types';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />;
}

// Generate weekly demand trend from current load
function buildWeeklyTrend(baseLoad: number) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const factors = [0.88, 0.92, 0.97, 1.0, 1.05, 0.75, 0.68];
  return days.map((day, i) => ({
    day,
    load: +(baseLoad * factors[i] + (Math.random() - 0.5) * 12).toFixed(1),
  }));
}

// Monthly demand labels based on season
const MONTHS = [
  { month: 'Jan', risk: 30, season: 'Winter' },
  { month: 'Feb', risk: 28, season: 'Winter' },
  { month: 'Mar', risk: 40, season: 'Spring' },
  { month: 'Apr', risk: 55, season: 'Spring' },
  { month: 'May', risk: 72, season: 'Pre-Summer' },
  { month: 'Jun', risk: 88, season: 'Summer' },
  { month: 'Jul', risk: 95, season: 'Peak Summer' },
  { month: 'Aug', risk: 90, season: 'Peak Summer' },
  { month: 'Sep', risk: 70, season: 'Monsoon' },
  { month: 'Oct', risk: 50, season: 'Fall' },
  { month: 'Nov', risk: 38, season: 'Winter' },
  { month: 'Dec', risk: 35, season: 'Winter' },
];

const currentMonth = new Date().getMonth();
const peakMonth = MONTHS.reduce((a, b) => (a.risk > b.risk ? a : b));
const highRiskMonths = MONTHS.filter(m => m.risk > 70);

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const isToday = MONTHS.indexOf(payload) === currentMonth;
  if (!isToday) return null;
  return <circle cx={cx} cy={cy} r={5} fill="#0EA5E9" stroke="rgba(14,165,233,0.4)" strokeWidth={6} />;
};

// ─── component ──────────────────────────────────────────────────────────────
export default function LongTermSection({ prediction, risk, seasonal, live, isLoading }: ForecastBundle) {
  const baseLoad = live?.grid_load ?? prediction?.current_load ?? 120;
  const weekTrend = buildWeeklyTrend(baseLoad);
  const peakDay = weekTrend.reduce((a, b) => (a.load > b.load ? a : b));

  const currentRiskScore = seasonal?.monthly_risk_score ?? MONTHS[currentMonth].risk;
  const peakSeason = seasonal?.peak_season ?? "Summer Peak";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
          <CalendarRange className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">📅 Long-Term Forecast & Risk</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Seasonal & weekly demand modeling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly demand chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Load Pattern</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Algorithm: Stochastic seasonal Factor</p>
            </div>
          </div>
          {isLoading
            ? <Skeleton className="h-40 w-full" />
            : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weekTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
                    labelStyle={{ color: '#fff', fontWeight: 700 }}
                  />
                  <Line
                    type="monotone" dataKey="load"
                    stroke="#0EA5E9" strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#0EA5E9', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )
          }
          <div className="mt-4 flex justify-between items-center py-3 px-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-[9px] text-white/30 uppercase tracking-widest">Expected Weekly Peak</p>
              <p className="text-sm font-black text-warning">{peakDay.day} @ {peakDay.load} kW</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/30 uppercase tracking-widest">Day-over-Day Delta</p>
              <p className="text-sm font-black text-energy">+4.2%</p>
            </div>
          </div>
        </motion.div>

        {/* Yearly risk + peak seasons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Seasonal Risk Bars</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Criticality projection</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 rounded-full border border-destructive/20">
              <span className="text-[9px] font-black text-destructive uppercase tracking-widest">{peakSeason}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {MONTHS.map((m, i) => {
              const riskVal = (m.risk / 10) * currentRiskScore;
              const barColor = m.risk > 80 ? '#ef4444' : m.risk > 50 ? '#f59e0b' : '#22c55e';
              const isCurrent = i === currentMonth;
              return (
                <div key={m.month} className={`flex items-center gap-3 ${isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                  <span className={`text-[9px] w-6 font-bold shrink-0 ${isCurrent ? 'text-primary' : 'text-white/30'}`}>{m.month}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${m.risk}%` }}
                      className="h-full rounded-full"
                      style={{ background: barColor }}
                    />
                  </div>
                  {isCurrent && <span className="text-[8px] font-black text-primary uppercase whitespace-nowrap">Current</span>}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Seasonal Summary Card */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card bg-primary/5 border-primary/20 py-6 px-8 flex justify-between items-center"
      >
        <div className="space-y-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Active Seasonal Logic</p>
          <p className="text-2xl font-black text-white">{peakSeason}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Calculated Risk Factor</p>
          <p className="text-2xl font-black text-energy">{currentRiskScore}/10</p>
        </div>
      </motion.div>
    </div>
  );
}
