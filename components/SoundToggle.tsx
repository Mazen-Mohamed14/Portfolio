"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Music } from "@/lib/music";

// the visitor's sound preference: on unless they turned it off before
const KEY = "sound";
const readPref = () => { try { return localStorage.getItem(KEY) !== "off"; } catch { return true; } };
const subscribePref = (cb: () => void) => { addEventListener("sound-pref", cb); addEventListener("storage", cb); return () => { removeEventListener("sound-pref", cb); removeEventListener("storage", cb); }; };
const writePref = (on: boolean) => { try { localStorage.setItem(KEY, on ? "on" : "off"); } catch {} dispatchEvent(new Event("sound-pref")); };

// browsers allow audio only after a click, a finished tap or a key press
const GESTURES = ["pointerdown", "click", "touchend", "keydown"] as const;

/** Music is on by default and starts on the visitor's first interaction; the button turns it off and on. */
export default function SoundToggle() {
  const wantsSound = useSyncExternalStore(subscribePref, readPref, () => true);
  const [hint, setHint] = useState(false);
  const musicRef = useRef<Music | null>(null);
  const interactedRef = useRef(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let disposed = false;
    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    const onSection = (e: Event) => musicRef.current?.setSection((e as CustomEvent<number>).detail);
    const kick = (e: Event) => {
      if (btnRef.current?.contains(e.target as Node)) return; // the button handles its own click
      GESTURES.forEach((n) => removeEventListener(n, kick, true));
      interactedRef.current = true;
      setHint(false);
      if (readPref()) musicRef.current?.play();
    };

    // build the audio engine now so the first note plays the moment the visitor interacts
    import("@/lib/music").then(({ createMusic }) => {
      if (disposed) return;
      musicRef.current = createMusic();
      addEventListener("crystal:section", onSection);
      if (readPref()) {
        GESTURES.forEach((n) => addEventListener(n, kick, true));
        hintTimer = setTimeout(() => { if (!musicRef.current?.playing() && readPref()) setHint(true); }, 1200);
      }
    });

    return () => {
      disposed = true;
      clearTimeout(hintTimer);
      GESTURES.forEach((n) => removeEventListener(n, kick, true));
      removeEventListener("crystal:section", onSection);
      musicRef.current?.dispose();
      musicRef.current = null;
    };
  }, []);

  // follow preference changes (this tab or another); starting needs a prior interaction, which browsers require
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    if (!wantsSound) music.stop();
    else if (interactedRef.current) music.play();
  }, [wantsSound]);

  const toggle = () => {
    interactedRef.current = true;
    const next = !wantsSound;
    writePref(next);
    setHint(false);
    if (next) musicRef.current?.play(); else musicRef.current?.stop();
  };

  return (
    <>
      <p className={`soundhint${hint ? " show" : ""}`} aria-hidden="true">
        <span className="fine">Click anywhere for sound</span>
        <span className="coarse">Tap anywhere for sound</span>
      </p>
      <button ref={btnRef} className="sound" type="button" aria-pressed={wantsSound} aria-label="Toggle music" onClick={toggle}>
        <i aria-hidden="true"><b /><b /><b /><b /></i>
        <span>{wantsSound ? "Sound on" : "Sound off"}</span>
      </button>
    </>
  );
}
