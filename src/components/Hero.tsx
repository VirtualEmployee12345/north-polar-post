import React from 'react';
import CTAButton from './CTAButton';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-amber-50/50">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-20 md:flex-row md:items-center md:gap-14">
        {/* copy */}
        <div className="flex-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            The North Polar Post
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
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

        {/* illustration placeholder */}
        <div className="flex-1">
          <div className="relative aspect-[4/3] w-full rounded-3xl border-2 border-dashed border-amber-400/70 bg-white/60 p-6 shadow-lg">
            <div className="absolute inset-0 m-6 rounded-2xl border border-amber-300/60 bg-amber-50/60" />
            <div className="relative z-10 flex h-full items-center justify-center text-sm font-semibold uppercase tracking-widest text-amber-700">
              Illustration Placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
