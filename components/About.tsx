import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import TiltCard from "@/components/TiltCard";

const stats = [
  { number: "3+", label: "Years of experience" },
  { number: "20+", label: "Projects shipped" },
  { number: "15+", label: "Happy clients" },
  { number: "∞", label: "Cups of coffee" },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-6 md:px-12 max-w-6xl mx-auto scroll-mt-24">
      <Reveal className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          Who I am
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Building things <br />
          <span className="gradient-text">for the web</span>
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <Reveal className="space-y-5 text-muted leading-relaxed font-light text-lg" delay={80}>
          <p>
            Hey! {"I'm"} Mazen, a{" "}
            <strong className="text-[#F0EEF8] font-medium">fullstack developer</strong> based in
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
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="h-full">
              <TiltCard className="relative overflow-hidden bg-surface border border-border rounded-xl p-6 hover:border-accent1/40 h-full">
                <div className="font-display font-extrabold text-4xl gradient-text leading-none">
                  <Counter value={s.number} />
                </div>
                <div className="text-muted text-sm mt-1 relative">{s.label}</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
