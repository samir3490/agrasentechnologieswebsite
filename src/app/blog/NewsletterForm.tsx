"use client";

import { useState, FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    alert("Thanks for subscribing! You'll receive our latest insights.");
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubscribe}
      className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full sm:flex-1 bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
