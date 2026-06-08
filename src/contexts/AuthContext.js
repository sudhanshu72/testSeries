import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

// Hardcoded users - works locally and on deployed version
const USERS = {
  'student@test.com': { password: 'test123', full_name: 'Test Student', role: 'student', id: 'student-001' },
  'admin@test.com': { password: 'admin123', full_name: 'Test Admin', role: 'admin', id: 'admin-001' },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('test_series_session');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSession(parsed);
          setUser(parsed.user);
        }
      }
    } catch (e) {
      // no session
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const userRecord = USERS[email];
    if (!userRecord) {
      return { error: { message: 'User not found. Use student@test.com / test123' } };
    }
    if (userRecord.password !== password) {
      return { error: { message: 'Invalid password' } };
    }

    const userData = { id: userRecord.id, email, full_name: userRecord.full_name, role: userRecord.role };
    const sessionData = { user: userData, token: 'token-' + Date.now() };
    setSession(sessionData);
    setUser(userData);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('test_series_session', JSON.stringify(sessionData));
    }
    return { error: null };
  };

  const signUp = async (email, password, full_name) => {
    if (USERS[email]) {
      return { error: { message: 'User already exists. Try logging in.' } };
    }
    // Accept any signup for demo
    const userData = { id: 'new-' + Date.now(), email, full_name: full_name || email.split('@')[0], role: 'student' };
    const sessionData = { user: userData, token: 'token-' + Date.now() };
    setSession(sessionData);
    setUser(userData);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('test_series_session', JSON.stringify(sessionData));
    }
    return { error: null };
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('test_series_session');
    }
    return { error: null };
  };

  const value = useMemo(
    () => ({
      session,
      user,
      profile: user,
      loading,
      isAdmin: user?.role === 'admin',
      signIn,
      signUp,
      signOut,
    }),
    [session, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
