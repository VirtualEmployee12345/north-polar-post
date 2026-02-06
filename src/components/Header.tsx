"use client";

import React, { useState } from "react";
import Link from "next/link";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 border-b-2 border-[#d4b896]/60 bg-[#f5e6c8]/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="font-serif text-2xl font-bold tracking-tight text-[#3d2914] hover:text-[#5c4033] transition-all duration-300 hover:scale-105"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          The North Polar Post
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8 text-base font-medium text-[#5c4033]">
            {[
              { href: "/our-story", label: "Our Story" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="relative font-serif transition-all duration-300 hover:text-[#3d2914] group py-2"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8b4513] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border-2 border-[#d4b896] bg-[#f4e4c1] px-4 py-2 text-sm font-semibold text-[#3d2914] hover:bg-[#e8d4a8] transition-all duration-300"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <span className="mr-2">Menu</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav 
          className="md:hidden border-t-2 border-[#d4b896]/60 bg-[#f5e6c8]/98 backdrop-blur-md animate-fade-in-up"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col py-4 px-4 space-y-1">
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
                  className="block py-3 px-4 text-lg font-serif font-medium text-[#5c4033] hover:text-[#3d2914] hover:bg-[#e8d4a8]/50 rounded-lg transition-all duration-200"
                  style={{ fontFamily: 'var(--font-playfair)' }}
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
