import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Save, LogOut, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { formatDate } from '../utils/formatters.js';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setUpdating(true);
    try {
      await updateProfile(fullName.trim());
      showToast('Profile display name updated successfully!', 'success');
    } catch (err) {
      showToast('Profile update failed: ' + err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar />

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <User className="w-6 h-6 text-brand-cyan" />
                Account Profile & Settings
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage your profile details and security authentication status
              </p>
            </div>

            {/* Profile Info Card */}
            <div className="glass-card p-6 border-slate-800 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-cyan to-blue-600 text-cyber-950 flex items-center justify-center font-extrabold text-2xl shadow-glow-cyan/30">
                  {(user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {user?.user_metadata?.full_name || 'Security Analyst'}
                  </h2>
                  <p className="text-xs font-mono text-slate-400">{user?.email}</p>
                </div>
              </div>

              {/* Form to update display name */}
              <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Display Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="glass-input w-full text-xs"
                    disabled={updating}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating || !fullName.trim()}
                  className="btn-primary text-xs py-2.5 px-5"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </form>

              {/* Account Telemetry details */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-200">Security & Session Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px] uppercase">Account Created</span>
                    <span className="text-slate-200">{formatDate(user?.created_at)}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-500 block text-[10px] uppercase">Auth Provider</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Supabase JWT Session
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Security Policy */}
              <div className="p-4 rounded-xl bg-cyber-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
                <Lock className="w-5 h-5 text-brand-cyan shrink-0" />
                <span>
                  Role permissions and authorization levels are strictly managed server-side by Supabase PostgreSQL RLS policies.
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={logout}
                  className="btn-danger text-xs py-2.5 px-5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
