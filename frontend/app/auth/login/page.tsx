'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/learn');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#02060f] text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-light text-white mb-2">No Account Required</h2>
        <p className="text-xs text-zinc-400 mb-6">Redirecting you directly to the ASL learning studio...</p>
        <Link
          href="/learn"
          className="px-6 py-2.5 rounded-full bg-cyan-500 text-black font-semibold text-xs uppercase"
        >
          Start Learning Now
        </Link>
      </div>
    </div>
  );
}
