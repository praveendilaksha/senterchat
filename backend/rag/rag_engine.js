const fs = require('fs');
const path = require('path');

class RAGEngine {
  constructor(kbPath) {
    this.kbPath = kbPath || path.join(__dirname, 'kb_data.json');
    this.documents = [];
    this.vocabulary = new Set();
    this.docTermFreqs = [];
    this.idf = {};
    this.avgDocLength = 0;
    this.isLoaded = false;
    this.loadKB();
  }

  loadKB() {
    try {
      const data = fs.readFileSync(this.kbPath, 'utf8');
      this.documents = JSON.parse(data);
      this.buildIndex();
      this.isLoaded = true;
      console.log(`[RAGEngine] Loaded ${this.documents.length} knowledge base chunks.`);
    } catch (err) {
      console.error('[RAGEngine] Error loading KB:', err.message);
    }
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s\+\#\-]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1);
  }

  buildIndex() {
    let totalTokens = 0;
    const docCount = this.documents.length;
    const docFreq = {};

    this.docTermFreqs = this.documents.map(doc => {
      const fullText = `${doc.title} ${doc.tags ? doc.tags.join(' ') : ''} ${doc.category} ${doc.content}`;
      const tokens = this.tokenize(fullText);
      totalTokens += tokens.length;

      const tf = {};
      const uniqueTokensInDoc = new Set();

      tokens.forEach(token => {
        tf[token] = (tf[token] || 0) + 1;
        this.vocabulary.add(token);
        uniqueTokensInDoc.add(token);
      });

      uniqueTokensInDoc.forEach(token => {
        docFreq[token] = (docFreq[token] || 0) + 1;
      });

      return {
        docId: doc.id,
        length: tokens.length,
        tf
      };
    });

    this.avgDocLength = totalTokens / (docCount || 1);

    // Calculate BM25 IDF
    Object.keys(docFreq).forEach(term => {
      const df = docFreq[term];
      this.idf[term] = Math.log(1 + (docCount - df + 0.5) / (df + 0.5));
    });
  }

  /**
   * Search for top-K matching chunks using hybrid scoring (BM25 + Tag/Title Boosts + Exact Substring matching)
   */
  search(query, topK = 3) {
    if (!this.isLoaded || !query) return [];

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return this.documents.slice(0, topK);

    const k1 = 1.5;
    const b = 0.75;
    const lowerQuery = query.toLowerCase();

    const scored = this.documents.map((doc, idx) => {
      const docStat = this.docTermFreqs[idx];
      let bm25Score = 0;

      queryTokens.forEach(token => {
        const idf = this.idf[token] || 0.5;
        const tf = docStat.tf[token] || 0;
        const num = tf * (k1 + 1);
        const denom = tf + k1 * (1 - b + b * (docStat.length / (this.avgDocLength || 1)));
        bm25Score += idf * (num / (denom || 1));
      });

      // Semantic & exact tag match bonuses
      let bonusScore = 0;
      if (doc.tags) {
        doc.tags.forEach(tag => {
          if (lowerQuery.includes(tag.toLowerCase())) {
            bonusScore += 3.5;
          }
        });
      }

      if (lowerQuery.includes(doc.title.toLowerCase()) || doc.title.toLowerCase().includes(lowerQuery)) {
        bonusScore += 2.0;
      }

      // Keyword boost for special terms
      if (lowerQuery.includes('ticket') || lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('buy') || lowerQuery.includes('presave')) {
        if (doc.id === 'tickets-and-passes') bonusScore += 5.0;
      }
      if (lowerQuery.includes('snake') || lowerQuery.includes('song') || lowerQuery.includes('track') || lowerQuery.includes('hit')) {
        if (doc.id === 'dj-snake-headliner') bonusScore += 4.0;
      }
      if (lowerQuery.includes('time') || lowerQuery.includes('date') || lowerQuery.includes('when') || lowerQuery.includes('where') || lowerQuery.includes('location')) {
        if (doc.id === 'event-overview' || doc.id === 'venue-and-transportation') bonusScore += 4.0;
      }
      if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('whatsapp') || lowerQuery.includes('call')) {
        if (doc.id === 'contact-and-socials') bonusScore += 5.0;
      }
      if (lowerQuery.includes('zone') || lowerQuery.includes('arena') || lowerQuery.includes('vip') || lowerQuery.includes('food')) {
        if (doc.id === 'festival-zones') bonusScore += 3.0;
      }

      const totalScore = bm25Score + bonusScore;

      return {
        doc,
        score: totalScore
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored
      .filter(item => item.score >= 1.2)
      .slice(0, topK)
      .map(item => ({
        ...item.doc,
        relevanceScore: parseFloat(item.score.toFixed(3))
      }));
  }

  /**
   * Builds the formatted prompt context for the LLM
   */
  getContext(query, topK = 3) {
    const results = this.search(query, topK);
    if (results.length === 0) {
      return "No specific festival data found for this query.";
    }

    return results
      .map(item => `${item.title}:\n${item.content}`)
      .join('\n\n---\n\n');
  }
}

module.exports = RAGEngine;
