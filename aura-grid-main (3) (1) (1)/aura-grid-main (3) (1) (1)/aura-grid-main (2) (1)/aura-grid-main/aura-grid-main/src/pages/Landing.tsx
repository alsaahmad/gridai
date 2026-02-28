import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuraBackground } from '@/components/layout/AuraBackground';
import { Zap, Shield, Cpu, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const specs = [
    {
      icon: Cpu,
      title: "Real-time AI",
      desc: "Neural networks monitoring grid health at millisecond precision."
    },
    {
      icon: Zap,
      title: "Renewable Sync",
      desc: "Automated distribution balancing for solar and wind generation."
    },
    {
      icon: Shield,
      title: "Grid Stability",
      desc: "Instant predictive maintenance and failure prevention system."
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AuraBackground>
        {/* Nav shorthand */}
        <nav className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Aura Grid</span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                Energy Management
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              Harness the power of AI to monitor, manage, and optimize your energy grid 
              with the world's most advanced glassmorphic dashboard.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="mt-8 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center gap-2 glow-primary hover:opacity-90 transition-all mx-auto group"
            >

              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* Specs Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specs.map((spec, i) => (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="glass-card flex flex-col items-center text-center p-8 group hover:border-primary/30 transition-colors"
              >
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-6 group-hover:scale-110 transition-transform">
                  <spec.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{spec.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {spec.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </AuraBackground>
    </div>
  );
};

export default Landing;
