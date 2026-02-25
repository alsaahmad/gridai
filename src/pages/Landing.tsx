import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Zap, Shield, Cpu, BarChart3, Globe, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import { AuraBackground } from '@/components/layout/AuraBackground';

const Landing = () => {
  return (
    <AuraBackground>
      <div className="flex flex-col min-h-screen text-white selection:bg-primary/30">
        {/* Navbar - Custom for Landing */}
      <nav className="glass-navbar sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary group-hover:rotate-12 transition-transform duration-300">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase tracking-[2px]">Grid<span className="text-primary italic">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[3px] text-white/50">
            <a href="#features" className="hover:text-primary transition-all duration-300 relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#solution" className="hover:text-primary transition-all duration-300 relative group">
              Solution
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-all duration-300 relative group">
              Process
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[10px] font-black uppercase tracking-[2px] text-white/50 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="btn-primary group flex items-center gap-2 px-6 py-2">
              <span className="text-[10px] font-black uppercase tracking-[2px]">Initialize</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden min-h-[90vh] flex items-center">
          <div className="section-container text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[3px] text-primary mb-12">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Intelligence Protocol v2.4
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
                Mastering the <br />
                <span className="text-primary glow-text not-italic">Entropy of Energy</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base text-white/50 mb-12 leading-relaxed tracking-wide font-medium">
                The world's most advanced AI-orchestrated grid management system. 
                Synchronizing demand, supply, and sustainability in real-time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup" className="btn-primary group px-12 py-5 text-sm font-black uppercase tracking-[3px] shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-primary/50 transition-all">
                  Access Portal
                </Link>
                <button className="flex items-center gap-3 px-10 py-5 border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[3px]">
                  <Play className="fill-white w-4 h-4" /> Watch System Demo
                </button>
              </div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-32 relative max-w-5xl mx-auto"
            >
              <div className="glass-card p-4 border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden -rotate-2 hover:rotate-0 transition-all duration-700">
                <div className="rounded-xl overflow-hidden border border-white/5 bg-[#050c1b] relative aspect-video group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                   {/* Simulated Dashboard UI - Highly Styled */}
                   <div className="absolute inset-0 p-8 flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <div className="w-12 h-3 bg-white/10 rounded-full" />
                          <div className="w-20 h-3 bg-primary/20 rounded-full" />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5" />
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-6">
                         <div className="col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col">
                            <div className="flex justify-between mb-4">
                              <div className="w-32 h-4 bg-white/10 rounded-full" />
                              <div className="w-16 h-4 bg-primary/40 rounded-full" />
                            </div>
                            <div className="flex-1 flex items-end gap-1">
                               {[40, 60, 45, 80, 50, 90, 70, 40, 60, 85].map((h, i) => (
                                 <div key={i} className="flex-1 bg-primary/20 rounded-t-sm border-t border-primary/50" style={{ height: `${h}%` }} />
                               ))}
                            </div>
                         </div>
                         <div className="flex flex-col gap-6">
                            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6">
                               <div className="w-full h-full rounded-full border-4 border-dashed border-white/10 flex items-center justify-center">
                                  <Zap className="w-8 h-8 text-primary/40" />
                               </div>
                            </div>
                            <div className="flex-1 bg-primary/20 rounded-2xl border border-primary/30 p-6" />
                         </div>
                      </div>
                   </div>
                  <Zap className="w-32 h-32 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 animate-pulse text-primary pointer-events-none" />
                </div>
              </div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 blur-[100px] -z-10 animate-pulse" />
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/20 blur-[100px] -z-10 animate-pulse [animation-delay:1s]" />
            </motion.div>
          </div>
        </section>

        {/* Problems Section - Smooth Transition */}
        <section id="problems" className="py-32 relative border-t border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-primary to-transparent" />
          <div className="section-container">
            <div className="text-center mb-24 max-w-3xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-[5px] text-white/30 mb-4 block">The Critical Faults</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight italic">Why the old grid <span className="text-white/30">is failing</span></h2>
              <p className="text-white/40 leading-relaxed font-medium">Standard energy paradigms are buckling under the weight of modern volatility and decentralized generation.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { title: "Sustained Overload", desc: "Legacy infrastructure lacks the elasticity to manage micro-fluctuations in demand.", icon: Zap, color: "text-primary" },
                 { title: "Entropy Loss", desc: "Billions in revenue vanish through inefficient distribution and unmonitored leakages.", icon: BarChart3, color: "text-blue-500" },
                 { title: "Carbon Stagnation", desc: "Ineffective integration of renewables keeps fossil fuel dependency at critical highs.", icon: Leaf, color: "text-green-500" }
               ].map((item, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.2 }}
                   className="group p-10 glass-card bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 text-center flex flex-col items-center"
                 >
                   <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                     <item.icon className={`w-7 h-7 ${item.color}`} />
                   </div>
                   <h3 className="text-xl font-bold mb-4 uppercase tracking-[2px]">{item.title}</h3>
                   <p className="text-white/40 text-[13px] leading-6 mb-6 group-hover:text-white/60 transition-colors">{item.desc}</p>
                   <div className="mt-auto pt-6 border-t border-white/5 w-full">
                      <span className="text-[10px] font-black uppercase tracking-[3px] text-primary/0 group-hover:text-primary transition-all">Details {'>>'}</span>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* Features / Solution Section - Seamless Integration */}
        <section id="solution" className="py-40 relative border-t border-white/5 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -z-10" />
          <div className="section-container">
             <div className="flex flex-col lg:flex-row gap-24 items-center">
                <div className="lg:w-1/2 relative">
                   <div className="inline-flex items-center gap-2 text-primary mb-8">
                     <div className="h-px w-10 bg-primary" />
                     <span className="text-[10px] font-black uppercase tracking-[5px]">The Solution</span>
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] uppercase italic">The Neural <br /><span className="text-primary not-italic glow-text">Advantage</span></h2>
                   <p className="text-white/40 mb-12 leading-relaxed text-lg max-w-lg font-medium">
                     GridAI deploys the world's first decentralized neural optimization engine, 
                     capable of sub-second decision making at the edge.
                   </p>
                   <div className="space-y-6">
                      {[
                        { title: "Edge Forensics", desc: "Instant detection of non-technical losses through heuristic analysis." },
                        { title: "Load Synthesis", desc: "Predictive balancing utilizing deep stochastic models." },
                        { title: "Protocol Green", desc: "Automated routing for 100% renewable priority." }
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15 + 0.5 }}
                          className="flex gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 group hover:border-primary/30 hover:bg-white/[0.05] transition-all cursor-crosshair shadow-lg"
                        >
                           <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                              <Zap className="w-5 h-5 text-primary group-hover:text-white" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white uppercase tracking-[2px] mb-2">{item.title}</h4>
                              <p className="text-xs text-white/40 italic group-hover:text-white/70 transition-colors">{item.desc}</p>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
                
                <div id="features" className="lg:w-1/2 grid grid-cols-2 gap-6 relative">
                   <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full" />
                   <div className="space-y-6">
                      <motion.div 
                        whileHover={{ y: -10 }}
                        className="glass-card aspect-[4/5] flex flex-col items-center justify-center gap-6 p-10 text-center border-white/10"
                      >
                         <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <Shield className="w-8 h-8 text-blue-400" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-[3px]">Cyber <br />Perimeter</h3>
                         <div className="w-10 h-1 bg-blue-400/30 rounded-full" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ y: -10 }}
                        className="glass-card aspect-video flex flex-col items-center justify-center gap-4 p-8 text-center border-white/10"
                      >
                         <Globe className="w-8 h-8 text-green-400" />
                         <span className="text-[10px] font-black uppercase tracking-[2px]">Net-Zero Engines</span>
                      </motion.div>
                   </div>
                   <div className="space-y-6 pt-12">
                      <motion.div 
                        whileHover={{ y: -10 }}
                        className="glass-card aspect-video flex flex-col items-center justify-center gap-4 p-8 text-center border-white/10"
                      >
                         <Cpu className="w-8 h-8 text-purple-400" />
                         <span className="text-[10px] font-black uppercase tracking-[2px]">Core Heuristics</span>
                      </motion.div>
                      <motion.div 
                        whileHover={{ y: -10 }}
                        className="glass-card aspect-[4/5] flex flex-col items-center justify-center gap-6 p-10 text-center border-white/10"
                      >
                         <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                            <BarChart3 className="w-8 h-8 text-primary" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-[3px]">Real-time <br />Ops</h3>
                         <div className="w-10 h-1 bg-primary/30 rounded-full" />
                      </motion.div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* How It Works / Process Section */}
        <section id="how-it-works" className="py-40 relative">
          <div className="section-container">
            <div className="text-center mb-24 max-w-2xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-[5px] text-white/30 mb-4 block">The Deployment</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight italic">Protocol <span className="text-primary not-italic glow-text">Lifecycle</span></h2>
              <p className="text-white/40 leading-relaxed font-medium">Four phases to achieving total autonomous energy intelligence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                 { step: "01", title: "Ingestion", desc: "Seamless telemetry from hardware to our encrypted nerve centers." },
                 { step: "02", title: "Synthesis", desc: "Constructing high-fidelity digital twins of your entire power ecosystem." },
                 { step: "03", title: "Alignment", desc: "Deploying deep learning models to eliminate stochastic waste." },
                 { step: "04", title: "Autonomy", desc: "Full cognitive execution of grid adjustments at light speed." }
               ].map((item, idx) => (
                 <div key={idx} className="relative p-10 glass-card bg-white/[0.01] border-white/5 group hover:border-primary transition-all duration-700 overflow-hidden">
                   <div className="text-7xl font-black text-white/[0.03] absolute -top-4 -right-4 group-hover:text-primary/10 transition-colors uppercase italic">{item.step}</div>
                   <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-500">
                      <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-white animate-pulse" />
                   </div>
                   <h3 className="text-lg font-black mb-4 text-white/90 uppercase tracking-[2px]">{item.title}</h3>
                   <p className="text-xs text-white/30 leading-relaxed font-bold lowercase tracking-tight">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Impact Section - The 'Benefits' */}
        <section id="benefits" className="py-40 relative border-t border-white/5">
          <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-energy/5 blur-[150px] rounded-full -z-10" />
          <div className="section-container">
             <div className="flex flex-col lg:flex-row-reverse gap-24 items-center">
                <div className="lg:w-1/2">
                   <span className="text-[10px] font-black uppercase tracking-[5px] text-white/30 mb-8 block">Quantified Impact</span>
                   <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] uppercase italic">Radical <br /><span className="text-energy not-italic glow-text-energy">Efficiency</span></h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {[
                        { label: "Opex Delta", val: "-32%", desc: "Direct reduction in distribution overhead." },
                        { label: "Uptime Sync", val: "99.9%", desc: "Reliability across critical infrastructure nodes." },
                        { label: "Renewable Flow", val: "3.2x", desc: "Acceleration of sustainable energy ingestion." },
                        { label: "Risk Mitigation", val: "88%", desc: "Confidence in threat detection heuristics." }
                      ].map((benefit, i) => (
                        <div key={i} className="glass-card-sm p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                           <div className="text-4xl font-black text-white mb-2 glow-text">{benefit.val}</div>
                           <div className="text-[10px] font-black text-primary uppercase tracking-[3px] mb-4">{benefit.label}</div>
                           <p className="text-[10px] text-white/30 italic font-medium leading-tight">{benefit.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="lg:w-1/2 relative h-[500px]">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[400px] h-[400px] rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
                      <div className="absolute w-[300px] h-[300px] rounded-full border border-primary/20 animate-[spin_15s_linear_infinite_reverse]" />
                      <div className="absolute w-[200px] h-[200px] rounded-full border border-energy/10 animate-[spin_10s_linear_infinite]" />
                      <div className="w-10 h-10 rounded-full bg-primary glow-primary flex items-center justify-center relative z-10">
                        <Zap className="w-6 h-6 text-white" />
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                      </div>
                      
                      {/* Floating Orbs */}
                      <div className="absolute top-10 left-1/4 w-4 h-4 rounded-full bg-primary/40 animate-bounce" />
                      <div className="absolute bottom-20 right-1/4 w-3 h-3 rounded-full bg-blue-400/40 animate-ping" />
                      <div className="absolute top-1/2 right-10 w-2 h-2 rounded-full bg-purple-500/40 animate-pulse" />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Massive CTA Section */}
        <section className="py-40 relative">
           <div className="section-container">
              <div className="glass-card bg-primary py-24 px-12 text-center relative overflow-hidden border-none text-white shadow-[0_0_100px_rgba(14,165,233,0.3)]">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                 <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-white/20 blur-[150px] rounded-full" />
                 <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-5xl md:text-8xl font-black mb-8 italic uppercase leading-[0.8] tracking-tighter">Become <br />the Future.</h2>
                    <p className="text-white/80 mb-12 text-lg font-medium tracking-wide">
                      Join the coalition of 200+ global utilities redefining the energy landscape through AI.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                       <Link to="/signup" className="bg-white text-primary px-16 py-6 rounded-full font-black uppercase tracking-[3px] text-sm hover:scale-105 transition-all shadow-2xl">
                          Initialize System
                       </Link>
                       <button className="text-white border-2 border-white/20 px-16 py-6 rounded-full font-black uppercase tracking-[3px] text-sm hover:bg-white/10 transition-all backdrop-blur-sm">
                          Contact Nexus
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
    </AuraBackground>
  );
};

export default Landing;
