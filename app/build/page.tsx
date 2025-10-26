'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuildPage() {
  const router = useRouter();
  
  // Step state
  const [step, setStep] = useState(1);
  const [constructionPlan, setConstructionPlan] = useState<string>('');
  
  // Form data
  const [buildingType, setBuildingType] = useState('');
  const [description, setDescription] = useState('');
  const [terrainType, setTerrainType] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // UI state
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
    }
  };

  const nextStep = () => {
    if (step === 1 && !buildingType) {
      setError('Please select a building type');
      return;
    }
    if (step === 2 && !description.trim()) {
      setError('Please describe what you want to build');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleAnalyze = async () => {
    if (step === 3) {
      if (!terrainType) {
        setError('Please select a terrain type');
        return;
      }
      if (!budget.trim()) {
        setError('Please enter a budget');
        return;
      }
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Build comprehensive description from all steps
      let fullDescription = `Building Type: ${buildingType}. Description: ${description}. Terrain Type: ${terrainType}. Budget: ${budget}.`;
      
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const file = new File([blob], 'house.jpg', { type: blob.type });
        formData.append('image', file);
      }
      
      formData.append('text', fullDescription);

      const res = await fetch('/api/analyze-house', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }

      if (data.error) {
        throw new Error(data.error);
      }

            setConstructionPlan(data.steps || 'No steps generated');
      setSteps('');
      setStep(4); // Move to blueprint generation step
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to analyze. Please try again.';
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
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-cyan-300 hover:text-cyan-100 transition-colors"
          style={{ fontFamily: 'var(--font-roboto-mono)' }}
        >
          ← Back
        </button>

        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    s <= step
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  style={{ fontFamily: 'var(--font-roboto-mono)' }}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      s < step ? 'bg-cyan-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {!constructionPlan ? (
          <div className="bg-white/95 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg shadow-2xl p-6 md:p-8">
            {/* Step 1: What are you building? */}
            {step === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Step 1: What are you building?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['bridge', 'house', 'building'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setBuildingType(type);
                        setError('');
                      }}
                      className={`rounded-lg border-2 transition-all overflow-hidden ${
                        buildingType === type
                          ? 'border-cyan-600 bg-cyan-50'
                          : 'border-gray-300 hover:border-cyan-400'
                      }`}
                    >
                      <img 
                        src={`/${type}.jpg`} 
                        alt={type}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 text-center">
                        <div className="text-xl font-bold capitalize text-black" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                          {type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Describe your build */}
            {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Step 2: Describe your build
                </h2>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setError('');
                    }}
                    placeholder="Describe what you want to build in detail..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none resize-y min-h-[150px] text-black"
                    style={{ fontFamily: 'var(--font-roboto-mono)' }}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                    Upload Image (Optional)
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
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Budget and Terrain */}
            {step === 3 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Step 3: Budget & Terrain
                </h2>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                    Budget
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => {
                      setBudget(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your budget (e.g., $100,000)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none text-black"
                    style={{ fontFamily: 'var(--font-roboto-mono)' }}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                    Terrain Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Urban', 'Suburban', 'Rural', 'Coastal', 'Mountain', 'Desert', 'Forest', 'Plains'].map((terrain) => (
                      <button
                        key={terrain}
                        onClick={() => {
                          setTerrainType(terrain);
                          setError('');
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          terrainType === terrain
                            ? 'border-cyan-600 bg-cyan-50'
                            : 'border-gray-300 hover:border-cyan-400'
                        }`}
                      >
                        <div className="text-lg font-bold capitalize text-black" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                          {terrain}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Generate Blueprints */}
            {step === 4 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Step 4: Generate Blueprints
                </h2>
                {constructionPlan ? (
                  <div className="space-y-6">
                    <div className="bg-cyan-50 border-2 border-cyan-400/30 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        Construction Plan Generated
                      </h3>
                      <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                        Your construction plan has been created. Click the button below to generate detailed blueprint images for each construction phase.
                      </p>
                      <button
                        onClick={async () => {
                          setIsAnalyzing(true);
                          setError('');
                          try {
                            const res = await fetch('/api/analyze-house', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                prompt: `Generate detailed technical blueprints as markdown diagrams for each phase of this construction: ${constructionPlan}` 
                              }),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || 'Failed to generate blueprints');
                            setSteps(data.steps || 'No blueprints generated');
                          } catch (err: any) {
                            setError(err?.message || 'Failed to generate blueprints');
                          } finally {
                            setIsAnalyzing(false);
                          }
                        }}
                        disabled={isAnalyzing}
                        className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed uppercase flex items-center gap-2"
                        style={{ fontFamily: 'var(--font-roboto-mono)' }}
                      >
                        {isAnalyzing ? 'Generating Blueprints...' : 'Generate Blueprint Images'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    <p style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                      Please complete the previous steps first.
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => {
                  setStep(Math.max(1, step - 1));
                  setError('');
                }}
                disabled={step === 1}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                style={{ fontFamily: 'var(--font-roboto-mono)' }}
              >
                Back
              </button>
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 uppercase"
                  style={{ fontFamily: 'var(--font-roboto-mono)' }}
                >
                  Next
                </button>
              ) : step === 3 ? (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed uppercase flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-roboto-mono)' }}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Plan...
                    </>
                  ) : (
                    'Generate Construction Plan'
                  )}
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : constructionPlan && !steps ? (
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg shadow-2xl p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Construction Plan
              </h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                  {constructionPlan}
                </pre>
              </div>
            </div>
            {step === 4 && (
              <div className="bg-white/95 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg shadow-2xl p-6 md:p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  Ready for Blueprints
                </h2>
                <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                  Click the "Generate Blueprint Images" button above to create detailed blueprints for each construction phase.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg shadow-2xl p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Construction Blueprints
            </h2>
            <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
              Detailed technical specifications and step-by-step instructions
            </p>
            
            <div className="prose max-w-none">
              <div className="space-y-6">
                {steps.split('###').map((section, index) => {
                  if (!section.trim()) return null;
                  const lines = section.trim().split('\n');
                  const title = lines[0];
                  const content = lines.slice(1).join('\n');
                  
                  return (
                    <div key={index} className="border-2 border-cyan-400/30 rounded-lg p-6 bg-cyan-50/30">
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 uppercase" style={{ fontFamily: 'var(--font-orbitron)' }}>
                        {title}
                      </h3>
                      <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                        {content}
                      </pre>
                    </div>
                  );
                })}
                
                {!steps.includes('###') && (
                  <div className="border-2 border-cyan-400/30 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-roboto-mono)' }}>
                      {steps}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setSteps('');
                setConstructionPlan('');
                setStep(1);
                setBuildingType('');
                setDescription('');
                setTerrainType('');
                setBudget('');
                setSelectedImage(null);
              }}
              className="mt-6 px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 uppercase"
              style={{ fontFamily: 'var(--font-roboto-mono)' }}
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
