import React from 'react';
import CTAButton from './CTAButton';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-transparent px-4 py-8 md:px-6 lg:px-8">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="mx-auto flex max-w-6xl w-full flex-col items-center gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16">
        {/* Copy - Above the fold priority */}
        <div className="flex-1 text-center md:text-left order-1">
          <h1 
            className="font-bold leading-[1.1] text-[#2A221B] mb-4 md:mb-6"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            <span className="block text-[clamp(2.25rem,6vw,4rem)]">Give Them the</span>
            <span className="block text-[clamp(2.5rem,7vw,4.5rem)] italic">Magic You</span>
            <span className="block text-[clamp(2.25rem,6vw,4rem)]">Remember</span>
          </h1>
          
          <p 
            className="max-w-lg mx-auto md:mx-0 text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed text-[#3d2914]/90 mb-6 md:mb-8"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            Before tablets and tracking numbers, there was ink, parchment, and
            the wonder of a letter from the frozen North. Bring the real North
            Pole to your doorstep this December.
          </p>

          <div className="flex justify-center md:justify-start">
            <CTAButton />
          </div>
        </div>

        {/* Illustration */}
        <div className="flex-1 relative order-2 w-full max-w-md md:max-w-none">
          <img 
            src="/hero-santa-letter.png" 
            alt="Cozy fireplace scene with Santa's letters, quill pen, and warm cocoa" 
            className="w-full h-auto drop-shadow-2xl rounded-sm"
          />
        </div>
      </div>

      {/* Bottom torn edge */}
      <div
        className="absolute bottom-0 left-0 w-full h-16 md:h-20 bg-repeat-x pointer-events-none"
        style={{
          backgroundImage: "url('/torn-paper.svg')",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      />
    </section>
  );
};

export default HeroSection;
