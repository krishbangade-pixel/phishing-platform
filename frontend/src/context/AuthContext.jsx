import React, { createContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          setSession(currentSession);
          setUser(currentSession?.user || null);

          const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
              setSession(newSession);
              setUser(newSession?.user || null);
              setLoading(false);
            }
          );
          subscription = authListener?.subscription;
        } catch (err) {
          console.error('Error initializing Supabase Auth:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      throw new Error('Authentication is not configured.');
    }
  };

  const signup = async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) throw error;
      return data;
    } else {
      throw new Error('Authentication is not configured.');
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    }
    return true;
  };

  const updatePassword = async (newPassword) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    }
    return true;
  };

  const updateProfile = async (fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      setUser(data.user);
      return data.user;
    } else {
      throw new Error('Authentication is not configured.');
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
