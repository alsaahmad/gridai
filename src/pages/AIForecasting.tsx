import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import ShortTermSection from '@/components/forecasting/ShortTermSection';
import RenewableSection from '@/components/forecasting/RenewableSection';
import LongTermSection from '@/components/forecasting/LongTermSection';
import type { ForecastBundle } from '@/components/forecasting/types';
import { fetchPredictions } from '@/services/apiService';

const REFRESH_MS = 10_000;

export default function AIForecasting() {
  const [bundle, setBundle] = useState<ForecastBundle>({
    prediction: null,
    risk: null,
    sustain: null,
    theft: null,
    live: null,
    lastUpdated: null,
    isLoading: true,
    errors: {},
  });

  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res: any = await fetchPredictions();
        if (!isMounted) return;
        setBundle({
          prediction: res.prediction ?? null,
          risk: res.risk ?? null,
          blackout: res.blackout ?? null,
          sustain: res.sustainability ?? null,
          seasonal: res.seasonal ?? null,
          theft: null,
          live: res.live ?? null,
          lastUpdated: new Date(),
          isLoading: false,
          errors: {},
        });
        setSecondsAgo(0);
      } catch (e: any) {
        if (!isMounted) return;
        setBundle((prev) => ({ ...prev, isLoading: false, errors: { prediction: 'API Error' } }));
      }
    };

    load();
    const id = window.setInterval(load, REFRESH_MS);
    const timerId = window.setInterval(() => setSecondsAgo(s => s + 1), 1000);

    return () => {
      isMounted = false;
      window.clearInterval(id);
      window.clearInterval(timerId);
    };
  }, []);

  const hasAnyError = Object.keys(bundle.errors).length > 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#0EA5E9]" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Forecasting Active</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
            GRID DEMAND FORECAST
          </h1>
          <p className="text-white/40 font-medium text-sm mt-1 max-w-xl">
            Multi-factor predictive modeling for next-generation energy distribution.
            Analyze demand spikes, grid criticality, and seasonal risk factors.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Synchronized State</p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white/60">
              Last updated {secondsAgo}s ago
            </span>
            {bundle.lastUpdated && (
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">
                {bundle.lastUpdated.toLocaleTimeString([], { hour12: false })}
              </div>
            )}
          </div>
        </div>
      </div>

      {hasAnyError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card border-destructive/40 bg-destructive/10 py-4 px-6 flex items-center gap-4"
        >
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="text-xs font-black text-destructive uppercase tracking-widest">Connection Latency Detected</p>
            <p className="text-[11px] text-white/50">Forecasting engine is experiencing delays. Reconnecting...</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-10">
          <ShortTermSection {...bundle} />
          <RenewableSection {...bundle} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          <LongTermSection {...bundle} />
        </div>
      </div>
    </div>
  );
}
