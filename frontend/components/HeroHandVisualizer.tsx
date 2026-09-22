'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HAND_CONNECTIONS } from '@/lib/mediapipe';

// Base coordinates for an elegant ASL hand position (forming sign 'A' with subtle articulation)
const BASE_LANDMARKS = [
  { x: 0.50, y: 0.85, z: 0.00, label: 'Wrist' },      // 0: Wrist
  { x: 0.38, y: 0.72, z: -0.05, label: 'CMC' },     // 1: Thumb CMC
  { x: 0.32, y: 0.58, z: -0.08, label: 'MCP' },     // 2: Thumb MCP
  { x: 0.34, y: 0.44, z: -0.05, label: 'IP' },      // 3: Thumb IP
  { x: 0.36, y: 0.32, z: 0.00, label: 'Tip' },      // 4: Thumb Tip (upright pillar)

  { x: 0.44, y: 0.55, z: 0.05 },                    // 5: Index MCP
  { x: 0.43, y: 0.42, z: 0.10 },                    // 6: Index PIP
  { x: 0.44, y: 0.50, z: 0.08 },                    // 7: Index DIP
  { x: 0.45, y: 0.58, z: 0.02 },                    // 8: Index Tip (curled)

  { x: 0.50, y: 0.54, z: 0.05 },                    // 9: Middle MCP
  { x: 0.50, y: 0.41, z: 0.10 },                    // 10: Middle PIP
  { x: 0.51, y: 0.51, z: 0.08 },                    // 11: Middle DIP
  { x: 0.52, y: 0.59, z: 0.02 },                    // 12: Middle Tip (curled)

  { x: 0.56, y: 0.56, z: 0.04 },                    // 13: Ring MCP
  { x: 0.57, y: 0.43, z: 0.08 },                    // 14: Ring PIP
  { x: 0.58, y: 0.52, z: 0.06 },                    // 15: Ring DIP
  { x: 0.58, y: 0.60, z: 0.01 },                    // 16: Ring Tip (curled)

  { x: 0.62, y: 0.60, z: 0.02 },                    // 17: Pinky MCP
  { x: 0.64, y: 0.48, z: 0.05 },                    // 18: Pinky PIP
  { x: 0.64, y: 0.55, z: 0.04 },                    // 19: Pinky DIP
  { x: 0.63, y: 0.63, z: 0.00 },                    // 20: Pinky Tip (curled)
];

export function HeroHandVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 500);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 500);

    // Floating particles array
    const particles = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const startTime = Date.now();
    let currentTiltX = 0;
    let currentTiltY = 0;

    const render = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      // Smooth mouse follow interpolation
      currentTiltX += (mouseTargetRef.current.x - currentTiltX) * 0.05;
      currentTiltY += (mouseTargetRef.current.y - currentTiltY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background particles
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.4})`;
        ctx.fill();
      });

      // 2. Compute 3D transformed landmarks with gentle floating + tilt
      const floatY = Math.sin(elapsed * 1.5) * 12;
      const floatX = Math.cos(elapsed * 1.2) * 6;

      const projected = BASE_LANDMARKS.map((lm) => {
        // Perspective rotation with current tilt
        const rotY = currentTiltX * 0.4;
        const rotX = -currentTiltY * 0.4;

        // Apply 3D coordinate transform
        const x = (lm.x - 0.5) * width * 0.65;
        const y = (lm.y - 0.5) * height * 0.65;
        const z = lm.z * 150;

        // Rotate Y
        const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

        // Rotate X
        const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Center on canvas with float offset
        const screenX = width / 2 + x1 + floatX;
        const screenY = height / 2 + y2 + floatY;

        return { x: screenX, y: screenY, z: z2 };
      });

      // 3. Draw holographic glowing bones / connection lines
      ctx.save();
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 2.5 * window.devicePixelRatio;
      ctx.lineCap = 'round';

      ctx.beginPath();
      for (const [start, end] of HAND_CONNECTIONS) {
        const p1 = projected[start];
        const p2 = projected[end];
        if (p1 && p2) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
      ctx.stroke();

      // Fingertip gold highlights
      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 2 * window.devicePixelRatio;

      const FINGERTIPS = [[3, 4], [7, 8], [11, 12], [15, 16], [19, 20]];
      ctx.beginPath();
      for (const [start, end] of FINGERTIPS) {
        const p1 = projected[start];
        const p2 = projected[end];
        if (p1 && p2) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
      ctx.stroke();

      // 4. Draw holographic scanning line
      const scanProgress = (elapsed % 3) / 3; // 0 to 1 every 3s
      const scanY = (height * 0.2) + scanProgress * (height * 0.6);

      const grad = ctx.createLinearGradient(width * 0.2, scanY, width * 0.8, scanY);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.75)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.strokeStyle = grad;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 2 * window.devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(width * 0.15, scanY);
      ctx.lineTo(width * 0.85, scanY);
      ctx.stroke();

      // 5. Draw 21 landmark nodes with depth
      projected.forEach((p, idx) => {
        const isTip = [4, 8, 12, 16, 20].includes(idx);
        const isThumbTip = idx === 4;

        ctx.shadowColor = isThumbTip ? '#fbbf24' : '#38bdf8';
        ctx.shadowBlur = isTip ? 16 : 8;

        // Outer pulsing ring
        const pulse = Math.sin(elapsed * 4 + idx) * 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (isThumbTip ? 7 : isTip ? 5.5 : 4) * window.devicePixelRatio + pulse, 0, Math.PI * 2);
        ctx.fillStyle = isThumbTip ? 'rgba(251, 191, 36, 0.9)' : isTip ? 'rgba(56, 189, 248, 0.9)' : 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Inner nucleus
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = '#02060f';
        ctx.fill();
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseTargetRef.current = { x, y };
  };

  const handleMouseLeave = () => {
    mouseTargetRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none"
    >
      {/* Background Volumetric Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/15 via-blue-900/10 to-transparent blur-3xl -z-10 rounded-full" />
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-2xl top-12 left-8 -z-10" />

      {/* Cybernetic HUD Rings */}
      <div className="absolute inset-6 rounded-full border border-white/[0.05] pointer-events-none" />
      <div className="absolute inset-16 rounded-full border border-dashed border-cyan-500/20 pointer-events-none animate-spin" style={{ animationDuration: '60s' }} />

      {/* Interactive 60fps Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
      />

      {/* Floating Futuristic Metadata Badges (Section 44) */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-4 px-3 py-1.5 rounded-full bg-[#07111F]/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block mr-2 shadow-[0_0_6px_#38bdf8]" />
        HAND TRACKING
      </motion.div>

      <motion.div
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-6 px-3 py-1.5 rounded-full bg-[#07111F]/80 backdrop-blur-md border border-amber-500/30 text-[11px] font-mono text-amber-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-2 shadow-[0_0_6px_#fbbf24]" />
        21 LANDMARKS
      </motion.div>

      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 left-6 px-3 py-1.5 rounded-full bg-[#07111F]/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-2 shadow-[0_0_6px_#34d399]" />
        REAL-TIME AI
      </motion.div>

      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-24 right-4 px-3 py-1.5 rounded-full bg-[#07111F]/80 backdrop-blur-md border border-white/20 text-[11px] font-mono text-zinc-200 shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
      >
        ASL A–Z MODEL
      </motion.div>
    </div>
  );
}

export default HeroHandVisualizer;
