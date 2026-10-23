# Mazen Mohamed — Portfolio

Personal portfolio of Mazen Mohamed, full stack developer in Cairo. Live at [mazen-mohamed.vercel.app](https://mazen-mohamed.vercel.app).

A dark nebula scene with a glowing, faceted crystal that changes colour as you scroll through the sections, with an original harp-like score generated in the browser.

## Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **Three.js** for the crystal: custom GLSL shaders (procedural studio reflections, dispersion, opal sheen), a fractal nebula, sparkles and bloom
- **Web Audio API** for the music: plucked-string synthesis, a convolution hall and a chord loop per section, no audio files
- `next/font` for Anton and Inter

## How it works

| Path | What it does |
|---|---|
| `app/page.tsx` | The page content, rendered on the server |
| `lib/content.ts` | Projects, stack, jobs and links |
| `lib/crystal-scene.ts` | The 3D scene, loaded after the text renders |
| `lib/music.ts` | The music engine |
| `components/` | Client pieces: the canvas, nav, section dots and sound toggle |
| `design/` | Earlier prototypes and references, not part of the app |

Performance and accessibility:

- Phones and low-end devices get a lighter scene (half-resolution bloom, fewer nebula layers), and quality steps down automatically if the frame rate drops.
- The animation pauses when the tab is hidden.
- With reduced motion turned on, the crystal is drawn as a still frame that only updates on scroll.
- Without WebGL, a still image of the crystal is shown instead.
- Music is on by default but, as browsers require, starts only after the visitor's first click, tap or key press; the choice to turn it off is remembered.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## CI/CD

- GitHub Actions runs lint and a production build on every push and pull request to `main`.
- Vercel deploys every pull request as a preview and every merge to `main` to production.
