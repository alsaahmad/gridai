import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { MapZone } from './types';
import 'leaflet/dist/leaflet.css';

interface MapSectionProps {
  data: MapZone[];
  isLoading: boolean;
}

const riskConfig: Record<string, { color: string; glow: string; label: string }> = {
  LOW:    { color: '#22c55e', glow: '0 0 14px rgba(34,197,94,0.8)',  label: 'Low'    },
  MEDIUM: { color: '#f59e0b', glow: '0 0 14px rgba(245,158,11,0.8)', label: 'Medium' },
  HIGH:   { color: '#ef4444', glow: '0 0 14px rgba(239,68,68,0.8)',  label: 'High'   },
};

const getRisk = (risk?: string) => {
  const key = (risk || 'LOW').toUpperCase();
  return riskConfig[key] || riskConfig.LOW;
};

export default function MapSection({ data, isLoading }: MapSectionProps) {
  const center: [number, number] = data.length > 0
    ? [data[0].lat ?? 28.6139, data[0].lon ?? 77.2090]
    : [28.6139, 77.2090]; // Default: Delhi (where backend zones are)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Live Zone Map</h2>
            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
              {data.length > 0 ? `${data.length} zones from /map` : 'Connecting to /map...'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          {Object.values(riskConfig).map(cfg => (
            <div key={cfg.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color, boxShadow: cfg.glow }} />
              <span className="text-[10px] font-bold text-white/40 uppercase">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative" style={{ height: 420 }}>
        {isLoading && data.length === 0 && (
          <div className="absolute inset-0 z-20 bg-[#050c1a]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Loading map data...</span>
            </div>
          </div>
        )}

        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          className="monitoring-map"
          zoomControl={true}
          attributionControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {data.map((zone) => {
            const risk = getRisk(zone.risk);
            return (
              <CircleMarker
                key={`${zone.zone}-${zone.lat}`}
                center={[zone.lat, zone.lon]}
                radius={16}
                pathOptions={{
                  color: risk.color,
                  fillColor: risk.color,
                  fillOpacity: 0.65,
                  weight: 2.5,
                }}
              >
                <Popup>
                  <div style={{
                    background: '#0a1628',
                    border: `1px solid ${risk.color}50`,
                    borderRadius: 12,
                    padding: '14px 16px',
                    minWidth: 230,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.9), ${risk.glow}`,
                  }}>
                    {/* Zone name + risk badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>{zone.zone}</span>
                      <span style={{
                        color: risk.color,
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        padding: '2px 10px',
                        background: `${risk.color}20`,
                        borderRadius: 20,
                        border: `1px solid ${risk.color}40`,
                      }}>
                        {risk.label} Risk
                      </span>
                    </div>

                    {/* Stats grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                      {[
                        { label: 'Grid Load', value: zone.load, unit: 'kW' },
                        { label: 'Solar',     value: zone.solar, unit: 'kW' },
                        { label: 'Renewable', value: zone.renewable_percentage, unit: '%' },
                        { label: 'Theft Risk', value: zone.theft_risk, unit: '' },
                      ].map(({ label, value, unit }) => (
                        <div key={label}>
                          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>{label}</div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                            {typeof value === 'number' ? `${value.toFixed(1)} ${unit}`.trim() : (value ?? 'N/A')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Color badge from backend */}
                    <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.2)', fontSize: 9, letterSpacing: 0.5 }}>
                      {zone.lat.toFixed(4)}°N, {zone.lon.toFixed(4)}°E
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Zone count overlay */}
        <div className="absolute bottom-4 left-4 z-[500] pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-sm border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
              {data.length} Zone{data.length !== 1 ? 's' : ''} Live
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
