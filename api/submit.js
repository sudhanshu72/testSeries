// Vercel Serverless API - POST /api/submit
// Scores the test by comparing with correct answers from database

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rqoppoeunupscsdsrbkb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxb3Bwb2V1bnVwc2NzZHNyYmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MTI4NCwiZXhwIjoyMDk2MzI3Mjg0fQ.cDrUQkDAtEKOZFjyNvC1vF91SIGvw3OUJHNEgwA3D6Y';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { examId, answers } = req.body;

  if (!examId || !answers) {
    return res.status(400).json({ error: 'examId and answers are required' });
  }

  try {
    // Fetch questions with correct answers from database
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/questions?exam_id=eq.${examId}&order=order_index.asc&select=id,question_text,options,correct_answer,order_index`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const questions = await response.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Calculate score
    let correctCount = 0;
    const results = questions.map((q, index) => {
      const userAnswer = answers[index] ? answers[index].toLowerCase() : null;
      const correctAnswer = q.correct_answer.toLowerCase();
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) correctCount++;

      return {
        question_number: q.order_index,
        question: q.question_text,
        options: Object.fromEntries(
          q.options.map(opt => [opt.id.toUpperCase(), opt.text])
        ),
        correct_answer: correctAnswer.toUpperCase(),
        user_answer: userAnswer ? userAnswer.toUpperCase() : null,
        is_correct: isCorrect,
      };
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    res.status(200).json({
      score: percentage,
      correct_answers: correctCount,
      total_questions: totalQuestions,
      results,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit test' });
  }
};
