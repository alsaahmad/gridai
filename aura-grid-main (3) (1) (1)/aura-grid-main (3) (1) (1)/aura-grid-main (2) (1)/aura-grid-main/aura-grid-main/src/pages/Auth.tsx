import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuraBackground } from '@/components/layout/AuraBackground';
import { Zap, Mail, Lock, User, Github, Chrome, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Check for existing session
  React.useEffect(() => {
    const existingName = localStorage.getItem('aura-user-name');
    const existingEmail = localStorage.getItem('aura-user-email');
    if (existingName && existingEmail) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Real persistence logic
    localStorage.setItem('aura-user-name', name || 'ishika');
    localStorage.setItem('aura-user-email', email || 'ishika@auragrid.ai');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AuraBackground>
        {/* Back to Landing */}
        <button
          onClick={() => navigate('/')}
          className="relative z-20 flex items-center gap-2 p-6 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            {/* Logo area */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-primary/20 border border-primary/30 mb-4 glow-primary">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground mt-2">
                Join the future of smart energy management.
              </p>
            </div>

            {/* Glass Card */}
            <div className="glass-card !p-8 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

              {/* Tabs */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Register
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>


                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all glow-primary mt-4"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0b] px-2 text-muted-foreground">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                  <Chrome className="w-4 h-4" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                  <Github className="w-4 h-4" /> GitHub
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AuraBackground>
    </div>
  );
};

export default Auth;
