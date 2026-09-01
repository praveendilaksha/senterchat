const path = require('path');
const RAGEngine = require('../rag/rag_engine');
const LLMService = require('../rag/llm_service');

async function runTests() {
  console.log('--- Starting Senter Music Festival RAG & LLM Tests ---');
  
  const rag = new RAGEngine(path.join(__dirname, '..', 'rag', 'kb_data.json'));
  const llm = new LLMService(process.env.GEMINI_API_KEY, 'gemini-2.5-flash');

  const testQueries = [
    'How much do tickets cost and how can I buy them?',
    'Who is DJ Snake and what songs has he produced?',
    'What are the dates, location, and gate opening times of the festival?',
    'Is there a VIP lounge or table booking?',
    'What is Senter Records and Pem Kekula?',
    'How do I contact customer support or concierge?',
    'Can I get a refund or transfer my ticket to a friend?',
    'Can I upgrade my GA ticket to VIP?',
    'What is the age limit and can minors attend?',
    'Are cigarettes, smoking, or outside drinks allowed?',
    'Is dedicated event parking available at Port City?',
    'What happens if it rains during the festival?',
    'What personal data and NIC or passport information do you collect and why?',
    'What are the ticketing terms, purchase limits, and QR code rules?',
    'Are drones or professional cameras allowed at the event?'
  ];

  let passed = 0;

  for (const query of testQueries) {
    console.log(`\nQuery: "${query}"`);
    const results = rag.search(query, 2);
    
    if (results.length > 0) {
      console.log(`✓ Retrieved ${results.length} chunks (Top Match: "${results[0].title}" - Score: ${results[0].relevanceScore})`);
      const context = rag.getContext(query, 2);
      const response = await llm.generateResponse(query, context);
      console.log(`Response Snippet: ${response.substring(0, 160).replace(/\n/g, ' ')}...`);
      passed++;
    } else {
      console.error(`✗ Failed to retrieve any chunks for query: "${query}"`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed}/${testQueries.length} Passed`);
  console.log(`========================================`);
}

runTests();
