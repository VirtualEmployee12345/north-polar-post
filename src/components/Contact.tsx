"use client";

import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // TODO: Integrate with email service
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      <div className="relative max-w-5xl mx-auto">
        {/* Page Title */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#3d2914] mb-12">
          Contact the Workshop
        </h1>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Contact Form */}
          <div className="flex-1">
            {/* Ledger Paper Background */}
            <div className="relative bg-[#f8e8c8] rounded-sm shadow-2xl p-6 md:p-8 border-2 border-[#d4b896]" style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e8d4b8 31px, #e8d4b8 32px)',
              backgroundPosition: '0 60px'
            }}>
              {/* Ledger Grid Lines Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 border-r-2 border-[#c9a87c] bg-[#f2dec0]"></div>
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                {/* Name Field */}
                <div className="flex items-start">
                  <label className="w-20 md:w-28 pt-2 font-serif text-[#3d2914] text-base md:text-lg font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="flex-1 bg-transparent border-b border-[#8b7355] text-[#3d2914] font-serif text-base md:text-lg px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors"
                    style={{ background: 'transparent' }}
                  />
                </div>

                {/* Email Field */}
                <div className="flex items-start">
                  <label className="w-20 md:w-28 pt-2 font-serif text-[#3d2914] text-base md:text-lg font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="flex-1 bg-transparent border-b border-[#8b7355] text-[#3d2914] font-serif text-base md:text-lg px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors"
                    style={{ background: 'transparent' }}
                  />
                </div>

                {/* Subject Field */}
                <div className="flex items-start">
                  <label className="w-20 md:w-28 pt-2 font-serif text-[#3d2914] text-base md:text-lg font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    required
                    className="flex-1 bg-transparent border-b border-[#8b7355] text-[#3d2914] font-serif text-base md:text-lg px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors"
                    style={{ background: 'transparent' }}
                  />
                </div>

                {/* Message Field */}
                <div className="flex items-start">
                  <label className="w-20 md:w-28 pt-2 font-serif text-[#3d2914] text-base md:text-lg font-medium">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    rows={5}
                    className="flex-1 bg-transparent border-b border-[#8b7355] text-[#3d2914] font-serif text-base md:text-lg px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors resize-none"
                    style={{ 
                      background: 'transparent',
                      lineHeight: '32px'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="relative inline-flex items-center justify-center h-14 px-8 rounded-lg bg-gradient-to-b from-[#a0522d] via-[#8b4513] to-[#6b3410] text-white font-serif text-lg tracking-wide shadow-[0_4px_0_#3d1f0a,0_8px_20px_rgba(0,0,0,0.35)] transition-transform duration-150 active:translate-y-1 active:shadow-[0_2px_0_#3d1f0a,0_4px_10px_rgba(0,0,0,0.35)] hover:from-[#b0633d] hover:via-[#9b5523] hover:to-[#7b4518]"
                  >
                    Send via Elf Messenger
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Postal Address & Illustration */}
          <div className="flex-1 flex flex-col items-center lg:items-start space-y-8">
            {/* Postal Address */}
            <div className="text-center lg:text-left">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#3d2914] mb-4">
                Postal Address
              </h2>
              <div className="font-serif text-lg md:text-xl text-[#5c4033] leading-relaxed">
                <p>The North Polar Post</p>
                <p>c/o Father Christmas</p>
                <p>Top of the World, NP 00001</p>
                <p>Arctic Circle</p>
              </div>
            </div>

            {/* Mailbox Illustration */}
            <div className="w-full max-w-sm lg:max-w-md">
              <img 
                src="/mailbox-reindeer.png" 
                alt="Snowy mailbox with a reindeer standing beside it"
                className="w-full h-auto drop-shadow-lg"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
