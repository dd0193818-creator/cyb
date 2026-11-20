import type { Metadata } from "next";
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import ChatBotWidget from '../components/ChatBotWidget';



export const metadata: Metadata = {
  title: "PassGuard | Password Strength & Email Breach Defense",
  description: "Enterprise-grade password strength analyzer & HIBP email breach detection. 100% Client-Side Privacy.",
};

/**
 * Root Layout providing the responsive video background and glassmorphism styling across all pages.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060911] text-slate-100 min-h-screen relative selection:bg-blue-500/20 selection:text-blue-300 overflow-x-hidden">
        {/* Full-bleed responsive video background */}
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-30">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center opacity-30 filter brightness-90 contrast-125"
          >
            <source src="/bg-video.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31913-large.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Ambient Dark Overlay for crystal clear readability on all devices */}
        <div className="fixed inset-0 bg-[#060911]/80 backdrop-blur-[2px] pointer-events-none -z-20" />

        <main className="relative z-10">{children}</main>
        <ChatBotWidget />
      </body>
    </html>
  );
}
