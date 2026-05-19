"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Thank you! We'll be in touch soon.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const inputClasses =
    "w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            Phone <span className="text-text-secondary/40">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            Subject <span className="text-accent">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select a subject</option>
            <option value="IT Consulting">IT Consulting</option>
            <option value="Web Development">Web Development</option>
            <option value="SEO">SEO</option>
            <option value="Business Mentoring">Business Mentoring</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your project..."
          className={`${inputClasses} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-lg font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 transition-opacity cursor-pointer"
      >
        Send Message
      </button>
    </form>
  );
}
