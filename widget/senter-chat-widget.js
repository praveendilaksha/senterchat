/**
 * Senter Music Festival 2026 — AI Concierge Widget
 * Production Web Component with GenUI / A2UI Component Rendering
 * 
 * Integration:
 * <script src="/widget/senter-chat-widget.js" defer></script>
 * 
 * Configuration:
 * <senter-chat-widget 
 *    api-endpoint="https://api.sentermusicfestival.com"
 *    position="bottom-right">
 * </senter-chat-widget>
 */

(function () {
  if (customElements.get('senter-chat-widget')) return;

  // --- SVG Icon Library ---
  const ICONS = {
    chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
    close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>`,
    refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
    minimize: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    ticket: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
    music: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    mapPin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
    sparkle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>`,
    calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    arrowRight: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    externalLink: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
  };

  const TEMPLATE = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

      :host {
        --w-accent: #ef4444;
        --w-accent-hover: #dc2626;
        --w-accent-subtle: rgba(239, 68, 68, 0.12);
        --w-accent-border: rgba(239, 68, 68, 0.25);
        --w-bg: #000000;
        --w-bg-elevated: #0a0a0a;
        --w-bg-surface: rgba(255, 255, 255, 0.03);
        --w-bg-surface-hover: rgba(255, 255, 255, 0.06);
        --w-border: rgba(255, 255, 255, 0.08);
        --w-border-hover: rgba(255, 255, 255, 0.15);
        --w-text: #f5f5f5;
        --w-text-secondary: #a3a3a3;
        --w-text-tertiary: #737373;
        --w-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        --w-radius: 20px;
        --w-radius-sm: 12px;
        --w-radius-xs: 8px;
        --w-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05);
        --w-transition: cubic-bezier(0.16, 1, 0.3, 1);

        position: fixed;
        z-index: 2147483647;
        bottom: 24px;
        right: 24px;
        font-family: var(--w-font);
        color: var(--w-text);
        pointer-events: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      :host([position="bottom-left"]) {
        right: auto;
        left: 24px;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.16) #000000;
      }

      ::-webkit-scrollbar {
        width: 3px;
        height: 3px;
      }

      ::-webkit-scrollbar-track {
        background: #000000;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.16);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--w-accent);
      }

      button, input, textarea, a {
        font-family: inherit;
        cursor: pointer;
      }

      .container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        pointer-events: auto;
      }

      :host([position="bottom-left"]) .container {
        align-items: flex-start;
      }

      /* ── Launcher Button ── */
      .launcher {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        background: var(--w-accent);
        border: none;
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.35), 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: all 0.3s var(--w-transition);
        position: relative;
        outline: none;
      }

      .launcher:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(239, 68, 68, 0.45), 0 4px 12px rgba(0,0,0,0.5);
      }

      .launcher:active {
        transform: scale(0.95);
      }

      .launcher .icon-chat,
      .launcher .icon-close {
        position: absolute;
        transition: all 0.25s var(--w-transition);
      }

      .launcher .icon-close {
        opacity: 0;
        transform: rotate(-90deg) scale(0.5);
      }

      .is-open .launcher .icon-chat {
        opacity: 0;
        transform: rotate(90deg) scale(0.5);
      }

      .is-open .launcher .icon-close {
        opacity: 1;
        transform: rotate(0deg) scale(1);
      }

      /* ── Launcher Teaser Popover ── */
      .launcher-teaser {
        position: absolute;
        bottom: 8px;
        right: 70px;
        background: rgba(10, 10, 10, 0.96);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(239, 68, 68, 0.4);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.85), 0 0 20px rgba(239, 68, 68, 0.2);
        padding: 9px 13px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        pointer-events: auto;
        cursor: pointer;
        opacity: 0;
        transform: translateX(12px) scale(0.94);
        transition: all 0.35s var(--w-transition);
        z-index: 10;
      }

      :host([position="bottom-left"]) .launcher-teaser {
        right: auto;
        left: 70px;
        transform: translateX(-12px) scale(0.94);
      }

      .launcher-teaser.show {
        opacity: 1;
        transform: translateX(0) scale(1);
      }

      .launcher-teaser:hover {
        border-color: var(--w-accent);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(239, 68, 68, 0.35);
        transform: translateY(-2px);
      }

      .is-open .launcher-teaser {
        opacity: 0 !important;
        pointer-events: none !important;
        transform: translateY(10px) !important;
      }

      .teaser-dot {
        width: 7px;
        height: 7px;
        background: #ef4444;
        border-radius: 50%;
        box-shadow: 0 0 8px #ef4444;
        animation: pulseTeaser 1.8s infinite ease-in-out;
        flex-shrink: 0;
      }

      @keyframes pulseTeaser {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.85); }
      }

      .teaser-text {
        font-size: 11.5px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.01em;
      }

      .teaser-close {
        background: transparent;
        border: none;
        color: var(--w-text-tertiary);
        font-size: 14px;
        line-height: 1;
        padding: 2px 4px;
        margin-left: 2px;
        cursor: pointer;
        transition: color 0.2s;
      }

      .teaser-close:hover {
        color: #ffffff;
      }

      /* ── Chat Panel ── */
      .panel {
        position: absolute;
        bottom: 68px;
        right: 0;
        width: 410px;
        max-width: calc(100vw - 32px);
        height: 620px;
        max-height: calc(100vh - 100px);
        background: var(--w-bg);
        border: 1px solid var(--w-border);
        border-radius: var(--w-radius);
        box-shadow: var(--w-shadow);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(16px) scale(0.95);
        transform-origin: bottom right;
        transition: opacity 0.3s var(--w-transition), transform 0.3s var(--w-transition);
        pointer-events: none;
      }

      :host([position="bottom-left"]) .panel {
        right: auto;
        left: 0;
        transform-origin: bottom left;
      }

      .is-open .panel {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      /* ── Black Header ── */
      .header {
        padding: 14px 18px;
        border-bottom: 1px solid var(--w-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #000000;
        flex-shrink: 0;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .header-brand {
        width: 32px;
        height: 32px;
        border-radius: var(--w-radius-xs);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0a0a0a;
        border: 1px solid rgba(255, 255, 255, 0.15);
        flex-shrink: 0;
      }

      .header-brand img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .header-title-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .header-title {
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #fff;
        line-height: 1;
      }

      .status-dot {
        width: 6px;
        height: 6px;
        background: #22c55e;
        border-radius: 50%;
        display: inline-block;
        flex-shrink: 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .header-btn {
        background: transparent;
        border: 1px solid transparent;
        width: 30px;
        height: 30px;
        border-radius: var(--w-radius-xs);
        color: var(--w-text-tertiary);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        outline: none;
      }

      .header-btn:hover {
        background: var(--w-bg-surface-hover);
        color: #ffffff;
        border-color: var(--w-border);
      }

      /* ── Welcome Screen ── */
      .welcome {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      .welcome-hero {
        padding: 24px 20px 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .welcome-logo {
        max-width: 175px;
        max-height: 58px;
        width: auto;
        height: auto;
        object-fit: contain;
        margin-bottom: 12px;
        filter: drop-shadow(0 4px 16px rgba(239, 68, 68, 0.2));
      }

      .welcome-desc {
        font-size: 12px;
        color: var(--w-text-secondary);
        line-height: 1.5;
        max-width: 320px;
        margin: 0 auto;
      }

      .welcome-topics {
        padding: 0 16px 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .topic-btn {
        display: flex;
        align-items: center;
        gap: 9px;
        background: var(--w-bg-surface);
        border: 1px solid var(--w-border);
        border-radius: var(--w-radius-sm);
        padding: 10px 12px;
        text-align: left;
        color: var(--w-text);
        transition: all 0.2s var(--w-transition);
        outline: none;
      }

      .topic-btn:hover {
        background: var(--w-bg-surface-hover);
        border-color: var(--w-accent-border);
        transform: translateY(-1px);
      }

      .topic-icon {
        width: 28px;
        height: 28px;
        border-radius: var(--w-radius-xs);
        background: var(--w-accent-subtle);
        border: 1px solid var(--w-accent-border);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--w-accent);
        flex-shrink: 0;
      }

      .topic-title {
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ── Messages Area ── */
      .messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        scroll-behavior: smooth;
      }

      .messages::-webkit-scrollbar {
        width: 4px;
      }
      .messages::-webkit-scrollbar-track {
        background: transparent;
      }
      .messages::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      .msg {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 90%;
        animation: msgIn 0.25s var(--w-transition) forwards;
      }

      @keyframes msgIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .msg.bot { align-self: flex-start; width: 100%; max-width: 94%; }
      .msg.user { align-self: flex-end; max-width: 82%; }

      .bubble {
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 13px;
        line-height: 1.55;
        word-break: break-word;
        user-select: text;
        cursor: text;
      }

      .msg.bot .bubble {
        background: var(--w-bg-surface);
        border: 1px solid var(--w-border);
        border-bottom-left-radius: 4px;
        color: var(--w-text-secondary);
      }

      .msg.user .bubble {
        background: var(--w-accent);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .bubble strong { color: #fff; font-weight: 700; }
      .bubble em { font-style: italic; }
      .bubble code {
        background: rgba(255, 255, 255, 0.08);
        padding: 1px 5px;
        border-radius: 4px;
        font-size: 12px;
        font-family: 'SF Mono', 'Fira Code', monospace;
      }

      .bubble a:not(.genui-btn) {
        color: var(--w-accent);
        text-decoration: none;
        font-weight: 600;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s;
      }
      .bubble a:not(.genui-btn):hover {
        border-bottom-color: var(--w-accent);
      }
      .msg.user .bubble a:not(.genui-btn) {
        color: #ffffff;
        border-bottom-color: rgba(255,255,255,0.4);
      }

      .bubble h3, .bubble h4 {
        font-size: 13px;
        font-weight: 800;
        color: #fff;
        margin: 8px 0 4px 0;
        letter-spacing: 0.02em;
      }
      .bubble h3:first-child, .bubble h4:first-child {
        margin-top: 0;
      }

      .bubble ul, .bubble ol {
        margin: 6px 0 6px 16px;
      }

      .bubble li {
        margin-bottom: 3px;
        font-size: 13px;
        line-height: 1.5;
      }

      .bubble li::marker {
        color: var(--w-accent);
      }

      .bubble hr {
        border: none;
        border-top: 1px solid var(--w-border);
        margin: 8px 0;
      }

      .msg-meta {
        font-size: 10px;
        color: var(--w-text-tertiary);
        padding: 0 4px;
      }

      .msg.user .msg-meta {
        align-self: flex-end;
      }

      /* ── GenUI / A2UI Component Cards ── */
      .genui-container {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        animation: msgIn 0.3s var(--w-transition) forwards;
      }

      .genui-card {
        background: rgba(18, 18, 22, 0.95);
        border: 1px solid var(--w-border);
        border-radius: var(--w-radius-sm);
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: border-color 0.2s;
      }
      .genui-card:hover {
        border-color: var(--w-border-hover);
      }

      .genui-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
      }
      .genui-card-title {
        font-size: 12px;
        font-weight: 800;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        line-height: 1.2;
      }
      .genui-card-subtitle {
        font-size: 10.5px;
        color: var(--w-text-tertiary);
        margin-top: 2px;
      }
      .genui-badge {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 2px 7px;
        border-radius: 4px;
        background: var(--w-accent-subtle);
        color: var(--w-accent);
        border: 1px solid var(--w-accent-border);
        white-space: nowrap;
      }
      .genui-badge.popular {
        background: var(--w-accent);
        color: #ffffff;
        border: none;
      }

      /* Tickets GenUI */
      .genui-tier-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .genui-tier-item {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--w-border);
        border-radius: var(--w-radius-xs);
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        transition: all 0.2s;
      }
      .genui-tier-item.featured {
        background: rgba(239, 68, 68, 0.08);
        border-color: var(--w-accent-border);
      }
      .genui-tier-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .genui-tier-name {
        font-size: 12px;
        font-weight: 700;
        color: #ffffff;
      }
      .genui-tier-price {
        font-size: 13px;
        font-weight: 900;
        color: var(--w-accent);
      }
      .genui-tier-item.featured .genui-tier-price {
        color: #ffffff;
      }
      .genui-feature-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .genui-feature-item {
        font-size: 10.5px;
        color: var(--w-text-secondary);
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .genui-feature-item svg {
        color: var(--w-accent);
        flex-shrink: 0;
      }
      .genui-btn,
      .bubble a.genui-btn,
      a.genui-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: #ef4444 !important;
        color: #ffffff !important;
        text-decoration: none !important;
        font-size: 11px;
        font-weight: 800 !important;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 9px 14px;
        border-radius: var(--w-radius-xs);
        border: none;
        transition: all 0.2s;
        text-align: center;
        box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
      }
      .genui-btn:hover,
      .bubble a.genui-btn:hover,
      a.genui-btn:hover {
        background: #dc2626 !important;
        color: #ffffff !important;
        border-bottom-color: transparent !important;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(239, 68, 68, 0.5);
      }
      .genui-btn.secondary,
      .bubble a.genui-btn.secondary,
      a.genui-btn.secondary {
        background: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid var(--w-border) !important;
        color: #ffffff !important;
        box-shadow: none;
      }
      .genui-btn.secondary:hover,
      .bubble a.genui-btn.secondary:hover,
      a.genui-btn.secondary:hover {
        background: var(--w-bg-surface-hover) !important;
        border-color: var(--w-accent-border) !important;
      }
      .genui-btn.whatsapp,
      .bubble a.genui-btn.whatsapp,
      a.genui-btn.whatsapp {
        background: #22c55e !important;
        color: #000000 !important;
        font-weight: 800 !important;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      }
      .genui-btn.whatsapp:hover,
      .bubble a.genui-btn.whatsapp:hover,
      a.genui-btn.whatsapp:hover {
        background: #16a34a !important;
        color: #ffffff !important;
      }

      /* Artist Spotlight GenUI */
      .genui-hits-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
      }
      .genui-hit-pill {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid var(--w-border);
        border-radius: 6px;
        padding: 5px 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .genui-hit-title {
        font-size: 10px;
        font-weight: 600;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .genui-hit-streams {
        font-size: 9px;
        font-weight: 800;
        color: var(--w-accent);
        margin-left: 4px;
      }

      /* Venue Schedule GenUI */
      .genui-venue-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }
      .genui-venue-box {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--w-border);
        border-radius: var(--w-radius-xs);
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .genui-venue-label {
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--w-text-tertiary);
        font-weight: 700;
      }
      .genui-venue-value {
        color: #ffffff;
        font-size: 11px;
        font-weight: 600;
      }

      /* Zones Explorer GenUI */
      .genui-zones-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 180px;
        overflow-y: auto;
      }
      .genui-zone-pill {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--w-border);
        border-radius: var(--w-radius-xs);
        padding: 6px 10px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: border-color 0.2s;
      }
      .genui-zone-pill:hover {
        border-color: var(--w-accent-border);
      }
      .genui-zone-num {
        font-size: 9.5px;
        font-weight: 900;
        color: var(--w-accent);
        letter-spacing: 0.05em;
      }
      .genui-zone-name {
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
      }
      .genui-zone-desc {
        font-size: 10px;
        color: var(--w-text-tertiary);
        margin-left: auto;
      }

      /* ── Typing Indicator ── */
      .typing {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 12px 14px;
        background: var(--w-bg-surface);
        border: 1px solid var(--w-border);
        border-radius: 16px;
        border-bottom-left-radius: 4px;
        width: fit-content;
      }

      .typing-dot {
        width: 5px;
        height: 5px;
        background: var(--w-text-tertiary);
        border-radius: 50%;
        animation: typingPulse 1.4s infinite both;
      }
      .typing-dot:nth-child(2) { animation-delay: 0.15s; }
      .typing-dot:nth-child(3) { animation-delay: 0.3s; }

      @keyframes typingPulse {
        0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
        40% { opacity: 1; transform: scale(1.1); }
      }

      /* ── Input Area ── */
      .footer {
        padding: 12px 16px 14px;
        border-top: 1px solid var(--w-border);
        background: var(--w-bg-elevated);
        flex-shrink: 0;
      }

      .input-row {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--w-bg-surface);
        border: 1px solid var(--w-border);
        border-radius: var(--w-radius-sm);
        padding: 4px 4px 4px 14px;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .input-row:focus-within {
        border-color: var(--w-accent-border);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
      }

      .input-field {
        flex: 1;
        background: transparent;
        border: none;
        color: var(--w-text);
        font-size: 13px;
        outline: none;
        min-width: 0;
      }

      .input-field::placeholder {
        color: var(--w-text-tertiary);
      }

      .send-btn {
        width: 34px;
        height: 34px;
        border-radius: var(--w-radius-xs);
        background: var(--w-accent);
        border: none;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        outline: none;
        flex-shrink: 0;
      }

      .send-btn:hover {
        background: var(--w-accent-hover);
      }

      .send-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .footer-meta {
        text-align: center;
        font-size: 10px;
        color: var(--w-text-tertiary);
        margin-top: 8px;
        letter-spacing: 0.02em;
      }

      .footer-meta a {
        color: var(--w-text-tertiary);
        text-decoration: none;
        font-weight: 600;
      }

      .footer-meta a:hover {
        color: var(--w-accent);
      }

      /* ── Quick Reply Chips ── */
      .chips {
        padding: 0 16px 8px;
        display: flex;
        gap: 6px;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
        flex-shrink: 0;
      }
      .chips::-webkit-scrollbar { display: none; }

      .chip {
        background: var(--w-bg-surface);
        border: 1px solid var(--w-border);
        padding: 6px 12px;
        border-radius: 20px;
        color: var(--w-text-secondary);
        font-size: 11px;
        font-weight: 600;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        outline: none;
        flex-shrink: 0;
      }

      .chip:hover {
        background: var(--w-accent-subtle);
        color: #fff;
        border-color: var(--w-accent-border);
      }

      /* ── View States ── */
      .view-welcome,
      .view-chat {
        display: none;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }

      .view-welcome.active,
      .view-chat.active {
        display: flex;
      }

      /* ── Mobile Responsive ── */
      @media (max-width: 480px) {
        :host {
          bottom: 12px;
          right: 12px;
        }
        .panel {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
          border: none;
          transform-origin: bottom center;
        }
        .launcher {
          width: 52px;
          height: 52px;
          border-radius: 14px;
        }
      }
    </style>

    <div class="container" id="container">
      <!-- Launcher Teaser Popover -->
      <div class="launcher-teaser" id="launcherTeaser">
        <span class="teaser-dot"></span>
        <span class="teaser-text">Ask me anything about SenterFest!</span>
        <button class="teaser-close" id="teaserClose" aria-label="Dismiss">&times;</button>
      </div>

      <!-- Launcher -->
      <button class="launcher" id="launcher" aria-label="Open chat">
        <span class="icon-chat">${ICONS.chat}</span>
        <span class="icon-close">${ICONS.close}</span>
      </button>

      <!-- Panel -->
      <div class="panel" id="panel">
        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <div class="header-brand">
              <img src="/senter_logo.jpg" alt="Senter Logo" />
            </div>
            <div class="header-title-wrap">
              <span class="header-title">Senter AI</span>
              
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" id="resetBtn" title="New conversation" aria-label="New conversation">${ICONS.refresh}</button>
            <button class="header-btn" id="minimizeBtn" title="Minimize" aria-label="Minimize chat">${ICONS.minimize}</button>
          </div>
        </div>

        <!-- Welcome View -->
        <div class="view-welcome active" id="viewWelcome">
          <div class="welcome">
            <div class="welcome-hero">
              <img src="/SenterFest-logo2.webp" alt="Senter Music Festival" class="welcome-logo" />
              <p class="welcome-desc">Your official AI assistant for Senter Music Festival. Ask anything about tickets, lineup, venue, and VIP tables.</p>
            </div>
            <div class="welcome-topics">
              <button class="topic-btn" data-query="What are the ticket prices and passes?">
                <span class="topic-icon">${ICONS.ticket}</span>
                <span class="topic-title">Tickets</span>
              </button>
              <button class="topic-btn" data-query="Tell me about DJ Snake and the artist lineup">
                <span class="topic-icon">${ICONS.music}</span>
                <span class="topic-title">Lineup</span>
              </button>
              <button class="topic-btn" data-query="Where is the festival venue located?">
                <span class="topic-icon">${ICONS.mapPin}</span>
                <span class="topic-title">Venue</span>
              </button>
              <button class="topic-btn" data-query="What are the festival timings and schedule?">
                <span class="topic-icon">${ICONS.calendar}</span>
                <span class="topic-title">Schedule</span>
              </button>
              <button class="topic-btn" data-query="What are the festival zones and experiences?">
                <span class="topic-icon">${ICONS.sparkle}</span>
                <span class="topic-title">Zones</span>
              </button>
              <button class="topic-btn" data-query="How do I contact VIP concierge for table bookings?">
                <span class="topic-icon">${ICONS.phone}</span>
                <span class="topic-title">VIP Tables</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Chat View -->
        <div class="view-chat" id="viewChat">
          <div class="messages" id="messages" role="log" aria-live="polite" aria-label="Chat messages"></div>
          <div class="chips" id="chips">
            <button class="chip" data-query="Ticket prices">Ticket prices</button>
            <button class="chip" data-query="DJ Snake lineup">Artist lineup</button>
            <button class="chip" data-query="Venue and dates">Venue & dates</button>
            <button class="chip" data-query="VIP concierge contact">VIP concierge</button>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <form class="input-row" id="form">
            <input
              type="text"
              class="input-field"
              id="input"
              placeholder="Ask about the festival..."
              autocomplete="off"
              maxlength="500"
            />
            <button type="submit" class="send-btn" id="sendBtn" aria-label="Send">${ICONS.send}</button>
          </form>
          <div class="footer-meta">
            <a href="https://www.sentermusicfestival.com" target="_blank" rel="noopener">sentermusicfestival.com</a>
          </div>
        </div>
      </div>
    </div>
  `;

  class SenterChatWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = TEMPLATE;

      this.isOpen = false;
      this.isWaiting = false;
      this.inChatView = false;
      this.history = [];
      this.apiEndpoint = this.getAttribute('api-endpoint') || this._defaultEndpoint();
    }

    _defaultEndpoint() {
      if (window.location.origin && window.location.origin.startsWith('http')) {
        return window.location.origin;
      }
      return 'http://localhost:3000';
    }

    connectedCallback() {
      this._bindElements();
      this._attachEvents();
      this._initTeaser();
    }

    disconnectedCallback() {
      // Clear any pending teaser timers
      if (this._showTimerId) clearTimeout(this._showTimerId);
      if (this._hideTimerId) clearTimeout(this._hideTimerId);
    }

    _bindElements() {
      const $ = (id) => this.shadowRoot.getElementById(id);
      this.container = $('container');
      this.launcher = $('launcher');
      this.panel = $('panel');
      this.teaser = $('launcherTeaser');
      this.minimizeBtn = $('minimizeBtn');
      this.resetBtn = $('resetBtn');
      this.viewWelcome = $('viewWelcome');
      this.viewChat = $('viewChat');
      this.messagesEl = $('messages');
      this.chipsEl = $('chips');
      this.form = $('form');
      this.input = $('input');
      this.sendBtn = $('sendBtn');
    }

    _attachEvents() {
      this.launcher.addEventListener('click', () => this.toggle());
      this.minimizeBtn.addEventListener('click', () => this.toggle(false));

      this.resetBtn.addEventListener('click', () => {
        this.history = [];
        this.messagesEl.innerHTML = '';
        this._showView('welcome');
      });

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._submit();
      });

      // Welcome topic buttons
      this.viewWelcome.addEventListener('click', (e) => {
        const btn = e.target.closest('.topic-btn');
        if (btn) {
          const query = btn.getAttribute('data-query');
          this._showView('chat');
          this.input.value = query;
          this._submit();
        }
      });

      // Chips
      this.chipsEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (chip) {
          this.input.value = chip.getAttribute('data-query');
          this._submit();
        }
      });
    }

    _initTeaser() {
      if (!this.teaser) return;

      // Show teaser popup after 1.5s
      this._showTimerId = setTimeout(() => {
        if (!this.isOpen && this.teaser) {
          this.teaser.classList.add('show');
        }
      }, 1500);

      // Auto-hide teaser after 8.5s total
      this._hideTimerId = setTimeout(() => {
        if (this.teaser) {
          this.teaser.classList.remove('show');
        }
      }, 8500);

      this.teaser.addEventListener('click', (e) => {
        if (e.target.closest('#teaserClose')) {
          e.stopPropagation();
          clearTimeout(this._hideTimerId);
          this.teaser.classList.remove('show');
          return;
        }
        clearTimeout(this._hideTimerId);
        this.teaser.classList.remove('show');
        this.toggle(true);
      });
    }

    toggle(force) {
      this.isOpen = typeof force === 'boolean' ? force : !this.isOpen;
      this.container.classList.toggle('is-open', this.isOpen);
      this.launcher.setAttribute('aria-expanded', String(this.isOpen));

      if (this.teaser) {
        this.teaser.classList.remove('show');
      }

      if (this.isOpen) {
        setTimeout(() => this.input.focus(), 200);
      } else {
        // Return focus to launcher on close for keyboard accessibility
        this.launcher.focus();
      }
    }

    _showView(view) {
      this.inChatView = view === 'chat';
      this.viewWelcome.classList.toggle('active', !this.inChatView);
      this.viewChat.classList.toggle('active', this.inChatView);
    }

    async _submit() {
      const text = this.input.value.trim();
      if (!text || this.isWaiting) return;

      this.input.value = '';

      // Switch to chat view if on welcome
      if (!this.inChatView) {
        this._showView('chat');
      }

      this._addMessage('user', text);
      this.history.push({ role: 'user', content: text });

      // Cap history to prevent unbounded memory growth
      if (this.history.length > 20) {
        this.history = this.history.slice(-12);
      }

      this._showTyping();
      this.isWaiting = true;
      this.sendBtn.disabled = true;

      // 15-second timeout to prevent indefinite waiting
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const res = await fetch(`${this.apiEndpoint}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            message: text,
            history: this.history.slice(-6),
            stream: false
          })
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`Server ${res.status}`);

        const data = await res.json();
        this._hideTyping();
        this._addMessage('bot', data.reply || 'Unable to generate a response at this time.', data.uiComponent);
        this.history.push({ role: 'assistant', content: data.reply });

      } catch (err) {
        clearTimeout(timeoutId);
        console.error('[SenterWidget] API Error:', err);
        this._hideTyping();
        const errorMsg = err.name === 'AbortError'
          ? 'The request timed out. Please try again.'
          : 'Could not reach the server. Please try again in a moment.';
        this._addMessage('bot', errorMsg);
      } finally {
        this.isWaiting = false;
        this.sendBtn.disabled = false;
      }
    }

    _addMessage(role, rawContent, uiComponent = null) {
      const wrapper = document.createElement('div');
      wrapper.className = `msg ${role}`;

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerHTML = this._formatMarkdown(rawContent);

      // Mount GenUI Component if provided
      if (uiComponent) {
        const genUIEl = this._renderGenUI(uiComponent);
        if (genUIEl) {
          bubble.appendChild(genUIEl);
        }
      }

      const meta = document.createElement('span');
      meta.className = 'msg-meta';
      const now = new Date();
      meta.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      wrapper.appendChild(bubble);
      wrapper.appendChild(meta);
      this.messagesEl.appendChild(wrapper);
      this._scrollDown();
    }

    /**
     * GenUI / A2UI Component Renderer
     */
    _renderGenUI(component) {
      if (!component || !component.type) return null;

      const container = document.createElement('div');
      container.className = 'genui-container';

      // 1. Ticket Tiers Component
      if (component.type === 'ticket_tiers') {
        const card = document.createElement('div');
        card.className = 'genui-card';

        const tiersHTML = (component.tiers || []).map(tier => `
          <div class="genui-tier-item ${tier.featured ? 'featured' : ''}">
            <div class="genui-tier-top">
              <span class="genui-tier-name">${tier.name}</span>
              <span class="genui-badge ${tier.featured ? 'popular' : ''}">${tier.tag}</span>
            </div>
            <div class="genui-tier-price">${tier.price}</div>
            <ul class="genui-feature-list">
              ${(tier.features || []).map(f => `<li class="genui-feature-item">${ICONS.check} ${f}</li>`).join('')}
            </ul>
            <a href="${tier.ctaUrl}" target="_blank" rel="noopener" class="genui-btn ${tier.id === 'vvip' ? 'whatsapp' : (tier.featured ? '' : 'secondary')}">
              ${tier.ctaText} ${ICONS.externalLink}
            </a>
          </div>
        `).join('');

        card.innerHTML = `
          <div class="genui-card-header">
            <div>
              <div class="genui-card-title">${component.title || 'Official Passes'}</div>
              <div class="genui-card-subtitle">${component.subtitle || ''}</div>
            </div>
          </div>
          <div class="genui-tier-list">
            ${tiersHTML}
          </div>
        `;
        container.appendChild(card);
        return container;
      }

      // 2. Artist Spotlight Component
      if (component.type === 'artist_spotlight') {
        const card = document.createElement('div');
        card.className = 'genui-card';

        const hitsHTML = (component.hits || []).map(hit => `
          <div class="genui-hit-pill">
            <span class="genui-hit-title">${hit.title}</span>
            <span class="genui-hit-streams">${hit.streams}</span>
          </div>
        `).join('');

        card.innerHTML = `
          <div class="genui-card-header">
            <div>
              <div class="genui-card-title">${component.artist}</div>
              <div class="genui-card-subtitle">${component.role}</div>
            </div>
            <span class="genui-badge popular">${component.tag}</span>
          </div>
          <div style="font-size: 11px; color: var(--w-text-secondary); line-height: 1.4;">
            ${component.description}
          </div>
          <div class="genui-hits-grid">
            ${hitsHTML}
          </div>
          <a href="${component.ctaUrl}" target="_blank" rel="noopener" class="genui-btn">
            ${component.ctaText} ${ICONS.externalLink}
          </a>
        `;
        container.appendChild(card);
        return container;
      }

      // 3. Venue & Schedule Component
      if (component.type === 'venue_schedule') {
        const card = document.createElement('div');
        card.className = 'genui-card';

        card.innerHTML = `
          <div class="genui-card-header">
            <div>
              <div class="genui-card-title">${component.venueName}</div>
              <div class="genui-card-subtitle">${component.address}</div>
            </div>
            <span class="genui-badge">${component.edition}</span>
          </div>
          <div class="genui-venue-grid">
            <div class="genui-venue-box">
              <span class="genui-venue-label">Dates</span>
              <span class="genui-venue-value">${component.dates}</span>
            </div>
            <div class="genui-venue-box">
              <span class="genui-venue-label">Hours</span>
              <span class="genui-venue-value">${component.hours}</span>
            </div>
            <div class="genui-venue-box" style="grid-column: span 2;">
              <span class="genui-venue-label">Gate Times</span>
              <span class="genui-venue-value">${component.gateTimes}</span>
            </div>
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="${component.mapUrl}" target="_blank" rel="noopener" class="genui-btn secondary" style="flex: 1;">
              Google Maps ${ICONS.externalLink}
            </a>
            <a href="${component.ctaUrl}" target="_blank" rel="noopener" class="genui-btn" style="flex: 1;">
              ${component.ctaText} ${ICONS.externalLink}
            </a>
          </div>
        `;
        container.appendChild(card);
        return container;
      }

      // 4. VIP Concierge Component
      if (component.type === 'vip_concierge') {
        const card = document.createElement('div');
        card.className = 'genui-card';

        const perksHTML = (component.perks || []).map(p => `
          <li class="genui-feature-item">${ICONS.check} ${p}</li>
        `).join('');

        card.innerHTML = `
          <div class="genui-card-header">
            <div>
              <div class="genui-card-title">${component.title}</div>
              <div class="genui-card-subtitle">${component.subtitle}</div>
            </div>
            <span class="genui-badge popular">Direct Access</span>
          </div>
          <ul class="genui-feature-list">
            ${perksHTML}
          </ul>
          <a href="${component.whatsappUrl}" target="_blank" rel="noopener" class="genui-btn whatsapp">
            ${component.ctaText} (${component.phone}) ${ICONS.externalLink}
          </a>
        `;
        container.appendChild(card);
        return container;
      }

      // 5. Zone Explorer Component
      if (component.type === 'zone_explorer') {
        const card = document.createElement('div');
        card.className = 'genui-card';

        const zonesHTML = (component.zones || []).map(z => `
          <div class="genui-zone-pill">
            <span class="genui-zone-num">${z.num}</span>
            <div>
              <div class="genui-zone-name">${z.name}</div>
              <div class="genui-zone-desc">${z.desc}</div>
            </div>
          </div>
        `).join('');

        card.innerHTML = `
          <div class="genui-card-header">
            <div>
              <div class="genui-card-title">${component.title}</div>
              <div class="genui-card-subtitle">${component.subtitle}</div>
            </div>
          </div>
          <div class="genui-zones-list">
            ${zonesHTML}
          </div>
        `;
        container.appendChild(card);
        return container;
      }

      return null;
    }

    _showTyping() {
      const el = document.createElement('div');
      el.className = 'typing';
      el.id = 'typingEl';
      el.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
      this.messagesEl.appendChild(el);
      this._scrollDown();
    }

    _hideTyping() {
      const el = this.shadowRoot.getElementById('typingEl');
      if (el) el.remove();
    }

    _scrollDown() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }

    _formatMarkdown(text) {
      if (!text) return '';
      let s = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Headers ### and ####
      s = s.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
      s = s.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');

      // Horizontal rule ---
      s = s.replace(/^---$/gm, '<hr/>');

      // Bold **text**
      s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic *text*
      s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
      // Inline code
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');

      // Links [text](url)
      s = s.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      // Unordered lists (-, *, •)
      s = s.replace(/(?:^|\n)((?:[\*\-•]\s+.+\n?)+)/g, (match, items) => {
        const lis = items.trim().split('\n')
          .filter(l => /^[\*\-•]\s+/.test(l.trim()))
          .map(l => `<li>${l.trim().replace(/^[\*\-•]\s+/, '')}</li>`)
          .join('');
        return `\n<ul>${lis}</ul>\n`;
      });

      // Ordered lists (1. item)
      s = s.replace(/(?:^|\n)((?:\d+\.\s+.+\n?)+)/g, (match, items) => {
        const lis = items.trim().split('\n')
          .filter(l => /^\d+\.\s+/.test(l.trim()))
          .map(l => `<li>${l.trim().replace(/^\d+\.\s+/, '')}</li>`)
          .join('');
        return `\n<ol>${lis}</ol>\n`;
      });

      // Paragraphs & Line breaks
      s = s.replace(/\n\n+/g, '<br/><br/>');
      s = s.replace(/\n/g, '<br/>');

      // Clean up extra <br/> around block tags
      s = s.replace(/(<br\/>)+\s*<(ul|ol|h3|h4|hr)/g, '<$2');
      s = s.replace(/<\/(ul|ol|h3|h4)>\s*(<br\/>)+/g, '</$1>');

      return s;
    }
  }

  customElements.define('senter-chat-widget', SenterChatWidget);

  // Auto-inject
  const inject = () => {
    if (!document.querySelector('senter-chat-widget')) {
      document.body.appendChild(document.createElement('senter-chat-widget'));
    }
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
