const GenUIService = require('./rag/genui_service.js');

const queries = [
  'can i refund my tickets?',
  'how do i cancel my ticket pass?',
  'what is the ticket price?',
  'buy tickets',
  'who is Flecan?',
  'who is DJ Snake?',
  'where is the festival located?',
  'can I bring outside drinks to the venue?',
  'how can I book a VIP table?'
];

console.log('Testing GenUI Intent Guard Filter:\n');
for (const q of queries) {
  const component = GenUIService.getUIComponent(q);
  console.log(`Query: "${q}"`);
  console.log(`=> Attached Component: ${component ? component.type : 'None (Text Only)'}`);
  console.log('----------------------------------------------------');
}
