import { useRealtimeData } from '@/hooks/useRealtimeData';
import ChartContainer from '@/components/shared/ChartContainer';
import RiskGauge from '@/components/shared/RiskGauge';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Leaf, Recycle, Flame, Zap, Globe, Wind, Droplets, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { carbonData, renewableVsFossil, type Zone } from '@/services/mockData';

const NodeCard = ({ zone, active, onClick }: { zone: Zone; active: boolean; onClick: () => void }) => {
  const statusStyles = {
    safe: 'text-energy border-energy/20 bg-energy/5',
    medium: 'text-warning border-warning/20 bg-warning/5',
    danger: 'text-destructive border-destructive/20 bg-destructive/5'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-5 glass-card cursor-pointer border-white/5 transition-all duration-300 ${active ? 'border-primary shadow-[0_0_30px_rgba(14,165,233,0.1)] ring-1 ring-primary/50' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${zone.status === 'safe' ? 'bg-energy' : zone.status === 'medium' ? 'bg-warning' : 'bg-destructive'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{zone.id}</span>
        </div>
        {zone.theftRisk && <Zap className="w-3 h-3 text-destructive animate-bounce" />}
      </div>
      
      <h4 className="text-sm font-bold text-white mb-1">{zone.name}</h4>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-black text-white">{zone.load.toFixed(0)}</span>
        <span className="text-[10px] font-bold text-white/20 uppercase">% LOAD</span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-white/30 uppercase">Generation</span>
          <span className="text-xs font-bold text-energy">{(Math.random() * 50 + 20).toFixed(1)} MW</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[8px] font-bold text-white/30 uppercase">Renewable</span>
          <span className="text-xs font-bold text-primary">{(Math.random() * 40 + 60).toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function MapSustainability() {
  const { metrics, zones } = useRealtimeData();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(zones[0] || null);
  const [carbon, setCarbon] = useState(carbonData());
  const [renewable, setRenewable] = useState(renewableVsFossil());

  useEffect(() => {
    const id = setInterval(() => {
      setCarbon(carbonData());
      setRenewable(renewableVsFossil());
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-energy/20 bg-energy/5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-energy/10 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6 text-energy" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Sustainability Index</p>
              <h3 className="text-2xl font-black text-white glow-text">Excellent</h3>
           </div>
        </div>
        <div className="glass-card p-6 border-primary/20 bg-primary/5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Recycle className="w-6 h-6 text-primary" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Efficiency Goal</p>
              <h3 className="text-2xl font-black text-white glow-text">92% Met</h3>
           </div>
        </div>
        <div className="glass-card p-6 border-warning/20 bg-warning/5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-warning" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Carbon Savings</p>
              <h3 className="text-2xl font-black text-white glow-text">1,240 Tons</h3>
           </div>
        </div>
      </div>

      {/* Main Map & Detail Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Regional Node Architecture
              </h2>
              <p className="text-xs text-white/40">Real-time load and stability mapping</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-energy" /> Stable
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" /> Warning
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {zones.map((z) => (
              <NodeCard 
                key={z.id} 
                zone={z} 
                active={selectedZone?.id === z.id} 
                onClick={() => setSelectedZone(z)} 
              />
            ))}
          </div>

          <ChartContainer 
            title="Carbon Footprint Trends" 
            subtitle="CO₂ Emission vs Reduction strategy"
          >
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carbon}>
                  <defs>
                    <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--energy))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--energy))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#050c1a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    cursor={{ fill: '#ffffff05' }}
                  />
                  <Bar dataKey="saved" fill="url(#savedGrad)" radius={[6, 6, 0, 0]} name="CO₂ Saved" />
                  <Bar dataKey="emitted" fill="#ffffff10" radius={[6, 6, 0, 0]} name="CO₂ Emitted" />
                </BarChart>
             </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Action Panel & Sustainability Stats */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedZone?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 border-white/10"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-[2px] mb-6 flex items-center justify-between">
                Node Inspection
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">LIVE</span>
              </h3>
              
              <div className="space-y-6">
                <div>
                   <p className="text-2xl font-black text-white tracking-tight">{selectedZone?.name}</p>
                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{selectedZone?.id} • {selectedZone?.status} status</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                   <RiskGauge value={selectedZone?.load || 0} label="LOAD" color={selectedZone?.status === 'safe' ? 'energy' : 'warning'} />
                   <div className="flex-1">
                      <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Operational Health</p>
                      <p className="text-sm font-bold text-white">System is operating within nominal temperature range.</p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                   <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <Wind className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <span className="text-[8px] font-bold text-white/40 block">WIND</span>
                      <span className="text-xs font-bold text-white">12.4%</span>
                   </div>
                   <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <Sun className="w-4 h-4 text-warning mx-auto mb-1" />
                      <span className="text-[8px] font-bold text-white/40 block">SOLAR</span>
                      <span className="text-xs font-bold text-white">48.2%</span>
                   </div>
                   <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
                      <span className="text-[8px] font-bold text-white/40 block">HYDRO</span>
                      <span className="text-xs font-bold text-white">5.1%</span>
                   </div>
                </div>

                <button className="btn-primary w-full py-3 text-xs font-black uppercase tracking-widest">
                  Optimize Node
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <ChartContainer title="Energy Mix" subtitle="Renewable vs Fossil Origin">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={renewable}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {renewable.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#050c1a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

