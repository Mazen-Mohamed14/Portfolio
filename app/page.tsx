import CrystalCanvas from "@/components/CrystalCanvas";
import Nav from "@/components/Nav";
import SectionDots from "@/components/SectionDots";
import SoundToggle from "@/components/SoundToggle";
import { CV_URL, EMAIL, GITHUB, JOBS, LINKEDIN, PROJECTS, STACK } from "@/lib/content";

export default function Home() {
  return (
    <>
      <CrystalCanvas />
      <Nav />
      <SectionDots />
      <SoundToggle />

      <main>
        <section id="top">
          <div className="card">
            <h1>Full stack<br /><span className="glow">developer</span></h1>
            <p>Mazen Mohamed. I build web products from database to deploy. Based in Cairo.</p>
            <div className="btns">
              <a className="btn solid" href="#contact">Get in touch</a>
              <a className="btn" href={CV_URL} target="_blank" rel="noopener">Resume</a>
            </div>
          </div>
        </section>

        <section id="work">
          <div className="card">
            <h2>Selected <span className="glow">work</span></h2>
            <ul className="list work">
              {PROJECTS.map((p) => (
                <li key={p.name}>
                  <a href={p.url} target="_blank" rel="noopener">
                    <span className="pn">{p.name}<span className="ar" aria-hidden="true">↗</span></span>
                    {p.result && <em>{p.result}</em>}
                  </a>
                  <p className="pd">{p.what}</p>
                  <p className="ps">{p.stack}</p>
                </li>
              ))}
            </ul>
            <p className="note">The prominent ones; more on request.</p>
          </div>
        </section>

        <section id="stack">
          <div className="card">
            <h2>The <span className="glow">stack</span></h2>
            <div className="chips">{STACK.map((s) => <span key={s}>{s}</span>)}</div>
            <p className="workflow">Workflow: Claude Code and Codex for pairing, reviews and refactors.</p>
          </div>
        </section>

        <section id="experience">
          <div className="card">
            <h2>The <span className="glow">journey</span></h2>
            <ul className="list">
              {JOBS.map((j) => <li key={j.company}><span>{j.company}</span><span>{j.detail}</span></li>)}
            </ul>
            <p>Over four years shipping production SaaS and e-commerce, and now mentoring a junior developer through code review and pairing.</p>
          </div>
        </section>

        <section id="contact">
          <div className="card">
            <h2>Let&apos;s <span className="glow">talk</span></h2>
            <p>Open to full stack and frontend roles. From Cairo, working anywhere.</p>
            <div className="btns">
              <a className="btn solid" href={`mailto:${EMAIL}`}>Email me</a>
              <a className="btn" href={LINKEDIN} target="_blank" rel="noopener">LinkedIn</a>
              <a className="btn" href={GITHUB} target="_blank" rel="noopener">GitHub</a>
              <a className="btn" href={CV_URL} target="_blank" rel="noopener">Resume</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
