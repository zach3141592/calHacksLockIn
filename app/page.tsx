'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          linear-gradient(90deg, #001f3f 1px, transparent 1px),
          linear-gradient(#001f3f 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition: '0 0, 0 0, 0 0, 0 0',
        backgroundColor: '#0a2342'
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-cyan-300 mb-6 drop-shadow-2xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
          BLUEPRINT AI
        </h1>
        <div className="h-1 w-32 mx-auto bg-cyan-400 mb-8"></div>
        
        <div className="mb-12 space-y-6">
          <p className="text-2xl md:text-3xl text-cyan-100 drop-shadow-lg" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
            THE FIRST AI STRUCTURAL ENGINEER
          </p>
          <p className="text-xl text-cyan-200 leading-relaxed" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
            Say what you want to build. <br/>
            Blueprint tells you how to build it.
          </p>
        </div>

        <button
          onClick={() => router.push('/build')}
          className="bg-cyan-600 text-white py-6 px-12 rounded-lg text-xl font-bold hover:bg-cyan-700 transition-all transform hover:scale-105 uppercase tracking-wide shadow-2xl"
          style={{ fontFamily: 'var(--font-roboto-mono)' }}
        >
          10x Your Construction
        </button>
      </div>
    </div>
  );
}
