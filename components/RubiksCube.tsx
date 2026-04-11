"use client";

import { useEffect, useRef } from "react";

// ─── RubiksCube ────────────────────────────────────────────────────────────────
// CSS, HTML structure, and JS logic are a 1:1 port from
// sample/Rubiks-Cube/index.html — nothing changed except:
//   • Class names prefixed with "rk-" to avoid collisions
//   • Vanilla JS wrapped in useEffect with cleanup
//   • Colours adapted: orange aura → acid green (#AAFF00) for the portfolio palette
export default function RubiksCube() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<HTMLDivElement>(null);
  const viewportRef  = useRef<HTMLDivElement>(null);
  const statusRef    = useRef<HTMLDivElement>(null);
  const btnScrambleRef = useRef<HTMLButtonElement>(null);
  const btnSolveRef    = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const cubeScene  = sceneRef.current!;
    const cubeVP     = viewportRef.current!;
    const statusEl   = statusRef.current!;
    const b1         = btnScrambleRef.current!;
    const b2         = btnSolveRef.current!;

    // ── Original constants (unchanged) ────────────────────────────────────
    const HALF_PX  = 33;
    const STEP_PX  = 66;

    const FC = {
      front:  { bg: "#009B48", cls: "rk-fc-green"  },
      back:   { bg: "#0051A2", cls: "rk-fc-blue"   },
      right:  { bg: "#C41E3A", cls: "rk-fc-red"    },
      left:   { bg: "#FF5800", cls: "rk-fc-orange" },
      top:    { bg: "#FFFFFF", cls: "rk-fc-white"  },
      bottom: { bg: "#FFD500", cls: "rk-fc-yellow" },
      inner:  { bg: "#1a1a1a", cls: "rk-fc-inner"  },
    } as const;

    const FACE_DEFS = [
      { key: "front",  t: `translateZ(${HALF_PX}px)` },
      { key: "back",   t: `rotateY(180deg) translateZ(${HALF_PX}px)` },
      { key: "right",  t: `rotateY(90deg) translateZ(${HALF_PX}px)` },
      { key: "left",   t: `rotateY(-90deg) translateZ(${HALF_PX}px)` },
      { key: "top",    t: `rotateX(90deg) translateZ(${HALF_PX}px)` },
      { key: "bottom", t: `rotateX(-90deg) translateZ(${HALF_PX}px)` },
    ] as const;

    type Cubie = { el: HTMLDivElement; m: DOMMatrix };
    const cubies: Cubie[] = [];

    // ── makeCubie (original logic unchanged) ──────────────────────────────
    function makeCubie(lx: number, ly: number, lz: number): Cubie {
      const el = document.createElement("div");
      el.className = "rk-cubie";

      FACE_DEFS.forEach((fd) => {
        let fc: (typeof FC)[keyof typeof FC] = FC.inner;
        if (fd.key === "front"  && lz ===  1) fc = FC.front;
        if (fd.key === "back"   && lz === -1) fc = FC.back;
        if (fd.key === "right"  && lx ===  1) fc = FC.right;
        if (fd.key === "left"   && lx === -1) fc = FC.left;
        if (fd.key === "top"    && ly ===  1) fc = FC.top;
        if (fd.key === "bottom" && ly === -1) fc = FC.bottom;

        const face = document.createElement("div");
        face.className = "rk-cubie-face " + fc.cls;
        face.style.transform = fd.t + (fc === FC.inner ? " scale(0.98)" : "");
        if (fc !== FC.inner) {
          face.style.backgroundColor = fc.bg;
          face.innerHTML = '<div class="rk-gloss"></div><div class="rk-shine"></div>';
        } else {
          face.style.backgroundColor = "#111";
        }
        el.appendChild(face);
      });

      const m = new DOMMatrix().translate(lx * STEP_PX, -ly * STEP_PX, lz * STEP_PX);
      el.style.transform = m.toString();
      return { el, m };
    }

    // ── buildCube (original) ───────────────────────────────────────────────
    function buildCube() {
      cubeScene.innerHTML = "";
      cubies.length = 0;
      for (let y = 1; y >= -1; y--) {
        for (let x = -1; x <= 1; x++) {
          for (let z = 1; z >= -1; z--) {
            const c = makeCubie(x, y, z);
            cubeScene.appendChild(c.el);
            cubies.push(c);
          }
        }
      }
    }

    // ── snap (original) ────────────────────────────────────────────────────
    function snap(m: DOMMatrix) {
      m.m41 = Math.round(m.m41 / STEP_PX) * STEP_PX;
      m.m42 = Math.round(m.m42 / STEP_PX) * STEP_PX;
      m.m43 = Math.round(m.m43 / STEP_PX) * STEP_PX;
      (["m11","m12","m13","m21","m22","m23","m31","m32","m33"] as const).forEach((f) => {
        if (Math.abs(m[f]) < 0.1) m[f] = 0;
        else m[f] = Math.sign(m[f]);
      });
    }

    // ── rotateLayer (original) ─────────────────────────────────────────────
    function rotateLayer(axis: "x"|"y"|"z", slice: number, angle: number, ms: number): Promise<void> {
      return new Promise((resolve) => {
        const layer = cubies.filter((c) => {
          const x = Math.round(c.m.m41 / STEP_PX);
          const y = Math.round(-c.m.m42 / STEP_PX);
          const z = Math.round(c.m.m43 / STEP_PX);
          return (axis === "x" ? x : axis === "y" ? y : z) === slice;
        });
        if (layer.length === 0) { resolve(); return; }

        const pivot = document.createElement("div");
        pivot.style.cssText = "position:absolute;width:0;height:0;transform-style:preserve-3d;";
        cubeScene.appendChild(pivot);
        layer.forEach((c) => pivot.appendChild(c.el));

        pivot.getBoundingClientRect(); // force layout

        if (ms > 0) {
          // No overshoot — 1.25 in the original caused layers to briefly exceed 90°,
        // making inner faces visible from outside the cube during animation.
        pivot.style.transition = `transform ${ms}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        }
        pivot.style.transform =
          axis === "y" ? `rotateY(${angle}deg)` :
          axis === "x" ? `rotateX(${angle}deg)` :
                         `rotateZ(${angle}deg)`;

        setTimeout(() => {
          // Guard against React Strict Mode double-invoke: cleanup sets destroyed=true
          // before re-mounting, but these 40ms-delayed callbacks are already in flight.
          // Without this check they would re-append stale cubies into the fresh scene.
          if (destroyed) { pivot.remove(); resolve(); return; }

          const rotStr =
            axis === "y" ? `rotateY(${angle}deg)` :
            axis === "x" ? `rotateX(${angle}deg)` :
                           `rotateZ(${angle}deg)`;
          const rotM = new DOMMatrix(rotStr);
          layer.forEach((c) => {
            c.m = rotM.multiply(c.m);
            snap(c.m);
            cubeScene.appendChild(c.el);
            c.el.style.transition = "none";
            c.el.style.transform = c.m.toString();
            void c.el.offsetHeight;
          });
          pivot.remove();
          resolve();
        }, ms + 40);
      });
    }

    // ── MOVES (original) ──────────────────────────────────────────────────
    const MOVES: { axis: "x"|"y"|"z"; slice: number; angle: number }[] = [
      { axis:"y", slice: 1, angle:  90 }, { axis:"y", slice: 1, angle: -90 },
      { axis:"y", slice: 0, angle:  90 }, { axis:"y", slice: 0, angle: -90 },
      { axis:"y", slice:-1, angle:  90 }, { axis:"y", slice:-1, angle: -90 },
      { axis:"x", slice: 1, angle:  90 }, { axis:"x", slice: 1, angle: -90 },
      { axis:"x", slice: 0, angle:  90 }, { axis:"x", slice: 0, angle: -90 },
      { axis:"x", slice:-1, angle:  90 }, { axis:"x", slice:-1, angle: -90 },
      { axis:"z", slice: 1, angle:  90 }, { axis:"z", slice: 1, angle: -90 },
      { axis:"z", slice:-1, angle:  90 }, { axis:"z", slice:-1, angle: -90 },
    ];

    let history: typeof MOVES = [];
    let busy        = false;
    let manualMode  = false;
    let manualTimer = 0;
    let destroyed   = false;

    function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }
    function setStatus(txt: string) { statusEl.textContent = txt; }
    function setBtnsDisabled(v: boolean) { b1.disabled = v; b2.disabled = v; }

    // ── scramble (original) ───────────────────────────────────────────────
    async function scramble(n = 14, ms = 185) {
      if (busy || destroyed) return;
      busy = true; setBtnsDisabled(true);
      setStatus("Scrambling...");
      history = [];
      for (let i = 0; i < n; i++) {
        if (destroyed) break;
        let m: typeof MOVES[0];
        do { m = MOVES[Math.floor(Math.random() * MOVES.length)]; }
        while (history.length && history[history.length-1].axis === m.axis && history[history.length-1].slice === m.slice);
        history.push(m);
        await rotateLayer(m.axis, m.slice, m.angle, ms);
        await sleep(18);
      }
      if (!destroyed) { busy = false; setBtnsDisabled(false); setStatus("Scrambled — ready to solve"); }
    }

    // ── solve (original) ──────────────────────────────────────────────────
    async function solve(ms = 340) {
      if (busy || !history.length || destroyed) return;
      busy = true; setBtnsDisabled(true);
      setStatus("Solving...");
      const moves = [...history].reverse().map((m) => ({ ...m, angle: -m.angle }));
      for (const m of moves) {
        if (destroyed) break;
        await rotateLayer(m.axis, m.slice, m.angle, ms);
        await sleep(28);
      }
      if (!destroyed) {
        history = [];
        busy = false; setBtnsDisabled(false);
        setStatus("Solved! ✓");
      }
    }

    // ── startScrambleSolve (original) ─────────────────────────────────────
    async function startScrambleSolve(n = 10, ms = 360) {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      wrapper.style.opacity = "0";
      await scramble(n, 0);
      if (destroyed) return;
      wrapper.style.opacity = "1";
      await sleep(400);
      await solve(ms);
    }

    // ── Button handlers (original) ────────────────────────────────────────
    const onScramble = () => {
      if (history.length > 0) return;
      manualMode = true; clearTimeout(manualTimer);
      manualTimer = window.setTimeout(() => { manualMode = false; }, 15000);
      scramble(14, 200);
    };
    const onSolve = () => {
      manualMode = true; clearTimeout(manualTimer);
      manualTimer = window.setTimeout(() => { manualMode = false; }, 15000);
      solve(380);
    };
    b1.addEventListener("click", onScramble);
    b2.addEventListener("click", onSolve);

    // ── Whole-cube drag with inertia (original) ───────────────────────────
    let rotX = -22, rotY = 45;
    let velX = 0, velY = 0;
    let dragging = false, lx2 = 0, ly2 = 0;
    let lastDx = 0, lastDy = 0;
    let animRafId = 0;
    let paused = false;

    function applyRot() {
      cubeScene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    function animRot() {
      if (!dragging) {
        velY *= 0.92; velX *= 0.92;
        if (!manualMode && !busy) {
          velY += (0.25 - velY) * 0.025;
          velX += (0 - velX) * 0.025;
        }
        rotY += velY; rotX += velX;
        rotX = Math.max(-65, Math.min(65, rotX));
      }
      applyRot();
      if (!destroyed && !paused) animRafId = requestAnimationFrame(animRot);
    }

    // Pause the RAF loop when the cube is off-screen to save CPU
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        paused = !entry.isIntersecting;
        if (!paused && !destroyed) {
          cancelAnimationFrame(animRafId);
          animRafId = requestAnimationFrame(animRot);
        }
      },
      { threshold: 0.1 }
    );
    if (wrapperRef.current) visibilityObserver.observe(wrapperRef.current);

    animRafId = requestAnimationFrame(animRot);

    // Mouse drag
    const onMouseDown = (e: MouseEvent) => {
      dragging = true; lx2 = e.clientX; ly2 = e.clientY;
      velX = 0; velY = 0; lastDx = 0; lastDy = 0;
      manualMode = true; clearTimeout(manualTimer);
      e.preventDefault();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      lastDx = (e.clientX - lx2) * 0.45;
      lastDy = (e.clientY - ly2) * 0.45;
      rotY += lastDx; rotX -= lastDy;
      rotX = Math.max(-65, Math.min(65, rotX));
      lx2 = e.clientX; ly2 = e.clientY;
    };
    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      velY = lastDx * 0.85; velX = -lastDy * 0.85;
      manualTimer = window.setTimeout(() => { manualMode = false; }, 8000);
    };

    // Touch drag
    const onTouchStart = (e: TouchEvent) => {
      dragging = true;
      lx2 = e.touches[0].clientX; ly2 = e.touches[0].clientY;
      velX = 0; velY = 0; lastDx = 0; lastDy = 0;
      manualMode = true; clearTimeout(manualTimer);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      lastDx = (e.touches[0].clientX - lx2) * 0.45;
      lastDy = (e.touches[0].clientY - ly2) * 0.45;
      rotY += lastDx; rotX -= lastDy;
      rotX = Math.max(-65, Math.min(65, rotX));
      lx2 = e.touches[0].clientX; ly2 = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      dragging = false;
      velY = lastDx * 0.85; velX = -lastDy * 0.85;
      manualTimer = window.setTimeout(() => { manualMode = false; }, 8000);
    };

    cubeVP.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    cubeVP.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    // ── Init ──────────────────────────────────────────────────────────────
    buildCube();
    setStatus("Initializing...");
    startScrambleSolve(10, 380);

    return () => {
      destroyed = true;
      cancelAnimationFrame(animRafId);
      visibilityObserver.disconnect();
      cubeScene.innerHTML = "";
      clearTimeout(manualTimer);
      b1.removeEventListener("click", onScramble);
      b2.removeEventListener("click", onSolve);
      cubeVP.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      cubeVP.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="rk-cube-wrapper">
      <div className="rk-cube-aura" aria-hidden="true" />
      <div ref={viewportRef} className="rk-cube-viewport">
        <div
          ref={sceneRef}
          className="rk-cube-scene"
          style={{ cursor: "grab" }}
        />
      </div>
      <div className="rk-cube-ui">
        <div ref={statusRef} className="rk-cube-status">Initializing...</div>
        <div className="rk-cube-btns">
          <button ref={btnScrambleRef} className="rk-cbtn">Scramble</button>
          <button ref={btnSolveRef}    className="rk-cbtn rk-cbtn-solve">Solve</button>
        </div>
        <p className="rk-cube-hint">Drag to rotate &bull; buttons to scramble/solve</p>
      </div>
    </div>
  );
}
