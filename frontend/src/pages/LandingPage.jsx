import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, Mail, MessageSquare, ShieldCheck, Lock, AlertTriangle, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-950">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold font-mono tracking-wide shadow-glow-cyan/20">
              <Zap className="w-4 h-4 animate-pulse" />
              <span>AI-Powered Real-Time Threat Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Detect & Neutralize <br />
              <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Phishing Threats Early
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Analyze suspicious URLs, fake bank emails, and smishing messages before clicking. Powered by pattern correlation, domain heuristics, and multi-engine security databases.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-primary text-base py-3 px-7 w-full sm:w-auto">
                <span>Start Free Scanning</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link to="/login" className="btn-secondary text-base py-3 px-6 w-full sm:w-auto">
                <span>Sign In to Dashboard</span>
              </Link>
            </div>

            {/* Advisory Note */}
            <div className="pt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Advisory: Results provide risk evaluation guidance and do not guarantee absolute safety.</span>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Cards Grid */}
      <section className="py-16 bg-cyber-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Three Layers of Phishing Defense</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Comprehensive threat analysis tailored for modern social engineering attack vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* URL Scanner */}
            <div className="glass-card-hover p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">URL Threat Scanner</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect suspicious website links for typosquatting, missing SSL, recent domain registration, and Google Safe Browsing phish listings.
              </p>
              <Link to="/scan/url" className="text-xs font-semibold text-brand-cyan flex items-center gap-1 hover:underline">
                <span>Scan a Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Email Analyzer */}
            <div className="glass-card-hover p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Email Phishing Analyzer</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Detect urgent psychological triggers, spoofed sender envelope headers, fake bank alert patterns, and malicious redirect links.
              </p>
              <Link to="/scan/email" className="text-xs font-semibold text-blue-400 flex items-center gap-1 hover:underline">
                <span>Analyze Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Message Scan */}
            <div className="glass-card-hover p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">SMS & Chat Smishing Scan</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Evaluate text messages, WhatsApp alerts, and social media DMs promising fake prizes or package delivery rerouting.
              </p>
              <Link to="/scan/message" className="text-xs font-semibold text-purple-400 flex items-center gap-1 hover:underline">
                <span>Scan SMS / Text</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Transparency */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Transparent Security Standard</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                How PhishShield AI Evaluates Threats
              </h2>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Local Pattern Heuristics:</strong>
                    Scans text payloads for psychological panic manipulation, urgent deadlines, and fake verification lures.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Multi-Engine Security APIs:</strong>
                    Queries Google Safe Browsing and VirusTotal databases for blacklisted domains.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Unified Risk Score Engine:</strong>
                    Calculates a normalized 0-100 score with granular rule breakdown and actionable security recommendations.
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                <Lock className="w-4 h-4" />
                <span>Privacy First Protocol</span>
              </div>
              <h3 className="text-lg font-bold text-white">Your Data Privacy Notice</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submitted email bodies and text messages are processed strictly by the backend for threat analysis and saved under your authenticated Supabase PostgreSQL account. Content is never shared with third-party advertising networks or stored in browser localStorage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
