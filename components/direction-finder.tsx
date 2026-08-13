"use client";

import { useState } from "react";
import Link from "next/link";
import { ArchetypeVisual } from "./archetype-visual";
import { InvestmentEstimator } from "./investment-estimator";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: "feeling",
    question: "How do you want your garden to make you feel?",
    options: [
      { label: "Calm", value: "calm" },
      { label: "Grounded", value: "grounded" },
      { label: "Social", value: "social" },
      { label: "Meditative", value: "meditative" },
      { label: "Restorative", value: "restorative" },
    ],
  },
  {
    id: "maintenance",
    question: "How much time would you give to your garden each week?",
    options: [
      { label: "Almost none", value: "low" },
      { label: "A little -- I enjoy it", value: "medium" },
      { label: "I want to be hands-on", value: "high" },
    ],
  },
  {
    id: "sun",
    question: "What is the sun exposure in your space?",
    options: [
      { label: "Full sun most of the day", value: "full" },
      { label: "Partial shade", value: "partial" },
      { label: "Mostly shaded", value: "shade" },
      { label: "I am not sure", value: "unknown" },
    ],
  },
  {
    id: "water",
    question: "What role should water play?",
    options: [
      { label: "None -- I prefer dry gardens", value: "none" },
      { label: "Subtle -- a quiet element", value: "subtle" },
      { label: "Central -- the heart of the space", value: "central" },
    ],
  },
  {
    id: "style",
    question: "Where do you sit on the design spectrum?",
    options: [
      { label: "Natural and organic", value: "natural" },
      { label: "Balanced", value: "balanced" },
      { label: "Minimal and structured", value: "minimal" },
    ],
  },
  {
    id: "privacy",
    question: "How enclosed should the space feel?",
    options: [
      { label: "Open and expansive", value: "open" },
      { label: "Semi-private", value: "semi" },
      { label: "Fully enclosed retreat", value: "enclosed" },
    ],
  },
];

interface Archetype {
  name: string;
  tagline: string;
  description: string;
  image: string;
}

