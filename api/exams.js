// Vercel Serverless API - GET /api/exams
const GK_DATA = require('../data/GK.json');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const exams = [
    {
      id: '1',
      title: GK_DATA.exam_title.replace(/\s*\[cite:.*?\]/g, ''),
      description: `${GK_DATA.section.replace(/\s*\[cite:.*?\]/g, '')} - ${GK_DATA.questions.length} Questions`,
      questionsCount: GK_DATA.questions.length,
      duration: '60 minutes',
      difficulty: 'Medium',
      category: 'General Knowledge',
    },
  ];

  res.status(200).json({ exams });
};
