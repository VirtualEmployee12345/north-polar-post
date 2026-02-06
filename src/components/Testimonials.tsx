import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="relative py-12 -mt-10">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-serif text-3xl font-bold text-[#3d2914] mb-10">
          What Parents Are Saying
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="relative bg-[#f4e4c1] border-2 border-[#d4b896] p-6 shadow-lg"
               style={{
                 backgroundImage: `
                   repeating-linear-gradient(
                     transparent,
                     transparent 31px,
                     rgba(139, 107, 71, 0.05) 31px,
                     rgba(139, 107, 71, 0.05) 32px
                   )
                 `,
                 boxShadow: '4px 4px 0 rgba(139, 107, 71, 0.2), inset 0 0 20px rgba(139, 107, 71, 0.1)'
               }}>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#3d2914] font-serif leading-relaxed">
              "Pure magic! My daughter was mesmerized. The detail is incredible."
            </p>
            <p className="mt-4 text-[#5c4033] font-serif italic">
              - Sarah M.
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="relative bg-[#f4e4c1] border-2 border-[#d4b896] p-6 shadow-lg"
               style={{
                 backgroundImage: `
                   repeating-linear-gradient(
                     transparent,
                     transparent 31px,
                     rgba(139, 107, 71, 0.05) 31px,
                     rgba(139, 107, 71, 0.05) 32px
                   )
                 `,
                 boxShadow: '4px 4px 0 rgba(139, 107, 71, 0.2), inset 0 0 20px rgba(139, 107, 71, 0.1)'
               }}>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#3d2914] font-serif leading-relaxed">
              "The highlight of our December. So much better than a simple printout."
            </p>
            <p className="mt-4 text-[#5c4033] font-serif italic">
              - David K.
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="relative bg-[#f4e4c1] border-2 border-[#d4b896] p-6 shadow-lg"
               style={{
                 backgroundImage: `
                   repeating-linear-gradient(
                     transparent,
                     transparent 31px,
                     rgba(139, 107, 71, 0.05) 31px,
                     rgba(139, 107, 71, 0.05) 32px
                   )
                 `,
                 boxShadow: '4px 4px 0 rgba(139, 107, 71, 0.2), inset 0 0 20px rgba(139, 107, 71, 0.1)'
               }}>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#3d2914] font-serif leading-relaxed">
              "Worth every penny for the wonder in his eyes. A new tradition."
            </p>
            <p className="mt-4 text-[#5c4033] font-serif italic">
              - Emily R.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
