Sandbox is read-only here, so I can’t write the file directly. Here’s a self‑contained TypeScript React component you can drop into a single file (e.g., `Header.tsx`).

```tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          The North Polar Post
        </h1>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-700">
            <li>
              <a
                href="#our-story"
                className="transition-colors hover:text-slate-900"
              >
                Our Story
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="transition-colors hover:text-slate-900"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="transition-colors hover:text-slate-900"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="transition-colors hover:text-slate-900"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 sm:hidden"
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      <div className="sm:hidden border-t border-slate-200">
        <nav aria-label="Primary" className="px-4 py-3">
          <ul className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <li>
              <a
                href="#our-story"
                className="block rounded-md px-2 py-2 hover:bg-slate-50 hover:text-slate-900"
              >
                Our Story
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="block rounded-md px-2 py-2 hover:bg-slate-50 hover:text-slate-900"
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="block rounded-md px-2 py-2 hover:bg-slate-50 hover:text-slate-900"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block rounded-md px-2 py-2 hover:bg-slate-50 hover:text-slate-900"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

If you want me to wire it into an existing layout or match a brand palette, share the file path and style direction.
