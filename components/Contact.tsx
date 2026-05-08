"use client";

import { useState } from "react";

const socials = [
  {
    icon: "✉",
    label: "mazen.mohamed.saeed14@gmail.com",
    href: "mailto:mazen.mohamed.saeed14@gmail.com",
  },
  { icon: "⌥", label: "github.com/Mazen-Mohamed14", href: "https://github.com/Mazen-Mohamed14" },
  {
    icon: "in",
    label: "linkedin.com/in/mazenmohamed1",
    href: "https://www.linkedin.com/in/mazenmohamed1/",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    console.log(form);
  };

  const time = new Date();

  return (
    <section id="contact" className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          {"Let's"} talk
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Get in <span className="gradient-text">touch</span>
        </h2>
      </div>

      <div className="relative bg-surface border border-border rounded-2xl p-8 md:p-14 overflow-hidden">
        {/* <div className="absolute top-[-50%] right-[-20%] w-125 h-125 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(255,77,109,0.08)_0%,transparent_70%)]" /> */}

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
                  className="flex items-center break-all gap-3 px-5 py-4 rounded-xl border border-border bg-surface2 text-[#F0EEF8] text-sm transition-all duration-200 hover:border-accent1/30 hover:text-accent1 hover:translate-x-1"
                >
                  <span className="w-5 text-center font-bold">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="flex flex-col gap-4">
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
                  className="w-full bg-surface2 border border-border rounded-lg px-4 py-3 text-[#F0EEF8] placeholder-muted outline-none focus:border-accent1/50 transition-colors text-sm"
                />
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
                className="w-full bg-surface2 border border-border rounded-lg px-4 py-3 text-[#F0EEF8] placeholder-muted outline-none focus:border-accent1/50 transition-colors text-sm resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-lg font-display font-semibold text-sm text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,109,0.35)]"
              style={{ background: "linear-gradient(135deg,#FF4D6D,#FF9F1C)" }}
            >
              Send message →
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center mt-20 pt-8 border-t border-border text-muted text-sm">
        Designed &amp; built by{" "}
        <strong className="text-[#F0EEF8] font-medium">Mazen Mohamed</strong> · {time.getFullYear()}
      </footer>
    </section>
  );
}
