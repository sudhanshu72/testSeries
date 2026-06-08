// Hardcoded authentication for testing
// Replace with Supabase later when deployed

const HARDCODED_USERS = {
  'student@test.com': {
    password: 'test123',
    full_name: 'Test Student',
    role: 'student',
    id: 'student-001'
  },
  'admin@test.com': {
    password: 'admin123',
    full_name: 'Test Admin',
    role: 'admin',
    id: 'admin-001'
  }
};

export const hardcodedAuth = {
  // Simulate login
  signIn: async (email, password) => {
    console.log('Hardcoded auth: Attempting login for', email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = HARDCODED_USERS[email];
    
    if (!user) {
      return { error: { message: 'User not found' } };
    }
    
    if (user.password !== password) {
      return { error: { message: 'Invalid password' } };
    }
    
    // Return success with user data
    return {
      data: {
        user: {
          id: user.id,
          email: email,
          user_metadata: { full_name: user.full_name }
        },
        session: {
          access_token: 'hardcoded-token-' + Date.now(),
          refresh_token: 'hardcoded-refresh-' + Date.now(),
          user: {
            id: user.id,
            email: email
          }
        }
      },
      error: null
    };
  },
  
  // Simulate sign up
  signUp: async (email, password, full_name) => {
    console.log('Hardcoded auth: Attempting sign up for', email);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (HARDCODED_USERS[email]) {
      return { error: { message: 'User already exists' } };
    }
    
    // In real app, this would create user in database
    // For now, just return success
    return {
      data: {
        user: {
          id: 'temp-' + Date.now(),
          email: email,
          user_metadata: { full_name: full_name || '' }
        }
      },
      error: null
    };
  },
  
  // Simulate sign out
  signOut: async () => {
    console.log('Hardcoded auth: Signing out');
    await new Promise(resolve => setTimeout(resolve, 300));
    return { error: null };
  },
  
  // Get current session
  getSession: async () => {
    // For hardcoded auth, we'll store session in localStorage
    if (typeof window !== 'undefined') {
      const sessionStr = localStorage.getItem('hardcoded_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        // Check if session is expired (24 hours)
        if (Date.now() - session.created_at < 24 * 60 * 60 * 1000) {
          return { data: { session }, error: null };
        }
      }
    }
    return { data: { session: null }, error: null };
  },
  
  // Set session
  setSession: (session) => {
    if (typeof window !== 'undefined' && session) {
      const sessionWithTime = {
        ...session,
        created_at: Date.now()
      };
      localStorage.setItem('hardcoded_session', JSON.stringify(sessionWithTime));
    }
  },
  
  // Clear session
  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hardcoded_session');
    }
  }
};