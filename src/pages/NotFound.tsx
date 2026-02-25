import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-destructive/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="glass-card p-12 border-white/10 shadow-2xl space-y-8">
          <div className="relative mx-auto w-24 h-24">
             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
             <div className="relative w-full h-full rounded-3xl bg-primary/20 flex items-center justify-center border border-white/10">
                <Zap className="w-12 h-12 text-primary brightness-150" />
             </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-7xl font-black text-white tracking-tighter italic">404</h1>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            <p className="text-xl font-bold text-white/80 pt-4">Data Stream Severed</p>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              The neural node at <span className="text-primary font-mono">{location.pathname}</span> is currently unreachable or does not exist.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="btn-primary h-12 w-full font-bold">
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Return to Central
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-white/40 hover:text-white hover:bg-white/5 font-bold h-12">
               <Link to="/login" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
               </Link>
            </Button>
          </div>
        </div>

        <p className="mt-8 text-xs text-white/20 uppercase tracking-widest font-bold">
          © 2026 GridAI • PROTOCOL ERROR CL-404
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
