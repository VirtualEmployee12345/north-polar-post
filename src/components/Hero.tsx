import React from 'react';
import CTAButton from './CTAButton';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20 md:flex-row md:items-center md:gap-14">
        {/* copy */}
        <div className="flex-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            The North Polar Post
          </p>
          <h1 className="font-serif text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
            Give Them the Magic You Remember
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-700">
            Before tablets and tracking numbers, there was ink, parchment, and
            the wonder of a letter from the frozen North. Bring the real North
            Pole to your doorstep this December.
          </p>

          <div className="mt-8">
            <CTAButton />
          </div>
        </div>

        {/* illustration */}
        <div className="flex-1 relative">
          <img 
            src="/illustration.png" 
            alt="Cozy fireplace scene with handwritten letters, a quill pen, and a warm mug of cocoa" 
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-20 bg-repeat-x"
        style={{
          backgroundImage: "url('/torn-paper.svg')",
          backgroundSize: "cover",
        }}
      />
    </section>
  );
};

export default HeroSection;
