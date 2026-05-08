import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="flex items-center gap-2 text-accent1 text-xs font-medium tracking-[0.15em] uppercase mb-3 before:content-['//'] before:font-mono">
          What {"I've"} built
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight tracking-tight">
          Featured <span className="gradient-text">work</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent1/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] group flex flex-col"
          >
            <div
              className={`h-44 shrink-0 flex items-center justify-center text-6xl bg-linear-to-br ${project.gradient}`}
            >
              {project.emoji}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.65rem] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-display font-bold text-xl mb-2">{project.title}</h3>

              <p className="text-muted text-sm leading-relaxed font-light mb-5">
                {project.description}
              </p>

              <div className="flex gap-4 mt-auto">
                <div className="text-sm text-muted group-hover:text-accent1 transition-colors flex items-center gap-1">
                  ↗ Live demo
                </div>
                {project.github && (
                  <div className="text-sm text-muted hover:text-accent1 transition-colors flex items-center gap-1">
                    ⌥ GitHub
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
