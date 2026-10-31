"use client";

import { useEffect, useRef } from "react";
import { LAB, PROJECTS } from "@/lib/content";

const PREVIEWS = [...PROJECTS, ...LAB].map((p) => p.preview);

/** A small browser window that follows the cursor over Work and Lab and plays a clip of the site in motion.
    Only on devices with a real mouse; rows mark themselves with data-preview="<id>". */
export default function PreviewWindow() {
  const winRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const win = winRef.current, label = labelRef.current;
    if (!win || !label || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const videos = new Map<string, HTMLVideoElement>();
    win.querySelectorAll("video").forEach((v) => videos.set(v.dataset.id!, v));

    // fetch the clips once the visitor gets near the lists, so the first hover is instant
    let warmed = false;
    const warm = () => {
      if (warmed) return;
      warmed = true;
      videos.forEach((v, id) => {
        v.poster = `/previews/${id}.jpg`;
        if (!reduce) { v.preload = "auto"; v.load(); } // with reduced motion the still frame is enough
      });
    };
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { warm(); io.disconnect(); } }, { rootMargin: "100% 0px" });
    document.querySelectorAll("#work, #lab").forEach((s) => io.observe(s));

    let active: string | null = null, shown = false;
    let mx = innerWidth / 2, my = innerHeight / 2, x = mx, y = my, tilt = 0, raf = 0;
    let edge = 0; // right edge of the hovered list, so the window sits beside the text instead of over it
    let mode: "mouse" | "key" | null = null, row: HTMLElement | null = null;

    const place = () => {
      const w = win.offsetWidth, h = win.offsetHeight, gap = 28;
      // sit in the open space right of the list, drifting a little with the cursor; flip left if there's no room
      let tx = Math.max(mx + gap, edge + 40 + (mx - edge) * 0.08);
      if (tx + w > innerWidth - 16) tx = mx - gap - w;
      tx = Math.max(16, Math.min(innerWidth - w - 16, tx));
      const ty = Math.max(16, Math.min(innerHeight - h - 16, my - h / 2));
      return [tx, ty];
    };
    const frame = () => {
      const [tx, ty] = place();
      const k = reduce ? 1 : 0.16;
      const dx = tx - x, dy = ty - y;
      x += dx * k; y += dy * k;
      tilt += ((reduce ? 0 : Math.max(-6, Math.min(6, dx * 0.04))) - tilt) * 0.12;
      win.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      // stop once settled; the next move, scroll or resize starts it again
      raf = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 || Math.abs(tilt) > 0.05 ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    // anchor beside a row rather than the cursor (keyboard focus, and reduced motion)
    const anchor = (r: HTMLElement) => {
      const b = r.getBoundingClientRect();
      edge = r.closest("ul")!.getBoundingClientRect().right;
      mx = edge; my = b.top + b.height / 2;
    };

    const show = (r: HTMLElement) => {
      const id = r.dataset.preview!;
      row = r;
      if (id === active && shown) return kick();
      warm();
      if (!shown) { [x, y] = place(); tilt = 0; } // appear in place, don't fly in from the last spot
      videos.forEach((v, key) => {
        const on = key === id;
        v.classList.toggle("on", on);
        if (on && !reduce) { if (key !== active) v.currentTime = 0; void v.play().catch(() => {}); }
        else if (!on) v.pause();
      });
      label.textContent = PREVIEWS.find((p) => p.id === id)?.label ?? "";
      active = id; shown = true;
      win.classList.add("show");
      kick();
    };
    const hide = () => {
      row = null; mode = null;
      if (!shown) return;
      shown = false;
      win.classList.remove("show");
      const id = active;
      // pause once it has faded, unless another row took over meanwhile
      setTimeout(() => { if (!shown && id) videos.get(id)?.pause(); }, 300);
    };

    // the mouse is over (cx, cy): show that row's clip, or hide
    const track = (cx: number, cy: number, target: Element | null) => {
      const r = target?.closest<HTMLElement>("[data-preview]") ?? null;
      if (!r) return hide();
      mode = "mouse";
      if (reduce) anchor(r);
      else { mx = cx; my = cy; edge = r.closest("ul")!.getBoundingClientRect().right; }
      show(r);
    };
    let px = -1, py = -1; // last mouse position, -1 while the mouse is outside the page
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX; py = e.clientY;
      if (mode === "key" && !(e.target as Element | null)?.closest("[data-preview]")) return; // leave a keyboard preview alone
      track(px, py, e.target as Element | null);
    };
    const onLeave = () => { px = py = -1; if (mode === "mouse") hide(); };
    // keyboard users get the window beside the focused row
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Element | null, r = t?.closest<HTMLElement>("[data-preview]");
      if (!t || !r || !t.matches(":focus-visible")) return;
      mode = "key";
      anchor(r);
      show(r);
    };
    const onBlur = (e: FocusEvent) => { if (mode === "key" && (e.target as Element | null)?.closest("[data-preview]")) hide(); };
    // scrolling moves rows under a still mouse, or moves the focused row
    const onScroll = () => {
      if (mode === "key" && row) { anchor(row); kick(); }
      else if (px >= 0) track(px, py, document.elementFromPoint(px, py));
    };
    const onResize = () => { if (shown) { if (row && (mode === "key" || reduce)) anchor(row); kick(); } };

    addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    addEventListener("focusin", onFocus);
    addEventListener("focusout", onBlur);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      removeEventListener("focusin", onFocus);
      removeEventListener("focusout", onBlur);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      videos.forEach((v) => v.pause());
    };
  }, []);

  return (
    <div ref={winRef} className="preview" aria-hidden="true">
      <div className="preview-bar"><i /><i /><i /><span ref={labelRef} /></div>
      <div className="preview-screen">
        {PREVIEWS.map((p) => (
          <video key={p.id} data-id={p.id} muted loop playsInline preload="none">
            <source src={`/previews/${p.id}.webm`} type="video/webm" />
            <source src={`/previews/${p.id}.mp4`} type="video/mp4" />
          </video>
        ))}
      </div>
    </div>
  );
}
