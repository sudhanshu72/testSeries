// Vercel Serverless API - GET /api/questions?examId=xxx
// Fetches questions from Supabase (without correct answers for students)

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rqoppoeunupscsdsrbkb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxb3Bwb2V1bnVwc2NzZHNyYmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MTI4NCwiZXhwIjoyMDk2MzI3Mjg0fQ.cDrUQkDAtEKOZFjyNvC1vF91SIGvw3OUJHNEgwA3D6Y';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { examId } = req.query;

  if (!examId) {
    return res.status(400).json({ error: 'examId is required' });
  }

  try {
    // Fetch questions (ordered by order_index)
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/questions?exam_id=eq.${examId}&order=order_index.asc&select=id,question_text,options,order_index,marks`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const questions = await response.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this exam' });
    }

    // Format for frontend (no correct answers sent to client!)
    const formatted = questions.map(q => ({
      question_number: q.order_index,
      question: q.question_text,
      options: Object.fromEntries(
        q.options.map(opt => [opt.id.toUpperCase(), opt.text])
      ),
    }));

    // Fetch exam title
    const examRes = await fetch(
      `${SUPABASE_URL}/rest/v1/exams?id=eq.${examId}&select=title`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const examData = await examRes.json();

    res.status(200).json({
      examId,
      title: examData[0]?.title || 'Exam',
      questions: formatted,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};
