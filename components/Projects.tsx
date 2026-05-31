import { projects } from "@/lib/data";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6 md:px-12 max-w-6xl mx-auto scroll-mt-24">
      <Reveal className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          What {"I've"} built
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Featured <span className="gradient-text">work</span>
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 3) * 110} className="h-full">
            <TiltCard
              tilt={6}
              className="glow-border group relative h-full overflow-hidden rounded-2xl border border-border bg-surface hover:shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
            >
              {/* Stretched, accessible link */}
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20"
                aria-label={`Open live demo of ${project.title}`}
              />

              <div
                className={`relative h-44 shrink-0 flex items-center justify-center overflow-hidden bg-linear-to-br ${project.gradient}`}
              >
                <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 animate-bob">
                  {project.emoji}
                </span>
                {/* Sheen sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </div>

              <div className="relative p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 text-muted transition-colors group-hover:text-[#F0EEF8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-display font-bold text-xl mb-2 transition-colors group-hover:text-accent1">
                  {project.title}
                </h3>

                <p className="text-muted text-sm leading-relaxed font-light mb-5">
                  {project.description}
                </p>

                <div className="mt-auto flex items-center gap-1 text-sm text-muted transition-colors group-hover:text-accent1">
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                  Live demo
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
