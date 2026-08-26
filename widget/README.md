# Senter Music Festival AI Chat Widget

A zero-conflict, high-performance embeddable AI Chatbot widget powered by a Retrieval-Augmented Generation (RAG) backend.

## Why Zero-Conflict?
- **Shadow DOM Encapsulation**: All widget styles and DOM nodes are isolated inside a Shadow Root. Host website CSS rules (such as Tailwind, global resets, or `cursor: none !important`) will **never** alter or break the chat window.
- **No Global JS Pollution**: Encapsulated within a self-registering Custom Element (`<senter-chat-widget>`).
- **Responsive & Mobile Ready**: Automatically expands to full-screen on mobile devices and acts as an elegant floating drawer on desktop screens.

---

## 1. Quick Integration (Any Website / HTML)

Simply paste this single line before the closing `</body>` tag of your website:

```html
<script src="https://YOUR_BACKEND_DOMAIN/widget/senter-chat-widget.js" defer></script>
```

---

## 2. Next.js / React Integration

### App Router (`app/layout.tsx` or `app/layout.js`):
```tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script 
          src="https://YOUR_BACKEND_DOMAIN/widget/senter-chat-widget.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}
```

### Pages Router (`pages/_app.tsx` or `pages/_document.js`):
```tsx
import Script from 'next/script';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Script 
        src="https://YOUR_BACKEND_DOMAIN/widget/senter-chat-widget.js" 
        strategy="afterInteractive" 
      />
    </>
  );
}
```

---

## 3. Custom Attributes & Options

You can customize the widget by explicitly declaring the custom element in your HTML:

```html
<senter-chat-widget
  api-endpoint="https://YOUR_BACKEND_DOMAIN"
  position="bottom-right"
></senter-chat-widget>

<script src="https://YOUR_BACKEND_DOMAIN/widget/senter-chat-widget.js" defer></script>
```

### Supported Attributes:
| Attribute | Description | Default |
| :--- | :--- | :--- |
| `api-endpoint` | Backend API base URL | Auto-detects current host (`/`) |
| `position` | `bottom-right` or `bottom-left` | `bottom-right` |

---

## 4. Programmatic Control (JavaScript API)

You can trigger the chatbot from your own buttons or links:

```javascript
// Open widget and ask a question
const widget = document.querySelector('senter-chat-widget');
if (widget) {
  widget.toggleChat(true); // Opens the chat
  
  // Optionally send a question automatically
  const input = widget.shadowRoot.getElementById('messageInput');
  input.value = "What are the ticket prices?";
  widget.handleUserSubmit();
}
```
