import type { Metadata } from "next";
import { Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { LunaProvider } from "@/contexts/LunaContext";
import { LunaAssistant } from "@/components/LunaAssistant";
import { Toaster } from "react-hot-toast";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGNVISION — AI-Powered American Sign Language Learning",
  description:
    "Master American Sign Language with real-time browser-native computer vision hand tracking, interactive 3D guided lessons, voice instruction, and Luna AI assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${sora.variable} ${geistMono.variable} font-sans antialiased bg-[#02060f] text-white selection:bg-cyan-500/30 selection:text-white min-h-screen flex flex-col`}
      >
        <SettingsProvider>
          <LunaProvider>
            {children}

            {/* Floating AI ASL Tutor accessible everywhere */}
            <LunaAssistant />
          </LunaProvider>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#07111F',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </SettingsProvider>
      </body>
    </html>
  );
}
