import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export type CrystalOptions = {
  canvas: HTMLCanvasElement;
  nav: HTMLElement | null;
  sectionCount: number;
  onSection: (index: number) => void;
  onReady: () => void;
};

// per section: crystal colour, nebula colour, how much opal rainbow, brightness lift
const SECTIONS = [
  { c: "#9fbfff", n: "#6b2cff", iri: 0.9, g: 1.0 }, // intro: opal white on violet nebula
  { c: "#ffb43d", n: "#8a2a08", iri: 0.35, g: 1.0 }, // work: amber
  { c: "#ff6f91", n: "#7a0f45", iri: 0.45, g: 1.1 }, // lab: rose
  { c: "#2fe3a0", n: "#06506a", iri: 0.35, g: 1.05 }, // stack: emerald
  { c: "#2f86ff", n: "#0b2a9e", iri: 0.35, g: 1.5 }, // experience: deep blue (darker hue, lifted to match)
  { c: "#b77bff", n: "#c2338f", iri: 0.6, g: 1.4 }, // contact: amethyst (darker hue, lifted to match)
].map((s) => ({ c: new THREE.Color(s.c), n: new THREE.Color(s.n), iri: s.iri, g: s.g }));

const gemVert = /* glsl */ `
  attribute float face; varying vec3 vWN, vWP, vO; varying float vF;
  void main(){ vO = position; vF = face;
    vec4 wp = modelMatrix * vec4(position, 1.0); vWP = wp.xyz;
    vWN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp; }`;

// a procedural studio: soft boxes and a ring light fixed in the world, so facets catch light as the gem turns
const gemCommon = /* glsl */ `
  uniform float uT, uIri, uGain; uniform vec3 uC; varying vec3 vWN, vWP, vO; varying float vF;
  vec3 hue(float h){ return clamp(abs(mod(h*6.+vec3(0,4,2),6.)-3.)-1., 0., 1.); }
  float box(vec3 d, vec3 L, float k){ return pow(max(dot(d, normalize(L)), 0.), k); }
  vec3 studio(vec3 d){
    float e = box(d, vec3(.55,.75,.6), 18.) * 1.3 + box(d, vec3(-.75,.35,.45), 12.) * .8
            + box(d, vec3(.15,-.55,.8), 10.) * .6 + box(d, vec3(-.2,.9,-.4), 14.) * .6;
    e += smoothstep(.25, 0., abs(d.y - .28)) * .25;
    return mix(uC, vec3(1.), .45) * e + mix(uC * .12, uC * .45, d.y * .5 + .5);
  }
  vec3 inside(vec3 d, float core){
    float beam = pow(max(dot(d, normalize(vec3(.2,.6,.5))), 0.), 6.);
    return uC * (.42 + 1.05 * core) + mix(uC, vec3(1.), .5) * beam * .9 + studio(d) * .18;
  }`;

const gemFrag = /* glsl */ `${gemCommon}
  void main(){
    vec3 V = normalize(cameraPosition - vWP);
    vec3 N = normalize(vWN) * (gl_FrontFacing ? 1. : -1.);
    float cosT = clamp(dot(N, V), 0., 1.);
    float F = .06 + .94 * pow(1. - cosT, 5.);
    float core = exp(-length((vO - vec3(0., -.2, 0.)) * vec3(1.1, .5, 1.1)) * 1.15);
    vec3 rr = refract(-V, N, 1./2.36), rg = refract(-V, N, 1./2.42), rb = refract(-V, N, 1./2.5);
    vec3 body = vec3(inside(rr, core).r, inside(rg, core).g, inside(rb, core).b);
    vec3 refl = studio(reflect(-V, N));
    vec3 col = body * (1. - F) + refl * (F + .12);
    vec3 opal = hue(fract(dot(N, vec3(.35,.6,.25)) * 1.3 + vO.y * .1 + uT * .02));
    col += opal * pow(1. - cosT, 2.) * (.15 + .7 * uIri);
    col = mix(col, col * mix(vec3(1.), opal, .5), uIri * .35);
    col += mix(uC, vec3(1.), .6) * (.08 + .08 * sin(vO.y * 2.5 - uT * 1.4));
    gl_FragColor = vec4(col * uGain, clamp(.72 + .28 * F + .2 * core, 0., 1.));
  }`;

