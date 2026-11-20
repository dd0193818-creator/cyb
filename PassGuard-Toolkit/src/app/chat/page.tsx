"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, ArrowLeft } from 'lucide-react';

/**
 * Very small rule‑based bilingual chatbot.
 * It recognises a handful of common greetings / help intents in Hindi & English
 * and falls back to a generic answer.
 * All processing stays client‑side – no external API calls.
 */
function getBotReply(message: string): string {
  const lowered = message.trim().toLowerCase();
  // Simple Hindi/English keyword matching
  if (/\b(hi|hello|hey)\b/.test(lowered)) return 'Namaste! How can I help you today?';
  if (/\b(नमस्ते|हैलो|हाय)\b/.test(message)) return 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?';
  if (/help|assist|सहायता/.test(lowered)) return 'You can ask me about the PassGuard suite, phishing detection, or just say hi.';
  if (/\b(thank you|thanks|धन्यवा)\b/.test(lowered)) return 'You\'re welcome! Happy to help.';
  // Fallback echo with a friendly tone
  return `You said: "${message}". I'm still learning, but I will try to assist you.`;
}

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'bot'; text: string }>>([]);
  const [input, setInput] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    const botMsg = getBotReply(userMsg);
    setMessages((prev) => [...prev, { from: 'user', text: userMsg }, { from: 'bot', text: botMsg }]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-slate-200">
      {/* Header – reuse existing style */}
      <header className="border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-md sticky top-0 z-30 p-2 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
        <h1 className="ml-4 text-xl font-bold text-white">Chat Bot</h1>
      </header>

      {/* Chat window */}
      <main className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-slate-400 italic">Start a conversation by typing below…</p>
        )}
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${{
                  'bg-blue-600/30 text-white': msg.from === 'user',
                  'bg-[#0D1322]/90 text-slate-200': msg.from === 'bot',
                }[msg.from]}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input area */}
      <footer className="p-4 border-t border-slate-800/80 bg-[#090D16]/80">
        <form onSubmit={handleSend} className="flex gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something… (बोलिए, मैं सुन रहा हूँ)"
            className="flex-1 rounded-lg bg-[#0D1322] border border-slate-700/80 text-slate-300 placeholder-slate-500 p-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 hover:bg-amber-500/30 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
