'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-blue-950/30 opacity-50"></div>
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      ></div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Blueprint image overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/blueprintbg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300 font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI-Powered Structural Engineering
          </span>
        </div>

        {/* Main heading with gradient */}
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-none"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
            BLUEPRINT
          </span>
        </h1>

        {/* Accent line */}
        <div className="relative mb-10">
          <div className="h-1 w-40 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-lg shadow-cyan-400/50"></div>
        </div>

        {/* Subheading */}
        <p 
          className="text-2xl md:text-3xl lg:text-4xl text-cyan-100 mb-6 text-center font-light tracking-wide max-w-4xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          THE FIRST AI STRUCTURAL ENGINEER
        </p>

        {/* Description */}
        <p 
          className="text-lg md:text-xl text-slate-300 mb-12 text-center max-w-2xl leading-relaxed"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Say what you want to build.
          <br />
          <span className="text-cyan-300 font-medium">Blueprint tells you how to build it.</span>
        </p>

        {/* CTA Button with icon */}
        <button
          onClick={() => router.push('/build')}
          className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 overflow-hidden"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-3">
            <Zap className="w-5 h-5" />
            10X YOUR CONSTRUCTION
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 max-w-3xl">
          {['Instant Analysis', 'Code Compliance', 'Cost Optimization'].map((feature) => (
            <div 
              key={feature}
              className="px-5 py-2 bg-slate-900/50 border border-cyan-500/20 rounded-full backdrop-blur-sm"
            >
              <span className="text-sm text-cyan-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50px);
          }
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}