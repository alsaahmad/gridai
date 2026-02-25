import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 border-white/10 shadow-2xl">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Forgot password?</h1>
                <p className="text-white/50 text-sm">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/40">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 focus:ring-primary focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 btn-primary group font-bold text-base" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-energy/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-energy" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Check your email</h2>
              <p className="text-white/50 text-sm mb-8 leading-relaxed text-center">
                We've sent a password reset link to <br />
                <span className="text-white font-bold">{email}</span>
              </p>
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary hover:bg-primary/10 font-bold"
                onClick={() => setIsSubmitted(false)}
              >
                Didn't receive it? Try again
              </Button>
            </motion.div>
          )}
        </div>

        <p className="text-center mt-8 text-sm text-white/20">
          © 2026 GridAI Central. All security protocols active.
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
