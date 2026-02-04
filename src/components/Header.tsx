import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-amber-200/50 bg-amber-50/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <h1 className="font-serif text-xl font-semibold tracking-tight text-amber-900 sm:text-2xl">
          The North Polar Post
        </h1>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-amber-800">
            <li>
              <a href="#our-story" className="transition-colors hover:text-amber-950">
                Our Story
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="transition-colors hover:text-amber-950">
                How It Works
              </a>
            </li>
            <li>
              <a href="#faq" className="transition-colors hover:text-amber-950">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="transition-colors hover:text-amber-950">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-amber-300 px-3 py-2 text-sm font-medium text-amber-800 hover:border-amber-400 hover:text-amber-950 sm:hidden"
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>
    </header>
  );
};

export default Header;
