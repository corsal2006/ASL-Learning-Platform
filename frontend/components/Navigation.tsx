'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, Flame } from 'lucide-react';
import progressStore from '@/lib/progress-store';

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Sync initial value via callback to avoid cascading render warning
    const current = progressStore.getJourney().currentStreak;
    if (current > 0) {
      setStreak(current);
    }
    const unsub = progressStore.subscribe(() => {
      setStreak(progressStore.getJourney().currentStreak);
    });
    return unsub;
  }, []);

  const navLinks = [
    { name: 'Learn', href: '/learn' },
    { name: 'Practice', href: '/practice' },
    { name: 'Quiz', href: '/quiz' },
    { name: 'Reference', href: '/reference' },
    { name: 'Challenges', href: '/time-challenge' },
    { name: 'Journey', href: '/journey' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05070B]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        {/* Brand Wordmark with Futuristic Emblem */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#38bdf8] via-[#06b6d4] to-[#fbbf24] p-[1.5px] shadow-[0_0_16px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_24px_rgba(56,189,248,0.7)] transition-all">
            <div className="w-full h-full rounded-[10px] bg-[#02060f] flex items-center justify-center">
              {/* Stylized geometric double-slash from MotionSites reference */}
              <svg viewBox="0 0 23 17" className="w-4 h-3.5 fill-white group-hover:scale-105 transition-transform" aria-hidden="true">
                <path d="M8.15 0.9 L4.55 0.9 L0.5 9.3 L4.1 9.3 Z" />
                <path d="M17.0 0 L13.4 0 L6.15 16.4 L9.75 16.4 Z" />
                <path d="M22.9 0 L19.3 0 L15.0 7.6 L18.6 7.6 Z" />
                <path d="M22.6 6.9 L19.0 6.9 L14.05 16.4 L17.65 16.4 Z" />
              </svg>
            </div>
          </div>
          <span className="font-sans font-semibold tracking-wider text-base text-white group-hover:text-cyan-200 transition-colors">
            SIGN<span className="text-cyan-400 font-light">VISION</span>
          </span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Daily Streak Indicator */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{streak}d streak</span>
            </div>
          )}

          {/* Primary Glass Pill Button */}
          <Link
            href="/learn"
            className="relative inline-flex items-center justify-center px-5 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-300 rounded-full group overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%), linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(56,189,248,0.15) 100%)',
              boxShadow:
                '0 0 20px rgba(56,189,248,0.25), inset 0 1px 0 rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>Start Learning</span>
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="md:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-down Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#07111F]/98 border-b border-white/10 backdrop-blur-2xl animate-fade-in">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                    : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 mt-2">
              <Link
                href="/learn"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Start Learning Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
