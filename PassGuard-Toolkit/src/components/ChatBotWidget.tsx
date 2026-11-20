"use client";
import React, { useState } from 'react';
import { MessageSquare, X, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Simple floating chat‑bot widget that can be used on any page.
 * Clicking the chat icon opens a compact overlay where the same
 * bilingual bot logic lives (client‑side, no external calls).
 */
function getBotReply(message: string): string {
  const lowered = message.trim().toLowerCase();
  if (/\b(hi|hello|hey)\b/.test(lowered)) return 'Namaste! How can I help you today?';
  if (/\b(नमस्ते|हैलो|हाय)\b/.test(message)) return 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?';
  if (/help|assist|सहायता/.test(lowered)) return 'You can ask me about PassGuard, phishing detection, or just say hi.';
  if (/\b(thank you|thanks|धन्यवा)\b/.test(lowered)) return "You're welcome! Happy to help.";
  return `You said: "${message}". I'm still learning, but I will try to assist you.`;
}

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
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
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-amber-500/30 border border-amber-400 text-amber-300 hover:bg-amber-500/40 shadow-lg"
        aria-label="Open Chat Bot"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-[#060911] rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            {/* Header */}
            <header className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#090D16]">
              <h2 className="text-sm font-medium text-slate-200">Chat Bot</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Chat area */}
            <main className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-slate-500 italic">Type a message to start…</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`rounded-lg p-2 max-w-xs break-words ${{
                      user: 'bg-blue-600/30 text-white',
                      bot: 'bg-[#0D1322]/90 text-slate-200',
                    }[msg.from]}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </main>

            {/* Input */}
            <footer className="p-3 border-t border-slate-800 bg-[#090D16]">
              <form onSubmit={handleSend} className="flex gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something… (बोलिए, मैं सुन रहा हूँ)"
                  className="flex-1 rounded-md bg-[#0D1322] border border-slate-700/80 text-slate-300 placeholder-slate-500 p-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 rounded-md bg-amber-500/20 border border-amber-400 text-amber-300 hover:bg-amber-500/30 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
