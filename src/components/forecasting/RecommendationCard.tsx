import { motion } from 'framer-motion';
import { Sparkles, Zap, Sun, Battery, Shield, TrendingDown, Lightbulb } from 'lucide-react';
import type { ForecastBundle } from './types';

interface Recommendation {
  title: string;
  description: string;
  benefit: string;
  saving: string;
  icon: React.ElementType;
  priority: 'critical' | 'high' | 'medium';
}

function generateRecommendations(bundle: ForecastBundle): Recommendation[] {
  const recs: Recommendation[] = [];
  const riskLevel = (bundle.risk?.risk_level || 'LOW').toUpperCase();
  const riskScore = bundle.risk?.risk_score ?? 0;
  const renewable = bundle.sustain?.renewable_percentage ?? 0;
  const solar = bundle.live?.solar_generation ?? 0;
  const temp = bundle.live?.temperature ?? 30;
  const predicted = bundle.prediction?.predicted_load ?? 0;
  const current = bundle.prediction?.current_load ?? bundle.live?.grid_load ?? 0;
  const spikeDetected = bundle.prediction?.spike_detected || (current > 0 && ((predicted - current) / current) > 0.2);

  // Critical: Spike detected
  if (spikeDetected) {
    recs.push({
      title: 'Activate Demand Response Protocol',
      description: `Sudden demand surge detected (+${((predicted - current) / Math.max(current, 1) * 100).toFixed(0)}%). Immediately engage load-shedding tiers and alert industrial consumers.`,
      benefit: 'Prevent cascading overload failure',
      saving: '₹12–18 lakh/event',
      icon: Shield,
      priority: 'critical',
    });
  }

  // High: Overload risk
  if (riskScore > 70) {
    recs.push({
      title: 'Use Solar + Battery During Peak Hours',
      description: `Grid at ${riskScore.toFixed(0)}% capacity. Switch to stored solar energy during 18:00–22:00 to reduce dependency on primary grid.`,
      benefit: 'Reduce overload risk by ~35%',
      saving: '₹4–7 lakh/month',
      icon: Battery,
      priority: 'high',
    });
  }

  // Medium: Low renewable
  if (renewable < 40) {
    recs.push({
      title: 'Increase Renewable Energy Integration',
      description: `Renewable share is only ${renewable.toFixed(1)}%. Deploy additional solar panels in high-irradiance zones for better grid stability.`,
      benefit: 'Boost renewable to 55%+',
      saving: '₹8–12 lakh/year in CO₂ credits',
      icon: Sun,
      priority: 'medium',
    });
  }

  // High temp
  if (temp > 35) {
    recs.push({
      title: 'Deploy Smart Cooling Load Management',
      description: `Temperature at ${temp}°C is increasing AC demand. Implement pre-cooling schedules and smart thermostat protocols to flatten the load curve.`,
      benefit: 'Reduce peak load by ~18%',
      saving: '₹2–4 lakh/month',
      icon: TrendingDown,
      priority: 'high',
    });
  }

  // Always add a general recommendation
  recs.push({
    title: 'Enable Predictive Maintenance Alerts',
    description: 'Deploy AI-based anomaly detection on transformer load patterns to preempt equipment failures before they cascade.',
    benefit: 'Reduce unplanned outages by 40%',
    saving: '₹15–25 lakh/year',
    icon: Lightbulb,
    priority: 'medium',
  });

  return recs;
}

const priorityStyles = {
  critical: {
    border: 'border-destructive/40',
    bg: 'bg-destructive/5',
    badge: 'bg-destructive/20 text-destructive border-destructive/40',
    glow: 'rgba(239,68,68,0.15)',
  },
  high: {
    border: 'border-warning/30',
    bg: 'bg-warning/5',
    badge: 'bg-warning/20 text-warning border-warning/40',
    glow: 'rgba(245,158,11,0.1)',
  },
  medium: {
    border: 'border-primary/20',
    bg: 'bg-primary/5',
    badge: 'bg-primary/20 text-primary border-primary/40',
    glow: 'rgba(14,165,233,0.08)',
  },
};

export default function RecommendationCard(bundle: ForecastBundle) {
  const recs = generateRecommendations(bundle);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center relative">
          <Sparkles className="w-5 h-5 text-primary" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-energy rounded-full border-2 border-background animate-pulse" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">🔋 AI Recommendation Engine</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
            {recs.length} action{recs.length !== 1 ? 's' : ''} suggested based on real-time analysis
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recs.map((rec, i) => {
          const ps = priorityStyles[rec.priority];
          return (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className={`glass-card ${ps.border} ${ps.bg} relative overflow-hidden`}
              style={{ boxShadow: `inset 0 0 30px ${ps.glow}` }}
            >
              {/* Ambient glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                style={{ background: ps.glow }} />

              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ps.bg} border ${ps.border}`}>
                  <rec.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${ps.badge}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{rec.title}</h3>
                  <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">{rec.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
                <div className="p-2.5 rounded-lg bg-white/5">
                  <p className="text-[8px] text-white/30 uppercase tracking-widest mb-0.5">Expected Benefit</p>
                  <p className="text-[11px] font-bold text-energy">{rec.benefit}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5">
                  <p className="text-[8px] text-white/30 uppercase tracking-widest mb-0.5">Cost Saving</p>
                  <p className="text-[11px] font-bold text-warning">{rec.saving}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
