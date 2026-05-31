"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const CONTACT_EMAIL = "mazen.mohamed.saeed14@gmail.com";

const socials = [
  { icon: "✉", label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: "⌥", label: "github.com/Mazen-Mohamed14", href: "https://github.com/Mazen-Mohamed14" },
  {
    icon: "in",
    label: "linkedin.com/in/mazenmohamed1",
    href: "https://www.linkedin.com/in/mazenmohamed1/",
  },
];

type Field = "name" | "email" | "message";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.message.trim().length < 10) next.message = "Tell me a little more (10+ chars)";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  const time = new Date();

  return (
    <section id="contact" className="py-28 px-6 md:px-12 max-w-6xl mx-auto scroll-mt-24">
      <Reveal className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          {"Let's"} talk
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Get in <span className="gradient-text">touch</span>
        </h2>
      </Reveal>

      <Reveal>
        <div className="glow-border relative bg-surface border border-border rounded-2xl p-8 md:p-14 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-start relative">
            {/* Left */}
            <div>
              <p className="text-muted text-lg leading-relaxed font-light mb-8">
                Have a project in mind, a role to fill, or just want to say hello? My inbox is always
                open. {"I'll"} get back to you within 24 hours.
              </p>
              <div className="flex flex-col gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center break-all gap-3 px-5 py-4 rounded-xl border border-border bg-surface2 text-[#F0EEF8] text-sm transition-all duration-200 hover:border-accent1/40 hover:text-accent1 hover:translate-x-1"
                  >
                    <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-center font-bold transition-colors group-hover:bg-accent1/15">
                      {s.icon}
                    </span>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {(["name", "email"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-[0.75rem] font-medium tracking-widest uppercase text-muted mb-1.5">
                    {field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field === "email" ? "you@example.com" : "Your name"}
                    aria-invalid={!!errors[field]}
                    className={`w-full bg-surface2 border rounded-lg px-4 py-3 text-[#F0EEF8] placeholder-muted outline-none transition-colors text-sm ${
                      errors[field]
                        ? "border-accent1/70 focus:border-accent1"
                        : "border-border focus:border-accent1/50"
                    }`}
                  />
                  {errors[field] && (
                    <p className="mt-1.5 text-xs text-accent1">{errors[field]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="block text-[0.75rem] font-medium tracking-widest uppercase text-muted mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={5}
                  aria-invalid={!!errors.message}
                  className={`w-full bg-surface2 border rounded-lg px-4 py-3 text-[#F0EEF8] placeholder-muted outline-none transition-colors text-sm resize-none ${
                    errors.message
                      ? "border-accent1/70 focus:border-accent1"
                      : "border-border focus:border-accent1/50"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-accent1">{errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={sent}
                className="group relative w-full overflow-hidden py-3.5 rounded-lg font-display font-semibold text-sm text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,77,109,0.4)] disabled:translate-y-0"
                style={{ background: "linear-gradient(135deg,#FF4D6D,#FF9F1C)" }}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">
                  {sent ? "✓ Thanks — opening your mail app…" : "Send message →"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </Reveal>

      <footer className="text-center mt-20 pt-8 border-t border-border text-muted text-sm">
        Designed &amp; built by{" "}
        <strong className="text-[#F0EEF8] font-medium">Mazen Mohamed</strong> · {time.getFullYear()}
      </footer>
    </section>
  );
}
