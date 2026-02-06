"use client";

import React, { useState } from "react";
import Link from "next/link";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header 
      className="w-full sticky top-0 z-50 bg-[#F8F4E3]/95 backdrop-blur-md"
      style={{ 
        boxShadow: '0 2px 20px rgba(139, 107, 71, 0.15)',
        borderBottom: 'none'
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="font-bold tracking-tight text-[#2A221B] hover:text-[#5c4033] transition-all duration-300 hover:scale-105"
          style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
        >
          The North Polar Post
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 lg:gap-8">
            {[
              { href: "/our-story", label: "Our Story" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="relative font-medium text-[#3d2914]/80 hover:text-[#2A221B] transition-all duration-300 group py-2 text-[15px]"
                  style={{ fontFamily: 'var(--font-lora)' }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#A32828] transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#2A221B] hover:bg-[#EAD7B4]/50 transition-all duration-200"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav 
          className="md:hidden bg-[#F8F4E3]/98 border-t border-[#EAD7B4] animate-fade-in-up"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col py-3 px-4 space-y-1">
            {[
              { href: "/our-story", label: "Our Story" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-lg font-medium text-[#3d2914] hover:text-[#2A221B] hover:bg-[#EAD7B4]/40 rounded-lg transition-all duration-200"
                  style={{ fontFamily: 'var(--font-lora)' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
