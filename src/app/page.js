
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch feedback when the page loads
  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch("/api/feedback");

        if (!response.ok) {
          throw new Error("Unable to load feedback.");
        }

        const data = await response.json();
        setFeedbackList(data);

      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, []);

  // Submit feedback to the backend
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    // Client-side validation
    if (!cleanName || !cleanMessage || rating === 0) {
      setError("Please complete all fields and select a rating.");
      return;
    }

    if (cleanName.length > 50) {
      setError("Name must not exceed 50 characters.");
      return;
    }

    if (cleanMessage.length > 500) {
      setError("Message must not exceed 500 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          message: cleanMessage,
          rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      // Add the newly saved feedback to the list
      setFeedbackList((previous) => [data, ...previous]);

      // Clear the form
      setName("");
      setMessage("");
      setRating(0);

      setSuccess("Your feedback was submitted successfully!");

    } catch (err) {
      setError(err.message);

    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-8 md:px-12">

      {/* Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Feedback<span className="text-violet-400">Hub.</span>
        </h2>

        <span className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-400">
          μLearn Web Development
        </span>
      </nav>

      {/* Hero */}
      <section className="mx-auto mb-12 mt-20 max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
          Your feedback matters
        </p>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          Your voice.
          <br />
          Our improvement.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400">
          Have something to share? Tell us about your experience.
          Every suggestion helps us make things better.
        </p>
      </section>

      {/* Main content */}
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">

        {/* Feedback form */}
        <div className="h-fit rounded-2xl border border-zinc-800 bg-[#191c28] p-6 md:p-8">

          <h2 className="text-xl font-semibold">
            Leave your feedback
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            We'd love to hear what you think.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Your name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-zinc-700 bg-[#10121b] px-4 py-3 text-sm outline-none transition focus:border-violet-400"
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Your message
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                placeholder="Share your thoughts..."
                rows={5}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-[#10121b] px-4 py-3 text-sm outline-none transition focus:border-violet-400"
              />

              <p className="mt-1 text-right text-xs text-zinc-500">
                {message.length}/500
              </p>
            </div>

            {/* Rating */}
            <div>
              <label className="mb-3 block text-sm text-zinc-300">
                Rate your experience
              </label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      star <= rating
                        ? "text-yellow-400"
                        : "text-zinc-600 hover:text-yellow-400"
                    }`}
                    aria-label={`Rate ${star} out of 5`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Error and success messages */}
            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-green-400">
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-violet-500 py-3 font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>

          </form>
        </div>

        {/* Feedback list */}
        <div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Recent feedback
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                What people are saying
              </p>
            </div>

            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300">
              {feedbackList.length} entries
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-400">
              Loading feedback...
            </p>
          ) : feedbackList.length === 0 ? (
            <p className="rounded-xl border border-zinc-800 p-6 text-sm text-zinc-400">
              No feedback yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-4">

              {feedbackList.map((feedback) => (
                <div
                  key={feedback.id}
                  className="rounded-xl border border-zinc-800 bg-[#191c28] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">
                      {feedback.name}
                    </h3>

                    <span className="shrink-0 text-yellow-400">
                      {"★".repeat(feedback.rating)}
                      <span className="text-zinc-600">
                        {"★".repeat(5 - feedback.rating)}
                      </span>
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-400">
                    {feedback.message}
                  </p>

                  <p className="mt-3 text-xs text-zinc-600">
                    {new Date(
                      feedback.created_at.replace(" ", "T") + "Z"
                    ).toLocaleString()}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        Built with Next.js · μLearn Web Development
      </footer>

    </main>
  );
}
