import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="relative py-12 -mt-10">
      {/* Banner Header */}
      <div className="mx-auto max-w-4xl px-6 mb-8">
        <div className="relative">
          <img 
            src="/reviews-banner.png" 
            alt="What Parents Are Saying" 
            className="w-full h-auto"
          />
          <h2 
            className="absolute inset-0 flex items-center justify-center text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-[#2A221B] drop-shadow-lg px-8 text-center"
            style={{ fontFamily: 'var(--font-cormorant)', textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}
          >
            What Parents Are Saying
          </h2>
        </div>
      </div>
      
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="parchment-card p-6 rounded-sm">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#2A221B] leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
              "Pure magic! My daughter was mesmerized. The detail is incredible."
            </p>
            <p className="mt-4 text-[#5c4033] italic" style={{ fontFamily: 'var(--font-cormorant)' }}>
              — Sarah M.
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="parchment-card p-6 rounded-sm">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#2A221B] leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
              "The highlight of our December. So much better than a simple printout."
            </p>
            <p className="mt-4 text-[#5c4033] italic" style={{ fontFamily: 'var(--font-cormorant)' }}>
              — David K.
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="parchment-card p-6 rounded-sm">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#2A221B] leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
              "Worth every penny for the wonder in his eyes. A new tradition."
            </p>
            <p className="mt-4 text-[#5c4033] italic" style={{ fontFamily: 'var(--font-cormorant)' }}>
              — Emily R.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Testimonials;
