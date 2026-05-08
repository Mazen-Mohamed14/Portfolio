const stats = [
  { number: "3+", label: "Years of experience" },
  { number: "20+", label: "Projects shipped" },
  { number: "5+", label: "Happy clients" },
  { number: "∞", label: "Cups of coffee" },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          Who I am
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Building things <br />
          <span className="gradient-text">for the web</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-5 text-muted leading-relaxed font-light text-lg">
          <p>
            Hey! {"I'm"} Mazen, a{" "}
            <strong className="text-[#F0EEF8] font-medium">frontend developer</strong> based in
            Cairo, Egypt. I love turning complex problems into clean, intuitive interfaces that
            people actually enjoy using.
          </p>
          <p>
            My stack of choice is{" "}
            <strong className="text-[#F0EEF8] font-medium">
              React + TypeScript + Tailwind CSS
            </strong>{" "}
            — a combination that lets me move fast without sacrificing code quality. Lately {"I've"}
            been diving deep into <strong className="text-[#F0EEF8] font-medium">
              Next.js
            </strong>{" "}
            and loving the power of the App Router.
          </p>
          <p>
            When {"I'm"} not coding, {"I'm"} usually exploring new design trends, contributing to
            open source, or obsessing over web performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-surface border border-border rounded-xl p-6 transition-all duration-300 hover:border-accent1/30 hover:-translate-y-1"
            >
              <div className="font-display font-extrabold text-4xl gradient-text leading-none">
                {s.number}
              </div>
              <div className="text-muted text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
