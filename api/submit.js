// Vercel Serverless API - POST /api/submit
const GK_DATA = require('../data/GK.json');

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

  const { examId, answers } = req.body;

  if (examId !== '1') {
    return res.status(404).json({ error: 'Exam not found' });
  }

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Answers are required' });
  }

  // Calculate score
  let correctCount = 0;
  const results = [];

  GK_DATA.questions.forEach((question, index) => {
    const correctAnswer = question.correct_answer.replace(/\s*\[cite:.*?\]/g, '').trim();
    const userAnswer = answers[index] || null;
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) correctCount++;

    results.push({
      question_number: question.question_number,
      question: question.question.replace(/\s*\[cite:.*?\]/g, ''),
      options: Object.fromEntries(
        Object.entries(question.options).map(([key, val]) => [
          key,
          val.replace(/\s*\[cite:.*?\]/g, ''),
        ])
      ),
      correct_answer: correctAnswer,
      user_answer: userAnswer,
      is_correct: isCorrect,
      explanation: question.explanation.replace(/\s*\[cite:.*?\]/g, ''),
    });
  });

  const totalQuestions = GK_DATA.questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  res.status(200).json({
    score: percentage,
    correct_answers: correctCount,
    total_questions: totalQuestions,
    results,
  });
};
