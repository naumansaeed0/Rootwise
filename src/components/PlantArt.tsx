import { useId } from "react";
export function PlantArt({
  shape = "heart",
  seed = 0,
  label,
  className = "",
}: {
  shape?: string;
  seed?: number;
  label?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const leaf = (
    x: number,
    y: number,
    r: number,
    s: number,
    key: number,
    split = false,
  ) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path
        d={
          split
            ? "M0 0C-75-5-95-65-60-95L-40-67l9 2-20-39c10-10 22-8 32-6l9 48 6 1-3-51C48-118 75-60 0 0Z"
            : "M0 0C-77-15-82-89-47-105-25-116-8-96 0-77 8-96 30-115 49-102 84-77 71-15 0 0Z"
        }
        fill={`url(#${id}-leaf)`}
        stroke="var(--art-edge)"
        strokeWidth=".7"
      />
      <path
        d="M0-3V-86M0-27l-30-30M0-45l-33-35M0-26l30-30M0-44l31-35"
        stroke="var(--art-vein)"
        strokeWidth="1"
        fill="none"
        opacity=".55"
      />
    </g>
  );
  return (
    <svg
      className={`plant-art ${className}`}
      viewBox="0 0 320 300"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="var(--art-light)" />
          <stop offset=".5" stopColor="var(--art-mid)" />
          <stop offset="1" stopColor="var(--art-dark)" />
        </linearGradient>
        <linearGradient id={`${id}-pot`}>
          <stop stopColor="var(--pot-light)" />
          <stop offset="1" stopColor="var(--pot-dark)" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="var(--accent)" stopOpacity=".15" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="159" rx="145" ry="140" fill={`url(#${id}-glow)`} />
      <ellipse
        cx="160"
        cy="275"
        rx="73"
        ry="9"
        fill="var(--shadow)"
        opacity=".3"
      />
      {["grass", "sword"].includes(shape) ? (
        <g>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 160 + (i - 4) * 7,
              dx = (i - 4) * (shape === "sword" ? 11 : 23),
              top = 45 + Math.abs(i - 4) * 10;
            return (
              <g key={i}>
                <path
                  d={`M${x} 230Q${x + dx - 40} ${top + 20} ${x + dx} ${top}Q${x + dx + 30} ${top + 60} ${x + 7} 230Z`}
                  fill={`url(#${id}-leaf)`}
                  stroke="var(--art-edge)"
                  strokeWidth="1"
                />
                <path
                  d={`M${x + 3} 225Q${x + dx + 5} ${top + 50} ${x + dx} ${top + 8}`}
                  fill="none"
                  stroke="var(--art-vein)"
                  opacity=".5"
                />
              </g>
            );
          })}
        </g>
      ) : shape === "fern" || shape === "palm" ? (
        <g>
          {[-65, -40, -15, 15, 40, 65].map((r, i) => (
            <g key={r} transform={`translate(160 231) rotate(${r})`}>
              <path
                d="M0 0Q-10-100 0-178"
                stroke="var(--art-edge)"
                fill="none"
                strokeWidth="2"
              />
              {Array.from({ length: shape === "fern" ? 12 : 9 }, (_, j) => {
                const y = -25 - j * 12,
                  l = 35 - Math.abs(j - 4) * 3;
                return (
                  <g key={j}>
                    <path
                      d={`M-2 ${y}Q${-l - 10} ${y - 6} ${-l} ${y - 27}Q-7 ${y - 26}-2 ${y}M-2 ${y}Q${l + 10} ${y - 6} ${l} ${y - 27}Q7 ${y - 26}-2 ${y}`}
                      fill={`url(#${id}-leaf)`}
                    />
                  </g>
                );
              })}
            </g>
          ))}
        </g>
      ) : shape === "rosette" ? (
        <g transform="translate(160 178)">
          {Array.from({ length: 15 }, (_, i) => (
            <path
              key={i}
              transform={`rotate(${i * 137.5}) scale(${1 - i * 0.045})`}
              d="M0 20C-56-16-31-73 0-93 31-73 56-16 0 20Z"
              fill={`url(#${id}-leaf)`}
              stroke="var(--art-edge)"
              strokeWidth="2"
            />
          ))}
        </g>
      ) : shape === "zz" ? (
        <g>
          {[-35, 0, 35].map((r) => (
            <g key={r} transform={`translate(160 230) rotate(${r})`}>
              <path
                d="M0 0Q-5-90 0-165"
                stroke="var(--art-edge)"
                strokeWidth="3"
                fill="none"
              />
              {Array.from({ length: 5 }, (_, i) => (
                <g key={i}>
                  {leaf(-1, -25 - i * 28, -65, 0.32, i * 2)}
                  {leaf(1, -33 - i * 28, 65, 0.32, i * 2 + 1)}
                </g>
              ))}
            </g>
          ))}
        </g>
      ) : (
        <g>
          <path
            d="M160 231Q145 149 165 63M158 206Q100 155 86 108M155 161Q198 140 221 104M155 173Q131 133 130 88"
            fill="none"
            stroke="var(--art-edge)"
            strokeWidth="3"
          />
          {shape === "round" ? (
            [
              [85, 111, 29],
              [128, 85, 38],
              [164, 65, 36],
              [222, 104, 36],
              [192, 159, 27],
            ].map(([cx, cy, r], i) => (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={`url(#${id}-leaf)`}
                  stroke="var(--art-edge)"
                />
                <path
                  d={`M${cx - r + 5} ${cy}h${r * 2 - 10}M${cx} ${cy - r + 5}v${r * 2 - 10}`}
                  stroke="var(--art-vein)"
                  opacity=".4"
                />
              </g>
            ))
          ) : (
            <>
              {leaf(86, 127, -43, 0.72, 1, shape === "split")}
              {leaf(131, 116, -12, 0.65, 2, shape === "split")}
              {leaf(165, 85, 21, 0.7, 3, shape === "split")}
              {leaf(207, 144, 65, 0.82, 4, shape === "split")}
              {leaf(154, 195, -62, 0.67, 5, shape === "split")}
            </>
          )}
          {shape === "bloom" && (
            <g transform={`translate(${155 + (seed % 12)} 83)`}>
              <path
                d="M0 45C-76 16-46-45 0-5 46-45 62 28 0 45Z"
                fill="var(--flower)"
                stroke="var(--art-edge)"
              />
              <path
                d="M0 34 2-10"
                stroke="#e5ce8e"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>
      )}
      <path
        d="M115 221h90l-12 49q-33 12-66 0Z"
        fill={`url(#${id}-pot)`}
        stroke="var(--pot-line)"
      />
      <ellipse
        cx="160"
        cy="222"
        rx="45"
        ry="9"
        fill="var(--pot-light)"
        stroke="var(--pot-line)"
      />
      <ellipse cx="160" cy="222" rx="36" ry="5" fill="var(--soil)" />
      <path d="M160 223v-11" stroke="var(--art-edge)" strokeWidth="4" />
    </svg>
  );
}