function getArchetype(answers: Record<string, string>): Archetype {
  const { feeling, water, style } = answers;

  if (feeling === "meditative" || (style === "minimal" && water === "none")) {
    return {
      name: "Zen Courtyard",
      tagline: "Silence as design material",
      description:
        "Your ideal space is defined by what it leaves out. Raked gravel, carefully placed stone, and deliberate emptiness create a visual quiet that mirrors the mental state you are seeking. In Austin's heat, dry gardens like this are not just beautiful -- they are deeply practical.",
      image: "/images/archetype-zen-courtyard.jpg",
    };
  }

  if (water === "central" || (feeling === "calm" && water === "subtle")) {
    return {
      name: "Water Garden",
      tagline: "Sound as sanctuary",
      description:
        "Subtle water sounds introduce non-repeating natural noise, helpingÿúþÚ$z{ÿ¶»§q«^ÿõr() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Archetype | null>(null);
  const [showInvestment, setShowInvestment] = useState(false);
  const [investmentData, setInvestmentData] = useState<{
    estimate: string;
    size: string;
    timeline: string;
  } | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const isComplete = step >= questions.length;
  const current = questions[step];

  function handleSelect(value: string) {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    if (step + 1 >= questions.length) {
      setResult(getArchetype(newAnswers));
    }

    setTimeout(() => setStep(step + 1), 300);
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
      setResult(null);
    }
  }

  function handleReset() {
    setStep(0);
    setAnswers({});
    setResult(null);
    setShowInvestment(false);
    setInvestmentData(null);
    setShowInquiryForm(false);
    setInquirySubmitted(false);
    setInquiryError(null);
  }

  function handleInvestmentComplete(estimate: string, size: string, timeline: string) {
    setInvestmentData({ estimate, size, timeline });
    setShowInquiryForm(true);
  }

  async function handleInquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInquiryLoading(true);
    setInquiryError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          message: message || `Interested in a ${result?.name} design.`,
          source: "Direction Finder Quiz",
          archetype: result?.name,
          estimatedInvestment: investmentData?.estimate,
          quizAnswers: {
            ...answers,
            spaceSize: investmentData?.size,
            timeline: investmentData?.timeline,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We could not send your inquiry. Please try again.");
      }

      setInquirySubmitted(true);
    } catch (error) {
      setInquiryError(
        error instanceof Error
          ? error.message
          : "We could not send your inquiry. Please try again."
      );
    } finally {
      setInquiryLoading(false);
    }
  }

  if (isComplete && result) {
    // Inquiry submitted - thank you state
    if (inquirySubmitted) {
      return (
        <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32 space-y-6">
          <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold animate-fade-in">
            Thank You
          </p>
          <h2 className="font-serif text-3xl text-ink md:text-4xl animate-fade-in-up">
            We'll Be in Touch Soon
          </h2>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-ink/60 animate-fade-in-up">
            Your inquiry for a {result.name} has been received. We typically respond within 2 business days to schedule an initial conversation about your space.
          </p>
          {investmentData && (
            <div className="bg-forest/5 border border-forest/10 rounded-xl p-6 max-w-sm mx-auto animate-fade-in-up">
              <p className="text-xs tracking-[0.2em] uppercase text-ink/40 mb-2">
                Your Estimated Investment
              </p>
              <p className="font-serif text-xl text-forest">
                {investmentData.estimate}
              </p>
            </div>
          )}
          <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in-up sm:flex-row sm:justify-center">
            <button
              onClick={handleReset}
              className="inline-flex rounded-lg bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-evergreen transition-all duration-300 hover:bg-champagne"
            >
              Explore Another Direction
            </button>
            <Link
              href="/blog"
              className="inline-flex rounded-lg border border-ink/20 bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-all duration-300 hover:border-gold hover:text-gold"
            >
              Read Our Philosophy
            </Link>
          </div>
        </div>
      );
    }

    // Inquiry form state
    if (showInquiryForm && investmentData) {
      return (
        <div className="mx-auto max-w-xl px-6 py-24 md:py-32 space-y-8">
          <div className="text-center">
            <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold animate-fade-in">
              Almost There
            </p>
            <h2 className="font-serif text-3xl text-ink animate-fade-in-up">
              Tell Us About Yourself
            </h2>
          </div>

          {/* Investment Summary */}
          <div className="bg-forest/5 border border-forest/10 rounded-xl p-5 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.1em] uppercase text-ink/40">
                  {result.name}
                </p>
                <p className="font-serif text-lg text-forest mt-1">
                  {investmentData.estimate}
                </p>
              </div>
              <button
                onClick={() => setShowInquiryForm(false)}
                className="text-xs text-ink/40 hover:text-gold transition-colors"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Inquiry Form */}
          <form onSubmit={handleInquirySubmit} className="space-y-5 animate-fade-in-up">
            {inquiryError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
              >
                <p className="text-sm text-destructive">{inquiryError}</p>
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
              >
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={inquiryLoading}
                className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
                placeholder="First and last"
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
                required
                disabled={inquiryLoading}
                className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
                placeholder="you@email.com"
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
                disabled={inquiryLoading}
                className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
                placeholder="(512) 555-0000"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
              >
                Property Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                disabled={inquiryLoading}
                className="w-full border-b border-ink/15 bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
                placeholder="Austin, TX"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-xs tracking-widest uppercase text-ink/40"
              >
                Anything else? (optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                disabled={inquiryLoading}
                className="w-full resize-none border-b border-ink/15 bg-transparent py-3 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-gold placeholder:text-ink/25 disabled:opacity-50"
                placeholder="Tell us about your space, timeline, or any specific ideas..."
              />
            </div>
            <button
              type="submit"
              disabled={inquiryLoading}
              className="w-full rounded-lg bg-forest px-8 py-4 text-sm font-medium tracking-wide text-cream transition-all duration-300 hover:bg-moss disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {inquiryLoading ? "Sending..." : "Send Inquiry"}
            </button>
          </form>

          <p className="text-xs text-center text-ink/30">
            No commitment. We'll reach out to discuss your vision.
          </p>
        </div>
      );
    }

    // Investment estimator state
    if (showInvestment) {
      return (
        <div className="mx-auto max-w-xl px-6 py-24 md:py-32">
          <InvestmentEstimator
            archetypeName={result.name}
            quizAnswers={answers}
            onComplete={handleInvestmentComplete}
          />
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowInvestment(false)}
              className="text-sm text-ink/40 hover:text-gold transition-colors"
            >
              Back to Results
            </button>
          </div>
        </div>
      );
    }

    // Main results view
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 md:py-32 space-y-8">
        {/* Result Header */}
        <div className="text-center">
          <p className="mb-2 text-xs tracking-[0.3em] uppercase text-gold animate-fade-in">
            Your Direction
          </p>
          <h2 className="font-serif text-4xl text-ink md:text-5xl animate-fade-in-up">
            {result.name}
          </h2>
          <p className="mt-4 font-serif text-lg italic text-ink/50 animate-fade-in-up">
            {result.tagline}
          </p>
        </div>

        {/* Visual Representation */}
        <div className="animate-fade-in-up">
          <ArchetypeVisual
            archetypeName={result.name}
            imageUrl={result.image}
            description={result.description}
            onCTA={() => setShowInvestment(true)}
          />
        </div>

        {/* Alternative Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-border md:flex-row md:justify-center">
          <button
            onClick={handleReset}
            className="inline-flex rounded-lg border border-ink/20 bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Retake Quiz
          </button>
          <Link
            href="/materials"
            className="inline-flex rounded-lg bg-transparent px-8 py-3.5 text-sm font-medium tracking-wide text-ink border border-ink/20 transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Explore Materials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 md:py-32">
      {/* Progress */}
      <div className="mb-16">
        <div className="flex items-center justify-between text-xs text-ink/40">
          <span>
            {step + 1} of {questions.length}
          </span>
          {step > 0 && (
            <button
              onClick={handleBack}
              className="transition-colors hover:text-gold"
            >
              Back
            </button>
          )}
        </div>
        <div className="mt-3 h-px w-full bg-ink/10">
          <div
            className="h-full bg-gold/60 transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {current && (
        <div key={current.id} className="animate-fade-in-up">
          <h2 className="font-serif text-2xl text-ink md:text-3xl">
            <span className="text-balance">{current.question}</span>
          </h2>
          <div className="mt-10 flex flex-col gap-3">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`rounded-lg border px-6 py-4 text-left text-sm transition-all duration-300 ${
                  answers[current.id] === opt.value
                    ? "border-gold bg-gold/10 text-ink"
                    : "border-ink/10 bg-transparent text-ink/70 hover:border-gold/40 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
