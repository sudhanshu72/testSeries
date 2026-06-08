// Vercel Serverless API - POST /api/auth
// Handles login and signup

const USERS = {
  'student@test.com': {
    password: 'test123',
    full_name: 'Test Student',
    role: 'student',
    id: 'student-001',
  },
  'admin@test.com': {
    password: 'admin123',
    full_name: 'Test Admin',
    role: 'admin',
    id: 'admin-001',
  },
};

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, email, password, full_name } = req.body;

  if (action === 'login') {
    const user = USERS[email];

    if (!user) {
      return res.status(401).json({ error: 'User not found. Use student@test.com / test123' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email,
        full_name: user.full_name,
        role: user.role,
      },
      token: 'token-' + Date.now(),
    });
  }

  if (action === 'signup') {
    if (USERS[email]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // For demo, just return success (not actually stored)
    return res.status(200).json({
      user: {
        id: 'new-' + Date.now(),
        email,
        full_name: full_name || '',
        role: 'student',
      },
      token: 'token-' + Date.now(),
    });
  }

  return res.status(400).json({ error: 'Invalid action. Use "login" or "signup"' });
};
