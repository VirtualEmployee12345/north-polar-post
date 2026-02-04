"use client";

import React from "react";

const OrderForm: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      childName: formData.get("childName"),
      customCity: formData.get("customCity"),
      customDeed: formData.get("customDeed"),
      customWish: formData.get("customWish"),
    };
    console.log("Form data:", data);
    // TODO: Handle form submission
  };

  return (
    <section className="bg-slate-50/70 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur-lg sm:p-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Create Your Letter
          </h2>
          <p className="mt-3 max-w-lg text-slate-600">
            Fill in the details below to personalize the letter from Santa.
            Each field helps make the magic even more real.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="childName"
                className="block text-sm font-semibold text-slate-700"
              >
                Child's Name
              </label>
              <input
                type="text"
                id="childName"
                name="childName"
                placeholder="e.g., Lily"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <div>
              <label
                htmlFor="customCity"
                className="block text-sm font-semibold text-slate-700"
              >
                City (Custom 1)
              </label>
              <input
                type="text"
                id="customCity"
                name="customCity"
                placeholder="e.g., a snowy village called Starfall"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <div>
              <label
                htmlFor="customDeed"
                className="block text-sm font-semibold text-slate-700"
              >
                Deed (Custom 2)
              </label>
              <textarea
                id="customDeed"
                name="customDeed"
                placeholder="e.g., Helped their neighbor shovel snow."
                required
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <div>
              <label
                htmlFor="customWish"
                className="block text-sm font-semibold text-slate-700"
              >
                Wish (Custom 3)
              </label>
              <textarea
                id="customWish"
                name="customWish"
                placeholder="e.g., Wishing for a telescope to see the stars."
                required
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-200"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
