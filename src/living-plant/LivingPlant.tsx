import { useEffect, useRef, useState } from "react";
import { growthConfig, stems, roots, leaves, plantNodes } from "./config";
import { Icon } from "../components/Icon";
import { Modal } from "../components/Modal";
/** Scroll work reads geometry once per frame, then writes SVG presentation attributes.
 * No React rerender on scroll. The observer gates work while this section is offscreen. */
export function LivingPlant() {
  const section = useRef<HTMLElement>(null),
    svg = useRef<SVGSVGElement>(null),
    meter = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string | null>(null),
    [playing, setPlaying] = useState(false),
    [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const el = section.current!,
      art = svg.current!;
    let frame = 0,
      visible = true;
    const render = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const p = reduced
        ? 1
        : Math.max(
            0,
            Math.min(1, -box.top / Math.max(1, box.height - innerHeight)),
          );
      const stem =
          growthConfig.initialStem + (1 - growthConfig.initialStem) * p,
        root = growthConfig.initialRoot + (1 - growthConfig.initialRoot) * p;
      art.querySelectorAll<SVGPathElement>("[data-grow]").forEach((path) => {
        path.style.strokeDashoffset = String(
          1 - (path.dataset.grow === "root" ? root : stem),
        );
        path.style.strokeWidth = String(
          growthConfig.minStroke +
            (growthConfig.maxStroke - growthConfig.minStroke) * p,
        );
      });
      art.querySelectorAll<SVGGElement>("[data-leaf]").forEach((leaf, i) => {
        const reveal = reduced
          ? 1
          : Math.max(0.15, Math.min(1, 0.7 + p * 0.9 - i * 0.055));
        leaf.style.opacity = String(reveal);
      });
      if (meter.current)
        meter.current.textContent = String(Math.round(p * 100)).padStart(
          3,
          "0",
        );
    };
    const request = () => {
      if (!frame && visible) frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) request();
    });
    observer.observe(el);
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, [reduced]);
  useEffect(() => {
    if (!playing || reduced) return;
    let frame = 0,
      last = 0;
    const pause = () => setPlaying(false);
    const tick = (time: number) => {
      if (last) {
        const max =
          section.current!.offsetTop +
          section.current!.offsetHeight -
          innerHeight;
        if (scrollY >= max) {
          setPlaying(false);
          return;
        }
        scrollBy(
          0,
          (Math.min(50, time - last) * growthConfig.autoScrollPixelsPerSecond) /
            1000,
        );
      }
      last = time;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const events = ["wheel", "touchstart", "pointerdown", "keydown"];
    events.forEach((e) => addEventListener(e, pause, { passive: true }));
    const hidden = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      cancelAnimationFrame(frame);
      events.forEach((e) => removeEventListener(e, pause));
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [playing, reduced]);
  const node = plantNodes.find((n) => n.id === active);
  return (
    <section
      className="living-section"
      ref={section}
      aria-label="The living plant experience"
    >
      <div className="living-stage">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="little-line" /> NATURE, UNDERSTOOD.
          </div>
          <h1>
            A little <br />
            knowledge.
            <br />
            <em>A lot of growth.</em>
          </h1>
          <p>
            You don’t need a green thumb. <br />
            Just a little understanding of what grows.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="library.html">
              <Icon name="leaf" />
              Find your plant
            </a>
            <a className="text-link" href="guides.html">
              Grow your know-how
            </a>
          </div>
          <div className="hero-note">
            <span className="orbit-mark">✳</span>
            <span>
              A living field guide.
              <br />
              <strong>Rooted in science. Made for your space.</strong>
            </span>
          </div>
        </div>
        <div className="living-art">
          <div className="specimen-code">ROOTWISE / LIVING SYSTEM 001</div>
          <svg ref={svg} viewBox="0 0 900 900" aria-hidden="true">
            <defs>
              <linearGradient id="hero-leaf" x1="0" y1="0" x2="1" y2=".8">
                <stop stopColor="var(--hero-leaf-light)" />
                <stop offset=".35" stopColor="var(--hero-leaf-mid)" />
                <stop offset="1" stopColor="var(--hero-leaf-dark)" />
              </linearGradient>
              <linearGradient id="hero-leaf-back">
                <stop stopColor="var(--hero-leaf-dark)" />
                <stop offset="1" stopColor="var(--hero-leaf-mid)" />
              </linearGradient>
              <radialGradient id="hero-halo">
                <stop stopColor="var(--accent)" stopOpacity=".09" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="465" cy="388" r="365" fill="url(#hero-halo)" />
            <g
              className="orbital-lines"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
            >
              <circle cx="450" cy="410" r="285" />
              <circle cx="450" cy="410" r="215" strokeDasharray="2 14" />
              <path d="M90 410h720M450 60v640" strokeDasharray="2 10" />
              <path d="M145 145v-18h18M739 145v-18h-18M145 635v18h18M739 635v18h-18" />
            </g>
            <g
              className="plant-root"
              fill="none"
              stroke="var(--root)"
              strokeLinecap="round"
            >
              {roots.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  pathLength="1"
                  data-grow="root"
                  strokeDasharray="1"
                />
              ))}
            </g>
            <path
              d="M80 632H820"
              stroke="var(--border)"
              strokeDasharray="2 7"
            />
            <g fill="none" stroke="var(--hero-stem)" strokeLinecap="round">
              {stems.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  pathLength="1"
                  data-grow="stem"
                  strokeDasharray="1"
                />
              ))}
            </g>
            {leaves.map((leaf, i) => (
              <g
                key={i}
                data-leaf="true"
                transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale})`}
              >
                <path
                  d="M0 0C-117-15-146-113-102-174-67-224-15-184 0-146 15-185 66-212 99-168 146-104 102-14 0 0Z"
                  fill="url(#hero-leaf)"
                  stroke="var(--hero-edge)"
                  strokeWidth=".8"
                />
                <path
                  d="M0-4C-7-67 0-116 0-153M-2-30C-29-45-55-59-76-94M-2-57C-37-75-70-95-89-134M-2-84C-24-104-39-132-43-160M-2-30C30-48 56-69 74-99M-2-57C28-78 59-105 77-143M-2-83C17-102 35-134 38-161"
                  fill="none"
                  stroke="var(--hero-vein)"
                  strokeWidth="1"
                  opacity=".5"
                />
                <path
                  d="M0 0C-8-70-4-117 0-146"
                  fill="none"
                  stroke="var(--hero-vein)"
                  strokeWidth="2"
                />
              </g>
            ))}
            <g fill="var(--muted)" className="svg-label">
              <text x="102" y="618">
                ABOVE / GROWTH
              </text>
              <text x="102" y="660">
                BELOW / FOUNDATION
              </text>
              <text x="700" y="660">
                01—06
              </text>
            </g>
          </svg>
          {plantNodes.map((n) => (
            <button
              key={n.id}
              className={`plant-node node-${n.id}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              aria-label={`${n.tag}: ${n.label}: open information panel`}
              onClick={() => setActive(n.id)}
            >
              <span className="node-ring">
                <Icon name={n.icon} size={17} />
              </span>
              <span className="node-label">
                {n.tag}
                <Icon name="plus" size={12} />
              </span>
            </button>
          ))}
          <div className="art-caption">
            <span>FICUS ELASTICA</span>
            <span>A study in slow growth.</span>
          </div>
        </div>
        <div className="living-bottom">
          <span className="scroll-cue">
            <span />
            SCROLL TO PUT DOWN ROOTS
          </span>
          <button
            className="auto-control"
            onClick={() => setPlaying((p) => !p)}
            disabled={reduced}
            aria-pressed={playing}
          >
            <Icon name={playing ? "pause" : "play"} size={14} />
            {reduced
              ? "MOTION REDUCED"
              : playing
                ? "PAUSE EXPLORATION"
                : "AUTO EXPLORE"}
          </button>
          <span className="growth-meter">
            GROWTH <span ref={meter}>000</span>
            <span className="muted"> / 100</span>
          </span>
        </div>
      </div>
      {node && (
        <Modal title={node.title} onClose={() => setActive(null)}>
          <p className="lead">{node.summary}</p>
          <p>{node.body}</p>
          <a className="button primary" href={node.link}>
            {node.linkLabel}
          </a>
        </Modal>
      )}
    </section>
  );
}
