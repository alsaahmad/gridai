import React from 'react';
import { motion } from 'framer-motion';

export const AuraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Central Aura Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary-h) 80% 50% / 0.15) 0%, transparent 70%)'
        }}
      />
      
      {/* Sub Aura 1 */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none z-0 opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary-h) 60% 40% / 0.2) 0%, transparent 70%)'
        }}
      />

      {/* Grid Pattern Integration */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary-h) 100% 50% / 0.5) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary-h) 100% 50% / 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Stars/Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: Math.random(), 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [0.1, 1, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2 + Math.random() * 5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px]"
            style={{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }}
          />
        ))}

      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
