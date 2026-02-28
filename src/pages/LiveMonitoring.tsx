import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import MapSection from '@/components/monitoring/MapSection';
import LiveData from '@/components/monitoring/LiveData';
import Sustainability from '@/components/monitoring/Sustainability';
import type { MapZone, LiveData as LiveDataType, SustainabilityData } from '@/components/monitoring/types';

// ── Real backend endpoints ──────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:8005');
const ENDPOINTS = {
  map: `${BASE}/map`,
  liveData: `${BASE}/live-data`,
  sustainability: `${BASE}/sustainability`,
};
const REFRESH_MS = 5000;

// ── Helpers ─────────────────────────────────────────────────────
async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export default function LiveMonitoring() {
  const [mapData, setMapData] = useState<MapZone[]>([]);
  const [liveData, setLiveData] = useState<LiveDataType | null>(null);
  const [sustainData, setSustainData] = useState<SustainabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const [connected, setConnected] = useState(false);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    const newErrors: Record<string, string> = {};
    let anySuccess = false;

    // Fetch all three in parallel
    const [mapRes, liveRes, sustainRes] = await Promise.allSettled([
      apiFetch<MapZone[]>(ENDPOINTS.map),
      apiFetch<LiveDataType>(ENDPOINTS.liveData),
      apiFetch<SustainabilityData>(ENDPOINTS.sustainability),
    ]);

    if (mapRes.status === 'fulfilled') {
      setMapData(Array.isArray(mapRes.value) ? mapRes.value : []);
      anySuccess = true;
    } else {
      newErrors.map = `Map: ${mapRes.reason?.message || 'Failed'}`;
    }

    if (liveRes.status === 'fulfilled') {
      setLiveData(liveRes.value);
      anySuccess = true;
    } else {
      newErrors.live = `Live data: ${liveRes.reason?.message || 'Failed'}`;
    }

    if (sustainRes.status === 'fulfilled') {
      // Guard against {error: 'No data yet'}
      const sd = sustainRes.value as any;
      if (sd && !sd.error) {
        setSustainData(sd as SustainabilityData);
        anySuccess = true;
      } else {
        newErrors.sustain = `Sustainability: ${sd?.error || 'No data'}`;
      }
    } else {
      newErrors.sustain = `Sustainability: ${sustainRes.reason?.message || 'Failed'}`;
    }

    setErrors(newErrors);
    setConnected(anySuccess);
    if (anySuccess) {
      setLastUpdated(new Date());
      setFetchCount(c => c + 1);
    }
    setIsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => { fetchAll(false); }, [fetchAll]);

  // Auto-refresh
  useEffect(() => {
    const id = setInterval(() => fetchAll(true), REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchAll]);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connected ? 'bg-energy' : 'bg-destructive'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${connected ? 'bg-energy' : 'bg-destructive'}`} />
            </span>
            Grid Monitoring
          </h1>
          <p className="text-sm text-white/40 font-medium mt-1">
            Live data from{' '}
            <span className="text-primary font-mono text-[11px]">GridAI Backend</span>
            {' '}— auto-refreshes every 5s
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Connection badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${connected
            ? 'bg-energy/10 border-energy/30 text-energy'
            : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}>
            {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {connected ? 'Backend Connected' : 'Backend Offline'}
          </div>

          {/* Fetch counter */}
          {fetchCount > 0 && (
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/30 uppercase tracking-wider">
              #{fetchCount} sync
            </div>
          )}

          {/* Last updated */}
          {lastUpdated && (
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/30 uppercase tracking-wider">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          )}

          {/* Manual refresh */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchAll(false)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {hasErrors && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-destructive/20 bg-destructive/5 py-3 px-5 space-y-1"
        >
          <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-2">⚠ Some endpoints failed</p>
          {Object.values(errors).map((e, i) => (
            <p key={i} className="text-xs text-white/50 font-mono">{e}</p>
          ))}
          <p className="text-[10px] text-white/25 mt-1">Retrying in 5s · Make sure backend is running</p>
        </motion.div>
      )}

      {/* ── Section 1: MAP ── */}
      <section>
        <MapSection data={mapData} isLoading={isLoading && mapData.length === 0} />
      </section>

      {/* ── Section 2: LIVE DATA ── */}
      <section>
        <LiveData
          data={liveData}
          isLoading={isLoading && !liveData}
          error={errors.live || null}
          lastUpdated={lastUpdated}
        />
      </section>

      {/* ── Section 3: SUSTAINABILITY ── */}
      <section>
        <Sustainability
          data={sustainData}
          isLoading={isLoading && !sustainData}
        />
      </section>
    </div>
  );
}
