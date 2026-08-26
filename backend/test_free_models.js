const apiKey = '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';

const testFree = [
  'openrouter/free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3.5-lightning:free',
  'stealth/ox-alpha'
];

async function test() {
  console.log('Testing free models...\n');
  for (const m of testFree) {
    try {
      const start = Date.now();
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sentermusicfestival.com',
          'X-Title': 'Senter AI'
        },
        body: JSON.stringify({
          model: m,
          max_tokens: 300,
          messages: [
            { role: 'system', content: 'You are Senter AI, the concierge for Senter Music Festival 2026. Be concise and friendly.' },
            { role: 'user', content: 'Who is headlining Senter Fest 2026?' }
          ]
        })
      });
      const latency = Date.now() - start;
      const data = await res.json();
      if (res.ok && data.choices?.[0]?.message?.content) {
        console.log(`[WORKING - ${latency}ms] ${m}:\n${data.choices[0].message.content.trim()}\n`);
      } else {
        console.log(`[FAILED] ${m} => ${data.error?.message || res.statusText}`);
      }
    } catch (e) {
      console.log(`[ERROR] ${m} => ${e.message}`);
    }
  }
}

test();
