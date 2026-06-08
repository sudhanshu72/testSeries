// Script to import GK.json questions into Supabase
const GK_DATA = require('../data/GK.json');

const SUPABASE_URL = 'https://rqoppoeunupscsdsrbkb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxb3Bwb2V1bnVwc2NzZHNyYmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc1MTI4NCwiZXhwIjoyMDk2MzI3Mjg0fQ.cDrUQkDAtEKOZFjyNvC1vF91SIGvw3OUJHNEgwA3D6Y';

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

function clean(text) {
  return text.replace(/\s*\[cite:.*?\]/g, '').trim();
}

async function main() {
  console.log('Starting GK questions import...\n');

  // Step 1: Create the exam
  console.log('1. Creating exam...');
  const examRes = await fetch(`${SUPABASE_URL}/rest/v1/exams`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: clean(GK_DATA.exam_title),
      description: `${clean(GK_DATA.section)} - ${GK_DATA.questions.length} Questions`,
      duration_minutes: 60,
      total_marks: GK_DATA.questions.length,
      is_published: true,
    }),
  });

  const exams = await examRes.json();
  if (!Array.isArray(exams) || exams.length === 0) {
    console.error('Failed to create exam:', exams);
    return;
  }

  const examId = exams[0].id;
  console.log(`   ✅ Exam created: "${clean(GK_DATA.exam_title)}" (ID: ${examId})\n`);

  // Step 2: Insert questions in batches
  console.log(`2. Importing ${GK_DATA.questions.length} questions...`);

  const questions = GK_DATA.questions.map((q, index) => ({
    exam_id: examId,
    question_text: clean(q.question),
    question_type: 'mcq_single',
    options: Object.entries(q.options).map(([key, val]) => ({
      id: key.toLowerCase(),
      text: clean(val),
    })),
    correct_answer: clean(q.correct_answer).toLowerCase(),
    marks: 1,
    order_index: index + 1,
  }));

  // Insert in batches of 10
  const batchSize = 10;
  let imported = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(batch),
    });

    if (res.ok) {
      imported += batch.length;
      console.log(`   ✅ Imported ${imported}/${questions.length} questions`);
    } else {
      const err = await res.json();
      console.error(`   ❌ Batch failed:`, err);
    }
  }

  console.log(`\n🎉 Done! Imported ${imported} questions into exam "${clean(GK_DATA.exam_title)}"`);
  console.log(`\nExam ID: ${examId}`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);
}

main().catch(console.error);
