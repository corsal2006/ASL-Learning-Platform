'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssistantPage() {
  const router = useRouter();

  useEffect(() => {
    // Luna is now integrated as a floating tutor throughout the entire platform
    router.replace('/learn');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#02060f] flex items-center justify-center text-zinc-400">
      <p className="text-sm font-mono">Redirecting to learning curriculum...</p>
    </div>
  );
}
