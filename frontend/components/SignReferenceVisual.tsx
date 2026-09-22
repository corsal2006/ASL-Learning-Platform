'use client';

import React, { useState, useEffect } from 'react';
import { Maximize2, X, AlertCircle, Sparkles } from 'lucide-react';
import { getSignAsset, getSignVisualUrl, getSignAltText } from '@/lib/sign-assets';

interface SignReferenceVisualProps {
  sign: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  className?: string;
  size?: 'md' | 'lg';
}

export function SignReferenceVisual({
  sign,
  title,
  description,
  imageUrl,
  className = '',
  size = 'lg',
}: SignReferenceVisualProps) {
  const asset = getSignAsset(sign);
  const resolvedImg = imageUrl || asset.primaryImage;
  const resolvedAlt = getSignAltText(sign);
  const resolvedTitle = title || asset.title;
  const resolvedDesc = description || asset.description;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(resolvedImg);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // When sign changes, reset loading/error state and update image source
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(imageUrl || getSignVisualUrl(sign));
  }, [sign, imageUrl]);

  // Handle escape key to close lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const handleImageError = () => {
    // If local path failed, try remote fallback once before showing fallback UI
    if (currentSrc !== asset.fallbackImage) {
      setCurrentSrc(asset.fallbackImage);
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <>
      {/* Primary Reference Visual Container */}
      <div
        onClick={() => !hasError && setIsLightboxOpen(true)}
        className={`group relative flex flex-col items-center justify-center rounded-2xl bg-[#03060c] border border-white/15 overflow-hidden transition-all duration-300 select-none ${
          hasError
            ? 'p-6 text-center'
            : 'cursor-pointer hover:border-cyan-400/60 hover:shadow-[0_8px_32px_rgba(56,189,248,0.25)] hover:-translate-y-1'
        } ${size === 'lg' ? 'w-full h-56 sm:h-64' : 'w-44 h-44'} ${className}`}
        title="Click to enlarge ASL reference sign"
      >
        {/* Subtle Cybernetic Corner Brackets */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-cyan-400/40 rounded-tl-sm pointer-events-none group-hover:border-cyan-400 transition-colors" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-cyan-400/40 rounded-tr-sm pointer-events-none group-hover:border-cyan-400 transition-colors" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-cyan-400/40 rounded-bl-sm pointer-events-none group-hover:border-cyan-400 transition-colors" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-cyan-400/40 rounded-br-sm pointer-events-none group-hover:border-cyan-400 transition-colors" />

        {/* Loading Skeleton */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-2 shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
            <span className="text-[10px] font-mono text-zinc-400">Loading sign visual...</span>
          </div>
        )}

        {/* Visual Sign Image */}
        {!hasError ? (
          <img
            src={currentSrc}
            alt={resolvedAlt}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-contain p-3 transition-transform duration-300 filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)] ${
              isLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
          />
        ) : (
          /* Graceful Fallback if image unavailable */
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-2 text-2xl shadow-inner">
              ✋
            </div>
            <span className="text-xs font-semibold text-white">{sign}</span>
            <span className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Sign visual unavailable</span>
            </span>
          </div>
        )}

        {/* Bottom Hover Tag: Tap to enlarge */}
        {!hasError && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono text-cyan-300 opacity-80 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-2.5 h-2.5" />
            <span>Enlarge</span>
          </div>
        )}
      </div>

      {/* Lightbox Modal (Click to Enlarge) */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-[#07111F] border border-white/20 p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.2)] flex flex-col items-center text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/20 via-transparent to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Target Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold">
                Target: {sign}
              </span>
              <span className="text-xs font-mono text-zinc-400">Official ASL Sign</span>
            </div>

            {/* High-Resolution Large Visual */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 my-4 rounded-2xl bg-[#03060c] border border-white/15 p-4 flex items-center justify-center shadow-inner relative">
              <img
                src={currentSrc}
                alt={resolvedAlt}
                className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)]"
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-1.5">{resolvedTitle}</h3>
            <p className="text-xs text-zinc-300 max-w-sm leading-relaxed mb-5">
              {resolvedDesc}
            </p>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
            >
              Close Preview (Esc)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignReferenceVisual;
