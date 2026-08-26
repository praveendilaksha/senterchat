# 🎧 Senter Music Festival 2026 — AI Chatbot & RAG System

An intelligent, festival-themed AI Concierge powered by a Hybrid Retrieval-Augmented Generation (RAG) system with a verified Knowledge Base for the **Senter Music Festival 2026 (DJ Snake Live in Sri Lanka)**, packaged with a zero-conflict embeddable web widget and a complete demo website.

---

## 🌟 Key Features

- **Hybrid RAG Retrieval Engine**: Combines BM25 keyword matching with semantic scoring and tag boosting across categorized festival knowledge chunks.
- **Dual-Engine AI Support**:
  - Direct integration with **Google Gemini (`gemini-2.5-flash` / `gemini-2.0-flash`)** using `@google/generative-ai`.
  - Built-in **Smart Prototype Engine** that generates verified, instant answers directly from RAG chunks even when offline or testing without an API key.
- **Zero-Conflict Embeddable Web Widget**:
  - Uses **Web Components & Shadow DOM** (`<senter-chat-widget>`).
  - Total style isolation: host website CSS rules (Tailwind, resets, custom cursors) will **never** alter the widget, and the widget will never leak styles into the website.
  - Interactive quick suggestion chips (Tickets, DJ Snake, Venue, Concierge).
  - Web Audio sound effects, conversation reset, and markdown link support.
- **Complete Mirror Demo Website**:
  - Live simulation styled with the dark neon aesthetic of [sentermusicfestival.com](https://www.sentermusicfestival.com/).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create or edit `backend/.env`:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(Note: If no API key is provided, the chatbot seamlessly operates in Smart Prototype mode using the local RAG knowledge base)*.

### 3. Start the Server
```bash
npm start
```
Open your browser at **[http://localhost:3000](http://localhost:3000)** to view the live festival prototype and interact with the chatbot!

---

## 📚 Knowledge Base Coverage

Located at [`backend/rag/kb_data.json`](backend/rag/kb_data.json):
1. **Event Overview & Schedule**: Oct 30–31, 2026 • 6PM–2AM daily • Port City Colombo.
2. **Headliner DJ Snake**: 60M+ followers, Billion Streams Club hits (*Let Me Love You*, *Lean On*, *Taki Taki*, *Turn Down for What*, *Middle*).
3. **Supporting Lineup**: DJ Mass, Flecan, + 5 TBA support acts.
4. **Tickets & Passes**: Phase 1 GA (LKR 15,000), Phase 1 VIP (LKR 45,000), VVIP Tables & Cabanas via WhatsApp (+94 77 117 7118).
5. **7 Immersive Zones**: Main Stage Arena, VIP Sky Lounge, Halloween Experience, F&B Village, Brand Activations, Content Creation, Influencer Lounge.
6. **Competitions & Open Calls**: DJ Competition, Cosplay Runway, Wall Art BTS.
7. **Organizers**: Senter Records (producers of chart-topper *"Pem Kekula"*) & LFG Entertainment.
8. **Logistics & Policies**: Age limits (18+), parking, ride-share drop-offs, security policies.

---

## 🔌 Embed Widget on Your Website

Add this snippet before the `</body>` tag:
```html
<script src="http://localhost:3000/widget/senter-chat-widget.js" defer></script>
```

For full Next.js, React, Webflow, and WordPress guides, see [`widget/README.md`](widget/README.md).

---

## 🧪 Testing RAG Pipeline

Run automated retrieval and response generation tests:
```bash
npm test
```
