import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Mail, MessageSquare, History, User, ShieldAlert } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { label: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'URL Scanner', path: '/scan/url', icon: Search },
    { label: 'Email Analyzer', path: '/scan/email', icon: Mail },
    { label: 'Message Scan', path: '/scan/message', icon: MessageSquare },
    { label: 'Scan History', path: '/scans', icon: History },
    { label: 'Profile Settings', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block glass-card p-4 space-y-6 h-[calc(100vh-6rem)] sticky top-20">
      <div className="space-y-1">
        <h4 className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider px-3">
          Security Modules
        </h4>
        <nav className="space-y-1 pt-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-xl bg-gradient-to-b from-cyber-950 to-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Security Advisory</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Never submit credentials on suspicious domains flagged with High or Critical risk ratings.
        </p>
      </div>
    </aside>
  );
}
