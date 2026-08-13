"use client";

import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  message: string;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source: "Contact Form",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center animate-fade-in-up">
        <p className="mb-4 text-xs tracking-[0.3em] uppercase text-gold">
          Received
        </p>
        <h3 className="font-serif text-2xl text-ink">
          Thank you for reaching out.
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-ink/50">
          We will respond with a written concept, design direction, and budget
          band -- typically within a few days. No sales call unless you want
          one.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
            placeholder="First and last"
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
            placeholder="you@email.com"
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
          >
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
            placeholder="(512) 555-0000"
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
          >
            Your address (optional)
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
            placeholder="Austin, TX"
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
          >
            Tell us about your space and how you want it to feel
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full resize-none border-b border-ink/15 bg-transparent py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
            placeholder="A backyard that feels like an escape. Mostly shaded, needs to work with two old oaks..."
            disabled={loading}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-10 inline-flex rounded-lg bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-evergreen transition-all duration-300 hover:bg-champagne disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
