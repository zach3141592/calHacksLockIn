'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [steps, setSteps] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSteps('');
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError('');

    try {
      // Convert data URL back to file
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'house.jpg', { type: blob.type });

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/analyze-house', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSteps(data.steps || 'No steps generated');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to analyze the house image. Please try again.';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-8"
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-300 mb-4 drop-shadow-2xl" style={{ fontFamily: 'var(--font-orbitron)' }}>
            BLUEPRINT AI
          </h1>
          <div className="h-1 w-24 mx-auto bg-cyan-400 mb-4"></div>
          <p className="text-xl text-cyan-100 drop-shadow-lg" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
            THE FIRST AI STRUCTURAL ENGINEER
          </p>
          <p className="text-base text-cyan-200 mt-2" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
            Upload what you want to build. Blueprint will tell you how to build it.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg shadow-2xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
              SELECT IMAGE
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 cursor-pointer transition-colors"
            />
          </div>

          {selectedImage && (
            <div className="mb-6">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={selectedImage}
                  alt="Selected house"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isAnalyzing}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-lg font-bold hover:from-cyan-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2 shadow-lg uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-roboto-mono)' }}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze House'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {steps && (
          <div className="bg-white/95 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg shadow-2xl p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Construction Steps
            </h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                {steps}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
