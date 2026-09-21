import React from 'react';
import { Shield, ShieldAlert, Lock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-cyber-950 border-t border-slate-800/80 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-cyan" />
              <span className="text-lg font-extrabold text-white">PhishShield AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              AI-driven phishing detection platform protecting users against credential harvesting, smishing, and malicious email vectors in real time.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS Encrypted Communication • Supabase Auth Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider font-mono">Platform Scanners</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/scan/url" className="hover:text-brand-cyan transition-colors">
                  URL Threat Scanner
                </Link>
              </li>
              <li>
                <Link to="/scan/email" className="hover:text-brand-cyan transition-colors">
                  Email Phishing Analyzer
                </Link>
              </li>
              <li>
                <Link to="/scan/message" className="hover:text-brand-cyan transition-colors">
                  SMS & Chat Analyzer
                </Link>
              </li>
              <li>
                <Link to="/scans" className="hover:text-brand-cyan transition-colors">
                  Scan History Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Security Disclaimer Notice */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Advisory Disclaimer</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-cyber-900/80 p-3 rounded-lg border border-slate-800">
              Detection indicators are provided for educational and advisory guidance only. No automated threat scanner can guarantee 100% security against zero-day social engineering vectors.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PhishShield AI Platform. Built with Node.js, Express & React.
          </div>
          <div className="flex items-center gap-1">
            <span>Enterprise Cyber Defense</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
