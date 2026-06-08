-- Sample published exam for frontend development (no correct_answer in client queries)

insert into public.exams (
  title,
  description,
  duration_minutes,
  total_marks,
  is_published
)
values (
  'Sample Aptitude Test',
  'A short demo exam with single-answer MCQs. Use this to verify the exams list and question fetch flows.',
  30,
  5,
  true
);

insert into public.questions (exam_id, question_text, options, correct_answer, marks, order_index)
select
  e.id,
  v.question_text,
  v.options::jsonb,
  v.correct_answer,
  1,
  v.order_index
from public.exams e
cross join (
  values
    (
      1,
      'What is 15% of 200?',
      '[{"id":"a","text":"20"},{"id":"b","text":"30"},{"id":"c","text":"25"},{"id":"d","text":"35"}]',
      'b'
    ),
    (
      2,
      'Which planet is known as the Red Planet?',
      '[{"id":"a","text":"Venus"},{"id":"b","text":"Mars"},{"id":"c","text":"Jupiter"},{"id":"d","text":"Saturn"}]',
      'b'
    ),
    (
      3,
      'What is the capital of France?',
      '[{"id":"a","text":"Berlin"},{"id":"b","text":"Madrid"},{"id":"c","text":"Paris"},{"id":"d","text":"Rome"}]',
      'c'
    ),
    (
      4,
      'How many sides does a hexagon have?',
      '[{"id":"a","text":"5"},{"id":"b","text":"6"},{"id":"c","text":"7"},{"id":"d","text":"8"}]',
      'b'
    ),
    (
      5,
      'Which gas do plants absorb from the atmosphere during photosynthesis?',
      '[{"id":"a","text":"Oxygen"},{"id":"b","text":"Nitrogen"},{"id":"c","text":"Carbon dioxide"},{"id":"d","text":"Hydrogen"}]',
      'c'
    )
) as v(order_index, question_text, options, correct_answer)
where e.title = 'Sample Aptitude Test';
