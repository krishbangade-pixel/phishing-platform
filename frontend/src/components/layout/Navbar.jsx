import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LogOut, User, LayoutDashboard, Search, Mail, MessageSquare, History, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully.', 'info');
      navigate('/login');
    } catch (err) {
      showToast('Logout error: ' + err.message, 'error');
    }
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'URL Scanner', path: '/scan/url', icon: Search },
    { label: 'Email Analyzer', path: '/scan/email', icon: Mail },
    { label: 'Message Scan', path: '/scan/message', icon: MessageSquare },
    { label: 'Scan History', path: '/scans', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-cyber-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-blue-600/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-glow-cyan/20 group-hover:scale-105 transition-all">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                PhishShield <span className="text-brand-cyan font-mono text-xs px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/30">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">Phishing Threat Defense</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login" className="btn-secondary text-xs py-2 px-4">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary text-xs py-2 px-4">
                Get Started Free
              </Link>
            </div>
          )}

          {/* User Profile & Actions */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-900 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center font-bold text-xs">
                  {(user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-cyber-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cyber-950/95 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                      active
                        ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-brand-cyan" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 bg-cyber-900 border border-slate-800"
                >
                  <User className="w-5 h-5 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary w-full text-center"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
