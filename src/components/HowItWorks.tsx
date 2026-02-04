import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-20 px-6 bg-[#f5e6c8]">
      {/* Sparkle overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#3d2914] mb-16">
          How the Magic Unfolds
        </h2>

        {/* Steps Container */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-4">
          
          {/* Step 1 */}
          <div className="flex-1 text-center max-w-md">
            <div className="relative mb-6">
              <img 
                src="/step1-form.png" 
                alt="Magical form on tablet with quill pen"
                className="w-full h-auto max-w-[280px] mx-auto drop-shadow-lg"
              />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#3d2914] mb-2">
              1. You Create the Moment.<br />We'll Write the Letters.
            </h3>
            <p className="text-lg text-[#5c4033] leading-relaxed">
              Tell us about your child in a few short sentences.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center px-4">
            <svg 
              width="120" 
              height="40" 
              viewBox="0 0 120 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#8b4513]"
            >
              <path 
                d="M0 20H115M115 20L100 5M115 20L100 35" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Mobile arrow */}
          <div className="md:hidden flex items-center justify-center">
            <svg 
              width="40" 
              height="60" 
              viewBox="0 0 40 60" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#8b4513]"
            >
              <path 
                d="M20 0V55M20 55L5 40M20 55L35 40" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="flex-1 text-center max-w-md">
            <div className="relative mb-6">
              <img 
                src="/step2-boy.png" 
                alt="Excited boy receiving letters from Father Christmas"
                className="w-full h-auto max-w-[320px] mx-auto drop-shadow-lg"
              />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#3d2914] mb-2">
              2. A December Story<br />in 3 Chapters.
            </h3>
            <p className="text-lg text-[#5c4033] leading-relaxed">
              A narrative adventure arrives at your door, building anticipation all month.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
