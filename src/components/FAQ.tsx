"use client";

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "When will the letters arrive?",
    answer: "The letters are sent in a sequence to build anticipation! The first letter typically arrives in early December, the second in mid-December, and the final letter just before Christmas Eve. We use a special blend of elf magic and standard postal services, so timing can vary slightly by location."
  },
  {
    question: "Can I personalize the letters?",
    answer: "Absolutely! Each letter is personalized with your child's name, city, a recent good deed they're proud of, and their special Christmas wish. The more details you provide, the more magical the experience becomes."
  },
  {
    question: "What if my child has a unique name?",
    answer: "Father Christmas has been doing this for centuries and has seen every kind of name imaginable! Our system handles all names beautifully, and the handwriting looks authentic regardless of length or spelling."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! The North Polar Post delivers to children all around the world. Whether you're in New York, London, Sydney, or a small village in the mountains, Father Christmas will find his way to your doorstep."
  },
  {
    question: "What is your refund policy?",
    answer: "We want every child to experience the magic. If you're not completely satisfied, contact us within 30 days of your first letter's delivery for a full refund. We stand behind the quality and wonder of every letter we send."
  },
  {
    question: "What if I have other questions?",
    answer: "We're here to help! You can reach us at magic@northpolarpost.com, and one of our helpful elves will respond as quickly as their little fingers can type."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative py-16 px-6 bg-[#f5e6c8] min-h-screen">
      {/* Sparkle overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#3d2914] mb-12">
          Frequently Asked Questions
        </h1>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className="border-b border-[#8b7355] last:border-b-0"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full flex items-center gap-4 py-5 text-left group"
                aria-expanded={openIndex === index}
              >
                {/* Envelope Icon */}
                <span className="flex-shrink-0 w-8 h-8 text-[#8b4513] opacity-80">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>

                {/* Question */}
                <span className="flex-1 font-serif text-lg md:text-xl text-[#3d2914] group-hover:text-[#5c4033] transition-colors">
                  Q: {item.question}
                </span>

                {/* Chevron */}
                <span className={`flex-shrink-0 w-6 h-6 text-[#5c4033] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>

              {/* Answer */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="pb-6 pl-12">
                  <p className="font-serif text-base md:text-lg text-[#5c4033] leading-relaxed">
                    A: {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Elf Illustration */}
        <div className="absolute bottom-0 right-0 w-32 md:w-48 lg:w-56 pointer-events-none hidden sm:block">
          <img 
            src="/elf-faq.png" 
            alt="Helpful elf reading a scroll"
            className="w-full h-auto opacity-90"
          />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
