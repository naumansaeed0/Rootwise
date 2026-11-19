import type { CSSProperties } from "react";
const paths: Record<string, string> = {
  leaf: "M19 4C10 2 3 7 5 14c2 7 13 7 14-10ZM5 20 16 9M10 15l-1-5m4 2 4 1",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
  moon: "M20 15A9 9 0 0 1 9 4 9 9 0 1 0 20 15Z",
  drop: "M12 3C10 7 5 11 5 15a7 7 0 0 0 14 0c0-4-5-8-7-12Z",
  search: "M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm5.5 13 5 5",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  play: "m8 5 11 7-11 7Z",
  pause: "M8 5v14M16 5v14",
  sprout:
    "M12 21v-9m0 4C3 17 2 10 3 7c7-1 10 4 9 9Zm0-4C11 5 17 2 22 3c0 6-3 10-10 9Z",
  book: "M12 5c-4-3-8-2-10-1v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-6-2-10 1Zm0 0v15",
  shield: "M12 3 3 7v5c0 5 5 8 9 10 4-2 9-5 9-10V7l-9-4Zm-4 9 3 3 5-6",
  menu: "M4 6h16M4 12h16M4 18h16",
  check: "m5 12 4 4L19 6",
  chevron: "m8 5 7 7-7 7",
  humidity: "M5 3v18M12 7v14M19 11v10",
  temperature: "M10 14V5a2 2 0 0 1 4 0v9a5 5 0 1 1-4 0ZM12 10v9",
};
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name] || paths.leaf} />
    </svg>
  );
}
