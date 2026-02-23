
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('broken_questions.json', 'utf-8'));

const topicIds = [
    '2902ab2d-9d77-4348-93a1-7228a60a9223',
    'b63cfb06-44e2-4752-959c-8f964177f1e7'
];

topicIds.forEach(topicId => {
    console.log(`--- Questions for Topic ${topicId} ---`);
    const subset = data.filter(q => q.topic_id === topicId).slice(0, 5);
    subset.forEach(q => {
        console.log(`ID: ${q.id}`);
        console.log(`TXT: ${q.question_text.substring(0, 200)}`);
        console.log(`OPTIONS: A:${q.option_a}, B:${q.option_b}, C:${q.option_c}, D:${q.option_d}`);
        console.log(`ANSWERS: opt=${q.correct_option}, ans=${q.correct_answer}`);
        console.log('---');
    });
});
