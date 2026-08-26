require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const RAGEngine = require('./rag/rag_engine');
const LLMService = require('./rag/llm_service');
const GenUIService = require('./rag/genui_service');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Security: Payload Size Restriction (32kb max to prevent DoS)
app.use(express.json({ limit: '32kb' }));

// 2. Security: Standard HTTP Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 3. Security: CORS Configuration
const defaultOrigins = [
  'http://localhost:3000',
  'https://sentermusicfestival.com',
  'https://www.sentermusicfestival.com',
  'https://senterfest.com',
  'https://www.senterfest.com'
];

const envOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim().toLowerCase()) 
  : [];

const allowedOrigins = [...defaultOrigins, ...envOrigins];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser / same-origin requests
    if (!origin) return callback(null, true);

    const lowerOrigin = origin.toLowerCase();

    // Check wildcard, default allowed list, or hosting domains
    const isAllowed = 
      allowedOrigins.includes('*') ||
      allowedOrigins.some(allowed => lowerOrigin === allowed || lowerOrigin.endsWith('.' + allowed.replace(/^https?:\/\//, ''))) ||
      lowerOrigin.includes('localhost') ||
      lowerOrigin.includes('127.0.0.1') ||
      lowerOrigin.includes('onrender.com') ||
      lowerOrigin.includes('railway.app') ||
      lowerOrigin.includes('loca.lt') ||
      lowerOrigin.includes('ngrok') ||
      lowerOrigin.includes('senterfest') ||
      lowerOrigin.includes('sentermusicfestival');

    if (isAllowed) {
      callback(null, true);
    } else {
      // Allow embeddable widget cross-origin usage without crashing with 500
      console.warn(`[CORS] Request from: ${origin}`);
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Security: In-Memory IP Rate Limiter (50 requests/min per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 50;

function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + RATE_LIMIT_WINDOW;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  // Periodic cleanup every 5 minutes
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment before sending another message.'
    });
  }

  next();
}

// Initialize RAG and LLM
const rag = new RAGEngine(path.join(__dirname, 'rag', 'kb_data.json'));
let llm = new LLMService(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL || 'gemini-2.5-flash');

// Static assets
app.use('/widget', express.static(path.join(__dirname, '..', 'widget')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    festival: 'Senter Music Festival 2026',
    model: llm.modelName,
    kbDocuments: rag.documents.length,
    timestamp: new Date().toISOString()
  });
});

// Knowledge Base search
app.post('/api/kb/search', rateLimiter, (req, res) => {
  const { query, topK = 3 } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query string is required' });
  }

  const sanitizedQuery = query.trim().slice(0, 500);
  const results = rag.search(sanitizedQuery, Math.min(topK, 5));
  res.json({
    query: sanitizedQuery,
    count: results.length,
    results
  });
});

// Chat Endpoint with Rate Limiting & Input Sanitization
app.post('/api/chat', rateLimiter, async (req, res) => {
  const { message, stream = false, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Valid message string is required' });
  }

  // Security: Truncate excessively long inputs to prevent token-exhaustion attacks
  const sanitizedMessage = message.trim().slice(0, 1000);

  // Security: Sanitize history array
  const sanitizedHistory = Array.isArray(history) 
    ? history.slice(-6).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: typeof h.content === 'string' ? h.content.trim().slice(0, 1000) : ''
      }))
    : [];

  try {
    // 1. Retrieve RAG context
    const sources = rag.search(sanitizedMessage, 3);
    const context = rag.getContext(sanitizedMessage, 3);

    // 2. Resolve GenUI component (if applicable)
    const uiComponent = GenUIService.getUIComponent(sanitizedMessage, sources);

    // 3. If Streaming requested
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send initial sources & GenUI component metadata
      res.write(`data: ${JSON.stringify({
        type: 'meta',
        sources: sources.map(s => ({ title: s.title, category: s.category, score: s.relevanceScore })),
        uiComponent
      })}\n\n`);

      const streamGenerator = llm.generateStream(sanitizedMessage, context, sanitizedHistory);
      for await (const chunk of streamGenerator) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      return res.end();
    }

    // 4. Non-streaming standard response
    const reply = await llm.generateResponse(sanitizedMessage, context, sanitizedHistory);

    return res.json({
      reply,
      uiComponent,
      sources: sources.map(s => ({
        id: s.id,
        title: s.title,
        category: s.category,
        relevanceScore: s.relevanceScore
      })),
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('[API /api/chat] Error:', err);
    return res.status(500).json({
      error: 'Failed to process message'
    });
  }
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`Senter Music Festival AI RAG Server is LIVE!`);
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`Widget Script URL: http://localhost:${PORT}/widget/senter-chat-widget.js`);
  console.log(`Rate Limiting & Input Sanitization Active`);
  console.log(`======================================================`);
});

// Graceful Shutdown
function gracefulShutdown(signal) {
  console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('[Server] Closed all connections. Exiting.');
    process.exit(0);
  });

  // Force exit after 10s if connections won't close
  setTimeout(() => {
    console.error('[Server] Forceful shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch uncaught exceptions to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled Rejection:', reason);
});
