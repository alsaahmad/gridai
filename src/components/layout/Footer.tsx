import React from 'react';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">GridAI</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Next-generation AI framework for sustainable and intelligent energy grid management.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Product</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link to="/monitoring" className="hover:text-primary transition-colors">Monitoring</Link></li>
              <li><Link to="/insights" className="hover:text-primary transition-colors">AI Insights</Link></li>
              <li><Link to="/map" className="hover:text-primary transition-colors">Map Live</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Forecasting</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300">
                <Github className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all duration-300">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Mail className="w-4 h-4" /> contact@gridai.io
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 font-medium">
          <p>© 2026 GridAI Technologies Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
