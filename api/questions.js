// Vercel Serverless API - GET /api/questions?examId=1
const GK_DATA = require('../data/GK.json');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { examId } = req.query;

  if (examId !== '1') {
    return res.status(404).json({ error: 'Exam not found' });
  }

  // Clean up citation tags from questions
  const questions = GK_DATA.questions.map((q) => ({
    question_number: q.question_number,
    question: q.question.replace(/\s*\[cite:.*?\]/g, ''),
    options: Object.fromEntries(
      Object.entries(q.options).map(([key, val]) => [
        key,
        val.replace(/\s*\[cite:.*?\]/g, ''),
      ])
    ),
  }));

  res.status(200).json({
    examId: '1',
    title: GK_DATA.exam_title.replace(/\s*\[cite:.*?\]/g, ''),
    section: GK_DATA.section.replace(/\s*\[cite:.*?\]/g, ''),
    questions,
  });
};