const gemBackFrag = /* glsl */ `${gemCommon}
  void main(){
    vec3 V = normalize(cameraPosition - vWP);
    float core = exp(-length((vO - vec3(0., -.35, 0.)) * vec3(1.25, .7, 1.25)) * 1.6);
    vec3 col = uC * (.2 + 1.6 * core) + studio(reflect(-V, -normalize(vWN))) * .25;
    gl_FragColor = vec4(col * .6 * uGain, 1.);
  }`;

// a long two-pointed gem with ten slightly irregular facets per ring
function gemGeometry() {
  const N = 10, Ht = 2.7, Hb = 1.7, R = 0.95;
  const rings = [
    { y: -Hb * 0.45, r: R * 0.62, tw: 0.5 },
    { y: 0, r: R, tw: 0 },
    { y: Ht * 0.3, r: R * 0.78, tw: 0.5 },
    { y: Ht * 0.62, r: R * 0.42, tw: 0 },
  ];
  const ring = (k: number) =>
    Array.from({ length: N }, (_, i) => {
      const a = ((i + rings[k].tw) / N) * Math.PI * 2, j = 1 + Math.sin(i * 12.9 + k * 3.1) * 0.06;
      return new THREE.Vector3(Math.cos(a) * rings[k].r * j, rings[k].y, Math.sin(a) * rings[k].r * j);
    });
  const R0 = rings.map((_, k) => ring(k)), top = new THREE.Vector3(0, Ht, 0), bot = new THREE.Vector3(0, -Hb, 0);
  const tris: THREE.Vector3[][] = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    tris.push([bot, R0[0][j], R0[0][i]]);
    for (let k = 0; k < rings.length - 1; k++) {
      const A = R0[k], B = R0[k + 1];
      if (rings[k + 1].tw > rings[k].tw) tris.push([A[i], A[j], B[i]], [A[j], B[j], B[i]]);
      else tris.push([A[i], B[j], B[i]], [A[i], A[j], B[j]]);
    }
    tris.push([R0[rings.length - 1][i], R0[rings.length - 1][j], top]);
  }
  const pos: number[] = [], face: number[] = [];
  for (let t of tris) {
    const r = Math.random();
    const n = new THREE.Vector3().subVectors(t[1], t[0]).cross(new THREE.Vector3().subVectors(t[2], t[0]));
    const m = new THREE.Vector3().add(t[0]).add(t[1]).add(t[2]).divideScalar(3);
    if (n.dot(m) < 0) t = [t[0], t[2], t[1]]; // keep every face pointing outward
    for (const v of t) { pos.push(v.x, v.y, v.z); face.push(r); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("face", new THREE.Float32BufferAttribute(face, 1));
  g.computeVertexNormals();
  return g;
}

function radialTexture(stops: [number, number][], size = 256) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, a]) => g.addColorStop(o, `rgba(255,255,255,${a})`));
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function flareTexture(size = 256) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const x = c.getContext("2d")!, m = size / 2;
  const g = x.createRadialGradient(m, m, 0, m, m, m * 0.5);
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, size, size);
  x.globalCompositeOperation = "lighter";
  for (const [w, h] of [[size, 6], [6, size * 0.8]]) {
    const l = x.createRadialGradient(m, m, 0, m, m, Math.max(w, h) / 2);
    l.addColorStop(0, "rgba(255,255,255,.9)"); l.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = l; x.fillRect(m - w / 2, m - h / 2, w, h);
  }
  return new THREE.CanvasTexture(c);
}

