"use client";

import React, { useState } from "react";

const OrderForm: React.FC = () => {
  const [formData, setFormData] = useState({
    childName: "",
    city: "",
    goodDeed: "",
    specialWish: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="order" className="relative py-16 px-6 bg-[#f5e6c8]">
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
        {/* Section Title */}
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center text-[#3d2914] mb-8">
          Secure Their Spot on the Sleigh List
        </h2>

        {/* Ledger Book Container */}
        <div className="relative">
          <img 
            src="/ledger-book.png" 
            alt="Old ledger book form"
            className="w-full h-auto"
          />
          
          {/* Form Overlay */}
          <form 
            onSubmit={handleSubmit}
            className="absolute inset-[8%] top-[12%] flex flex-col justify-between"
          >
            {/* Form Fields */}
            <div className="space-y-6 md:space-y-8">
              
              {/* Field 1: Child's Name */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-lg md:text-xl lg:text-2xl text-[#3d2914]">
                  Child&apos;s First Name
                </span>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) => handleChange("childName", e.target.value)}
                  placeholder="e.g., Leo"
                  required
                  className="flex-1 min-w-[120px] bg-transparent border-b-2 border-[#8b4513] text-[#5c4033] placeholder-[#a08060] font-serif text-lg md:text-xl lg:text-2xl px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors"
                />
              </div>

              {/* Field 2: City */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-lg md:text-xl lg:text-2xl text-[#3d2914]">
                  Santa&apos;s sleigh is headed toward...
                </span>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="[City, State]"
                  required
                  className="flex-1 min-w-[150px] bg-transparent border-b-2 border-[#8b4513] text-[#5c4033] placeholder-[#a08060] font-serif text-lg md:text-xl lg:text-2xl px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors italic"
                />
              </div>

              {/* Field 3: Good Deed */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-lg md:text-xl lg:text-2xl text-[#3d2914]">
                  Father Christmas was so proud that you...
                </span>
                <input
                  type="text"
                  value={formData.goodDeed}
                  onChange={(e) => handleChange("goodDeed", e.target.value)}
                  placeholder="[Good Deed, e.g., shared your toys]"
                  required
                  className="flex-1 min-w-[200px] bg-transparent border-b-2 border-[#8b4513] text-[#5c4033] placeholder-[#a08060] font-serif text-lg md:text-xl lg:text-2xl px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors italic"
                />
              </div>

              {/* Field 4: Special Wish */}
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-lg md:text-xl lg:text-2xl text-[#3d2914]">
                  The Elves heard you were hoping for a...
                </span>
                <input
                  type="text"
                  value={formData.specialWish}
                  onChange={(e) => handleChange("specialWish", e.target.value)}
                  placeholder="[Special Wish, e.g., shiny new telescope]"
                  required
                  className="flex-1 min-w-[220px] bg-transparent border-b-2 border-[#8b4513] text-[#5c4033] placeholder-[#a08060] font-serif text-lg md:text-xl lg:text-2xl px-2 py-1 focus:outline-none focus:border-[#5c4033] transition-colors italic"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8 md:mt-12">
              <button
                type="submit"
                disabled={isLoading}
                className="relative inline-flex items-center justify-center h-16 md:h-20 px-8 md:px-12 rounded-full bg-gradient-to-b from-[#c44536] via-[#a33224] to-[#7a1f16] text-white font-serif text-base md:text-lg tracking-wide shadow-[0_6px_0_#4a1209,0_10px_25px_rgba(0,0,0,0.35)] transition-transform duration-150 active:translate-y-1 active:shadow-[0_4px_0_#4a1209,0_6px_15px_rgba(0,0,0,0.35)] hover:from-[#d45546] hover:via-[#b34232] hover:to-[#8a2f22] disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label="Complete Purchase - $39.99"
              >
                {/* Wax seal icon */}
                <span className="absolute left-2 md:left-3 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#c44536] to-[#7a1f16] shadow-inner border-2 border-[#e8b4a0] flex items-center justify-center text-xs">
                  {isLoading ? '...' : '✉'}
                </span>
                <span className="ml-8 md:ml-10">
                  {isLoading ? 'Preparing Magic...' : 'Complete Purchase - $39.99'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
