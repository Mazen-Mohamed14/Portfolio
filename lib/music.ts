/* An original harp-like piece, generated live with the Web Audio API.
   Each crystal colour has its own key, chord loop and tempo; the music moves to the new key at the next bar. */

const SONGS = [
  { bpm: 76, chords: [[50, 57, 64, 66, 69], [47, 54, 62, 64, 66], [43, 50, 57, 59, 62], [45, 52, 57, 61, 64]] }, // intro: D, Bm, G, A (airy)
  { bpm: 80, chords: [[41, 48, 57, 60, 64], [38, 45, 53, 57, 60], [46, 53, 57, 62, 65], [48, 55, 60, 62, 67]] }, // work: F, Dm, Bb, C (warm)
  { bpm: 82, chords: [[43, 50, 59, 62, 66], [40, 47, 55, 59, 62], [36, 43, 52, 55, 59], [38, 45, 54, 57, 62]] }, // lab: G, Em, C, D (playful)
  { bpm: 84, chords: [[40, 47, 56, 59, 63], [37, 44, 52, 56, 59], [45, 52, 56, 59, 64], [47, 54, 59, 61, 66]] }, // stack: E, C#m, A, B (bright)
  { bpm: 72, chords: [[46, 53, 58, 62, 65], [43, 50, 58, 62, 67], [39, 46, 55, 58, 62], [41, 48, 57, 60, 65]] }, // journey: Bb, Gm, Eb, F (deep)
  { bpm: 70, chords: [[45, 52, 59, 61, 64], [40, 47, 56, 59, 63], [42, 49, 57, 61, 64], [49, 56, 61, 64, 68]] }, // contact: A, E, F#m, C#m (gentle)
];
// the figure over each bar: indexes into the chord, 8 eighth notes, varied per bar so it never loops identically
const FIGURES = [[0, 2, 3, 4, 3, 2, 1, 3], [0, 1, 3, 2, 4, 3, 2, 4], [0, 3, 2, 4, 1, 3, 4, 2], [0, 2, 4, 3, 2, 1, 2, 3]];
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export type Music = { play: () => void; stop: () => void; setSection: (i: number) => void; playing: () => boolean; dispose: () => void };

export function createMusic(): Music {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(master);
  const dry = ctx.createGain(); dry.gain.value = 0.75; dry.connect(comp);
  const wet = ctx.createGain(); wet.gain.value = 0.5;
  const verb = ctx.createConvolver();
  // a 3.2 s hall built from decaying noise
  const len = ctx.sampleRate * 3.2, buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  verb.buffer = buf; wet.connect(verb); verb.connect(comp);

  let on = false, section = 0, pending = 0, bar = 0, step = 0, nextTime = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  // a plucked string: bright attack, a filter that closes as it rings, long natural decay
  function pluck(m: number, t: number, vel: number) {
    const f = hz(m), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.Q.value = 0.6;
    lp.frequency.setValueAtTime(Math.min(f * 9, 12000), t); lp.frequency.exponentialRampToValueAtTime(Math.max(f * 1.6, 300), t + 1.4);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6 + (60 - Math.min(m, 60)) * 0.02);
    const a = ctx.createOscillator(); a.type = "triangle"; a.frequency.value = f;
    const b = ctx.createOscillator(); b.type = "sine"; b.frequency.value = f * 2; b.detune.value = 4;
    const bg = ctx.createGain(); bg.gain.value = 0.22;
    a.connect(lp); b.connect(bg); bg.connect(lp); lp.connect(g); g.connect(dry); g.connect(wet);
    const end = t + 3.6; a.start(t); b.start(t); a.stop(end); b.stop(end);
  }
  // a soft bed under each chord
  function pad(chord: number[], t: number, dur: number) {
    [chord[0] - 12, chord[1] - 12].forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = i ? 6 : -6;
      lp.type = "lowpass"; lp.frequency.value = 420;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.022, t + dur * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + dur * 1.05);
      o.connect(lp); lp.connect(g); g.connect(wet); g.connect(dry); o.start(t); o.stop(t + dur * 1.1);
    });
  }
  function schedule() {
    while (nextTime < ctx.currentTime + 0.15) {
      if (step === 0 && pending !== section) { section = pending; bar = 0; }
      const song = SONGS[section], beat = 60 / song.bpm / 2, chord = song.chords[bar % song.chords.length];
      const fig = FIGURES[bar % FIGURES.length], note = chord[fig[step]] + (step >= 4 && step % 2 ? 12 : 0);
      const human = (Math.random() - 0.5) * 0.012;
      if (step === 0) { pad(chord, nextTime, beat * 8); pluck(chord[0] - 12, nextTime, 0.32); }
      pluck(note, nextTime + human, step === 0 ? 0.26 : 0.14 + Math.random() * 0.06);
      if (step === 6 && bar % 2 === 1) pluck(chord[4] + 12, nextTime + beat * 0.5, 0.07); // a high glint every other bar
      nextTime += beat; step++;
      if (step === 8) { step = 0; bar++; }
    }
  }
  function fade(to: number, secs: number) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(to, t + secs);
  }
  const onVisibility = () => { if (!on) return; if (document.hidden) void ctx.suspend(); else void ctx.resume(); };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    play() {
      on = true;
      void ctx.resume().then(() => {
        if (!on) return;
        if (!timer) { bar = 0; step = 0; nextTime = ctx.currentTime + 0.01; schedule(); timer = setInterval(schedule, 25); }
        fade(0.42, 0.25);
      });
    },
    stop() {
      on = false; fade(0, 0.6);
      setTimeout(() => { if (!on) { if (timer) clearInterval(timer); timer = null; void ctx.suspend(); } }, 700);
    },
    setSection(i: number) { pending = Math.max(0, Math.min(SONGS.length - 1, i)); },
    playing: () => timer !== null,
    dispose() { on = false; if (timer) clearInterval(timer); document.removeEventListener("visibilitychange", onVisibility); void ctx.close(); },
  };
}
