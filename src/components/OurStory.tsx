import React from 'react';

const OurStory: React.FC = () => {
  return (
    <section className="relative py-16 px-6 bg-[#f5e6c8] min-h-screen">
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
        {/* Page Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#3d2914] mb-12">
          The Legend of the North Polar Post
        </h1>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Illustration */}
          <div className="flex-1">
            <img 
              src="/santa-desk.png" 
              alt="Father Christmas writing letters at his desk with the North Polar Bear sleeping underneath"
              className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl rounded-lg"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-6">
            <p className="font-serif text-lg md:text-xl text-[#3d2914] leading-relaxed">
              For centuries, the North Polar Post has been the only reliable mail service 
              north of the Arctic Circle. It is not powered by machines, but by magic, 
              memory, and the tireless work of Father Christmas and his 
              (sometimes unhelpful) assistant, the North Polar Bear.
            </p>

            <p className="font-serif text-lg md:text-xl text-[#3d2914] leading-relaxed">
              We believe that a letter is more than paper—it is a bridge between worlds. 
              Our mission is to keep that bridge open, one handwritten note at a time, 
              sharing the true stories, mishaps, and magic of the North Pole with children 
              who still believe.
            </p>

            <div className="pt-8">
              <p className="font-serif text-lg text-[#3d2914]">Yours always,</p>
              <p className="font-serif text-2xl md:text-3xl text-[#3d2914] italic mt-1">
                Father Christmas
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurStory;
