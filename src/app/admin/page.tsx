"use client";

import { useState, useEffect, FormEvent } from "react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const [preview, setPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) setAuthenticated(true);
  }, []);

  useEffect(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated);
  }, [title]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("admin_token", data.token);
        setAuthenticated(true);
      } else {
        setAuthError("Invalid password");
      }
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handlePublish(e: FormEvent) {
    e.preventDefault();
    if (!title || !slug || !content) return;

    setPublishing(true);
    setMessage(null);

    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          excerpt,
          image,
          content,
          token,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Post published! It will be live in about 30 seconds after Vercel redeploys.",
        });
        setTitle("");
        setSlug("");
        setCategory("");
        setExcerpt("");
        setImage("");
        setContent("");
        setPreview(false);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to publish post",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setPublishing(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setAuthenticated(false);
    setPassword("");
  }

  /* ─── Login Screen ─── */
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-bg-card rounded-2xl border border-border p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">
                Blog Admin
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-secondary mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>

              {authError && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {authLoading ? "Verifying..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  /* ─── Admin Dashboard ─── */
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border bg-bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <svg
                className="w-4.5 h-4.5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text-primary">Blog Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-6">
          <div className="bg-bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Compose New Post
            </h2>

            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My New Blog Post"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-new-blog-post"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-mono text-sm"
                />
              </div>
            </div>

            {/* Category & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Business Growth"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Image URL{" "}
                  <span className="text-text-secondary/60 font-normal">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/blog/my-image.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of the post..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all resize-y"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Content <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary/60">
                    Supports HTML: &lt;p&gt; &lt;h2&gt; &lt;h3&gt; &lt;ul&gt;
                    &lt;ol&gt; &lt;li&gt; &lt;strong&gt; &lt;em&gt; &lt;a&gt;
                    &lt;blockquote&gt;
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                      preview
                        ? "bg-accent text-white"
                        : "bg-bg-secondary text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {preview ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>

              {preview ? (
                <div
                  className="w-full min-h-[280px] px-4 py-3 rounded-lg border border-border bg-white prose prose-sm max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Write your blog post content here...</p>"
                  required
                  rows={14}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all resize-y font-mono text-sm leading-relaxed"
                />
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={publishing || !title || !slug || !content}
              className="px-8 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {publishing ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
