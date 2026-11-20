import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

/**
 * Shared top navigation used on all feature pages.
 * Includes links to Password, Breach, Phishing and Chat Bot.
 */
export default function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-md sticky top-0 z-30 p-2 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
        <MessageSquare className="w-5 h-5" />
        <span className="font-bold">PassGuard</span>
      </Link>
      <nav className="flex items-center gap-1 bg-[#0D1322] border border-slate-800 p-1 rounded-xl text-xs">
        <Link href="/password" className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs">
          Password
        </Link>
        <Link href="/breach" className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs">
          Breach
        </Link>
        <Link href="/phishing" className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs">
          Phishing
        </Link>
        <Link href="/chat" className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs">
          Chat Bot
        </Link>
      </nav>
    </header>
  );
}
