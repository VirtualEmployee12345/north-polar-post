"use client";

import React from 'react';
import Link from 'next/link';

interface OrderConfirmationProps {
  childName?: string;
  orderNumber?: string;
  orderDate?: string;
  total?: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  childName = "[Child's Name]",
  orderNumber = "NP-123456",
  orderDate = "November 15, 2026",
  total = "$39.99"
}) => {
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
          Magic is on its Way!
        </h1>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          
          {/* Illustration */}
          <div className="flex-1">
            <img 
              src="/santa-sleigh.png" 
              alt="Santa Claus in his sleigh flying over a snowy village with reindeer"
              className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl rounded-lg"
            />
          </div>

          {/* Order Details */}
          <div className="flex-1 space-y-8">
            {/* Thank You Message */}
            <div>
              <p className="font-serif text-lg md:text-xl text-[#3d2914] leading-relaxed">
                Thank you! We have received your order for{" "}
                <span className="font-semibold">{childName}</span>. The elves are already at work!
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-[#f8e8c8] rounded-lg p-6 border border-[#d4b896] shadow-inner">
              <div className="space-y-2 font-serif text-[#3d2914]">
                <p><span className="font-semibold">Order #:</span> {orderNumber}</p>
                <p><span className="font-semibold">Date:</span> {orderDate}</p>
                <p><span className="font-semibold">Total:</span> {total}</p>
              </div>
            </div>

            {/* What Happens Next */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#3d2914] mb-4">
                What Happens Next?
              </h2>
              <ol className="space-y-3 font-serif text-lg text-[#5c4033] list-decimal list-inside">
                <li>The first letter will be dispatched in early December.</li>
                <li>The second letter will follow in mid-December.</li>
                <li>The final letter and certificate will arrive just before Christmas Eve.</li>
              </ol>
            </div>

            {/* Signature */}
            <div className="pt-4">
              <p className="font-serif text-lg text-[#3d2914]">With anticipation,</p>
              <p className="font-serif text-2xl text-[#3d2914] italic mt-1">
                Father Christmas
              </p>
            </div>

            {/* Back to Home Link */}
            <div className="pt-6">
              <Link 
                href="/"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-gradient-to-b from-[#a0522d] via-[#8b4513] to-[#6b3410] text-white font-serif text-base tracking-wide shadow-[0_4px_0_#3d1f0a,0_6px_15px_rgba(0,0,0,0.35)] transition-transform duration-150 active:translate-y-1 hover:from-[#b0633d] hover:via-[#9b5523] hover:to-[#7b4518]"
              >
                Return to Home
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;
