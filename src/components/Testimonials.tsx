import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-serif text-4xl font-bold text-slate-900">
          What Parents Are Saying
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="rounded-lg bg-white/50 p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-2xl">⭐️⭐️⭐️⭐️⭐️</div>
            </div>
            <p className="mt-4 text-slate-700">
              "The look on my daughter's face was priceless. She was so excited
              to get a letter from the North Pole!"
            </p>
            <p className="mt-4 text-right font-semibold text-slate-900">
              - Sarah J.
            </p>
          </div>
          {/* Testimonial 2 */}
          <div className="rounded-lg bg-white/50 p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-2xl">⭐️⭐️⭐️⭐️⭐️</div>
            </div>
            <p className="mt-4 text-slate-700">
              "The quality of the letter and the wax seal was amazing. It felt
              so authentic."
            </p>
            <p className="mt-4 text-right font-semibold text-slate-900">
              - Michael B.
            </p>
          </div>
          {/* Testimonial 3 */}
          <div className="rounded-lg bg-white/50 p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-2xl">⭐️⭐️⭐️⭐️⭐️</div>
            </div>
            <p className="mt-4 text-slate-700">
              "This is such a magical experience. I'm so glad I found this for
              my son."
            </p>
            <p className="mt-4 text-right font-semibold text-slate-900">
              - Emily R.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
