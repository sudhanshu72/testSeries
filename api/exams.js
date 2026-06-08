// Vercel Serverless API - GET /api/exams
// Fetches published exams from Supabase

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rqoppoeunupscsdsrbkb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxb3Bwb2V1bnVwc2NzZHNyYmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MTI4NCwiZXhwIjoyMDk2MzI3Mjg0fQ.cDrUQkDAtEKOZFjyNvC1vF91SIGvw3OUJHNEgwA3D6Y';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/exams?is_published=eq.true&select=id,title,description,duration_minutes,total_marks`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    const exams = await response.json();

    // Format for frontend
    const formatted = exams.map(exam => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      questionsCount: exam.total_marks,
      duration: `${exam.duration_minutes} minutes`,
      difficulty: 'Medium',
      category: 'General Knowledge',
    }));

    res.status(200).json({ exams: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};