/** Starts the crystal scene on the given canvas. Throws if WebGL is unavailable. Returns a cleanup function. */
export function startCrystalScene({ canvas, nav, sectionCount, onSection, onReady }: CrystalOptions): () => void {
  const mobile = matchMedia("(max-width: 720px)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  // phones and weaker machines get a lighter scene: half-resolution bloom, a lower pixel cap, fewer nebula layers and sparkles
  const lowEnd = mobile || (navigator.hardwareConcurrency || 8) <= 4 || mem <= 4;
  const octaves = lowEnd ? 3 : 5;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  let maxPR = mobile ? 1.5 : lowEnd ? 1.25 : 2;
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxPR));
  renderer.setClearColor(0x020309, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
  camera.position.set(0, 0, 12);

  const U = {
    uT: { value: 0 }, uC: { value: new THREE.Color() }, uN: { value: new THREE.Color() },
    uIri: { value: 1 }, uGain: { value: 1 },
  };

  // nebula and stars on one full-screen plane behind everything
  const nebula = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    depthWrite: false, depthTest: false, uniforms: U,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uT; uniform vec3 uC, uN; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < ${octaves}; i++){ v += a*n(p); p = p*2.03 + 7.1; a *= .5; } return v; }
      void main(){
        vec2 p = vUv * vec2(1.8, 1.0);
        float t = uT * 0.015;
        float clouds = fbm(p*2.2 + vec2(t, -t*.6) + fbm(p*3. - t)*1.4);
        float band = exp(-pow((vUv.x - 0.62) * 2.6, 2.)) * 0.7 + 0.3;
        vec3 col = uN * pow(clouds, 3.2) * .9 * band + uC * pow(clouds, 7.) * .25 * band;
        vec2 g = vUv * vec2(260., 150.); vec2 id = floor(g);
        float s = step(.985, h(id)) * smoothstep(.5, 0., length(fract(g) - .5)) * (.5 + .5*sin(uT*2. + h(id+3.)*40.));
        col += vec3(s) * .9;
        gl_FragColor = vec4(col, 1.);
      }`,
  }));
  nebula.frustumCulled = false;
  nebula.renderOrder = -10;
  scene.add(nebula);

  const group = new THREE.Group();
  scene.add(group);

  const gem = gemGeometry();
  const gemBack = new THREE.Mesh(gem, new THREE.ShaderMaterial({ uniforms: U, vertexShader: gemVert, fragmentShader: gemBackFrag, transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  const gemFront = new THREE.Mesh(gem, new THREE.ShaderMaterial({ uniforms: U, vertexShader: gemVert, fragmentShader: gemFrag, transparent: true, side: THREE.FrontSide, depthWrite: false }));
  const gemEdges = new THREE.LineSegments(new THREE.EdgesGeometry(gem, 1), new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `varying float vY; void main(){ vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `uniform vec3 uC; varying float vY; void main(){ gl_FragColor = vec4(mix(uC, vec3(1.), .6) * (.3 + .2*sin(vY*3.)), .5); }`,
  }));
  const crystal = new THREE.Group();
  crystal.add(gemBack, gemFront, gemEdges);
  group.add(crystal);

  // halo, inner light with a star flare, and a glint at the tip
  const sprite = (tex: THREE.Texture, s: number, op: number) => {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: op }));
    m.scale.set(s, s, 1);
    return m;
  };
  const halo = sprite(radialTexture([[0, 0.5], [0.3, 0.12], [1, 0]]), 6.5, 0.16); halo.position.z = -1.5; group.add(halo);
  const coreGlow = sprite(flareTexture(), 1.2, 0.45); coreGlow.position.set(0, -0.35, 0.3); group.add(coreGlow);
  const tipGlow = sprite(radialTexture([[0, 1], [0.2, 0.4], [1, 0]]), 0.5, 0.7); tipGlow.position.set(0, 2.7, 0.1); group.add(tipGlow);

  // sparkles around the crystal
  const SP = lowEnd ? 200 : 600, spPos = new Float32Array(SP * 3), spSeed = new Float32Array(SP);
  for (let i = 0; i < SP; i++) {
    const a = Math.random() * 6.283, r = 0.6 + Math.pow(Math.random(), 0.6) * 4;
    spPos[i * 3] = Math.cos(a) * r; spPos[i * 3 + 1] = (Math.random() - 0.5) * 7; spPos[i * 3 + 2] = Math.sin(a) * r * 0.6; spSeed[i] = Math.random();
  }
  const spGeo = new THREE.BufferGeometry();
  spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
  spGeo.setAttribute("seed", new THREE.BufferAttribute(spSeed, 1));
  const sparkles = new THREE.Points(spGeo, new THREE.ShaderMaterial({
    uniforms: { ...U, uPR: { value: renderer.getPixelRatio() } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `attribute float seed; uniform float uT, uPR; varying float vA;
      void main(){ vec3 p = position; p.y += sin(uT*.4 + seed*30.)*.25; p.xz *= 1. + .03*sin(uT + seed*9.);
        vec4 mv = modelViewMatrix * vec4(p,1.); gl_Position = projectionMatrix * mv;
        float tw = pow(.5 + .5*sin(uT*(1.5 + seed*3.) + seed*60.), 6.);
        gl_PointSize = (1. + 3.5*tw) * uPR * (10. / -mv.z); vA = .15 + .85*tw; }`,
    fragmentShader: /* glsl */ `uniform vec3 uC; varying float vA;
      void main(){ vec2 q = gl_PointCoord - .5; float r = length(q); if (r > .5) discard;
        float star = max(0., 1. - abs(q.x)*14.) * max(0., 1. - abs(q.y)*2.) + max(0., 1. - abs(q.y)*14.) * max(0., 1. - abs(q.x)*2.);
        gl_FragColor = vec4(mix(uC, vec3(1.), .55), (smoothstep(.5, 0., r)*.8 + star*.6) * vA); }`,
  }));
  group.add(sparkles);

  // bloom gives the crystal its glow; phones run it at half resolution
  let composer: EffectComposer | null = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), lowEnd ? 0.6 : 0.7, 0.55, 0.35);
  const outputPass = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(outputPass);
  // EffectComposer.dispose() only frees its own targets, so free each pass too
  const dropComposer = () => {
    if (!composer) return;
    renderPass.dispose(); bloom.dispose(); outputPass.dispose(); composer.dispose();
    composer = null;
  };
  const bloomScale = lowEnd ? 0.5 : 1;
  const draw = () => (composer ? composer.render() : renderer.render(scene, camera));

  // phones: fit the crystal between the nav and 60% of the screen, measured once per layout
  // (recomputed when the width changes or the height changes a lot, never for the address bar sliding in and out)
  let navBottom = 80, fitS = 0.6, fitY = 1.1, curS = 0.6, curY = 1.1, fitW = 0, fitH = 0;
  const measureNav = () => { if (nav) navBottom = nav.getBoundingClientRect().bottom; };
  const size = () => ({ w: canvas.clientWidth || innerWidth, h: canvas.clientHeight || innerHeight });
  function fitPhone() {
    const { w, h } = size();
    if (w > 720) return;
    if (w === fitW && Math.abs(h - fitH) < 160) return;
    fitW = w; fitH = h;
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z, halfW = halfH * camera.aspect, perPx = (2 * halfH) / h;
    const top = halfH - (navBottom + 22) * perPx, bottom = halfH - h * 0.6 * perPx;
    fitS = Math.max(0.3, Math.min(0.85, halfW * 0.42, (top - bottom - 0.25) / 4.4));
    fitY = top - 0.15 - 2.7 * fitS;
  }
  function resize() {
    measureNav();
    const { w, h } = size();
    renderer.setSize(w, h, false);
    if (composer) {
      const pr = renderer.getPixelRatio();
      composer.setPixelRatio(pr); composer.setSize(w, h);
      bloom.setSize(w * pr * bloomScale, h * pr * bloomScale);
    }
    camera.aspect = w / h; camera.updateProjectionMatrix();
    fitPhone();
  }

  let progress = 0, cur = 0, mx = 0, my = 0, smx = 0, smy = 0, spin = 0, lastIdx = 0, first = true, ready = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress = max > 0 ? Math.max(0, Math.min(1, scrollY / max)) * (sectionCount - 1) : 0;
  };
  const onPointer = (e: PointerEvent) => { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; };

  function blendAt(p: number) {
    p = Math.max(0, Math.min(SECTIONS.length - 1, p || 0));
    const i = Math.min(SECTIONS.length - 2, Math.floor(p)), f = p - i;
    let e = f < 0.35 ? 0 : f > 0.65 ? 1 : (f - 0.35) / 0.3; // hold each colour while its section is on screen
    e = e * e * (3 - 2 * e);
    const A = SECTIONS[i], B = SECTIONS[i + 1];
    U.uC.value.copy(A.c).lerp(B.c, e); U.uN.value.copy(A.n).lerp(B.n, e);
    U.uIri.value = A.iri + (B.iri - A.iri) * e; U.uGain.value = A.g + (B.g - A.g) * e;
  }

  const white = new THREE.Color(1, 1, 1), tmp = new THREE.Color();
  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05), t = reduce ? 4 : clock.elapsedTime;
    cur = reduce ? progress : cur + (progress - cur) * Math.min(1, dt * 4.5);
    blendAt(cur); U.uT.value = t;
    const c = U.uC.value;
    halo.material.color.copy(c); halo.material.opacity = 0.16 * U.uGain.value;
    coreGlow.material.color.copy(tmp.copy(white).lerp(c, 0.45));
    tipGlow.material.color.copy(tmp.copy(white).lerp(c, 0.3));
    document.documentElement.style.setProperty("--accent", "#" + tmp.copy(white).lerp(c, 0.8).getHexString());

    const idx = Math.round(cur);
    if (idx !== lastIdx) { spin = reduce ? 0 : 2.5; lastIdx = idx; onSection(idx); }
    spin *= Math.exp(-dt * 2.2);

    const wide = innerWidth > 720;
    const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect;
    if (wide) fitS = Math.min(1, halfW / 5.6);
    const k = first || reduce ? 1 : Math.min(1, dt * 4); // ease toward the fitted size instead of jumping
    curS += (fitS - curS) * k; curY += (fitY - curY) * k;
    group.scale.setScalar(curS);
    const gx = wide ? halfW * 0.56 : 0;
    group.position.x = first || reduce ? gx : group.position.x + (gx - group.position.x) * dt * 3.5;
    first = false;
    group.position.y = (wide ? -0.2 : curY) + Math.sin(t * 0.8) * 0.12;
    crystal.rotation.y = reduce ? 0.6 : crystal.rotation.y + dt * (0.3 + spin);
    coreGlow.material.opacity = 0.4 + 0.08 * Math.sin(t * 2.3);
    smx += (mx - smx) * dt * 3; smy += (my - smy) * dt * 3;
    group.rotation.x = smy * 0.12; group.rotation.z = -smx * 0.08 + Math.sin(t * 0.5) * 0.03;
    draw();
    if (!ready) { ready = true; onReady(); }
  }

  // if a device can't keep up, step quality down: lower resolution first, then drop the glow
  let slow = 0, samples = 0, sum = 0;
  function adapt(ms: number) {
    if (ms > 100) return;
    sum += ms; if (++samples < 60) return;
    const avg = sum / samples; samples = 0; sum = 0;
    if (avg < 24) { slow = 0; return; }
    if (++slow < 2) return; slow = 0;
    if (maxPR > 1) { maxPR = Math.max(1, maxPR - 0.25); renderer.setPixelRatio(Math.min(devicePixelRatio, maxPR)); resize(); }
    else dropComposer();
  }

  // animate while the tab is visible; with reduced motion, redraw only when something changes
  let raf = 0, running = false, lastT = 0, pending = false;
  const loop = (now: number) => {
    if (document.hidden) { running = false; return; }
    if (lastT) adapt(now - lastT);
    lastT = now; frame(); raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!running && !reduce) { running = true; lastT = 0; clock.getDelta(); raf = requestAnimationFrame(loop); } };
  const still = () => { if (pending) return; pending = true; raf = requestAnimationFrame(() => { pending = false; frame(); }); };
  const onVisibility = () => { if (!document.hidden) start(); };
  const onResize = () => { resize(); if (reduce) still(); };

  resize(); onScroll();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("pointermove", onPointer);
  addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  if (reduce) { addEventListener("scroll", still, { passive: true }); still(); } else start();

  return () => {
    cancelAnimationFrame(raf); running = false;
    removeEventListener("scroll", onScroll);
    removeEventListener("scroll", still);
    removeEventListener("pointermove", onPointer);
    removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
        (x as THREE.SpriteMaterial).map?.dispose();
        x.dispose();
      });
    });
    dropComposer();
    renderer.dispose();
  };
}
