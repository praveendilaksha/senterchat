const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const testModels = [
  'gemini-2.5-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-2.5-pro'
];

async function checkAll() {
  for (const m of testModels) {
    try {
      console.log('Trying model:', m);
      const model = genAI.getGenerativeModel({ model: m, generationConfig: { temperature: 0.7 } });
      const res = await model.generateContent('Say hello naturally as Senter AI in 1 short sentence.');
      console.log('SUCCESS with', m, '=>', res.response.text());
      return m;
    } catch (e) {
      console.log('Failed', m, ':', e.message.substring(0, 100));
    }
  }
}

checkAll();
