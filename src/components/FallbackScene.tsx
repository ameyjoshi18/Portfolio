// Static, non-animated stand-in for prefers-reduced-motion and no-WebGL contexts.
// Same visual idea as the live scene — scattered points resolving into a connected
// lattice — rendered once as plain SVG, no motion at all.
export function FallbackScene() {
  const dots: { x: number; y: number; r: number; c: string }[] = [];
  const lines: { x1: number; y1: number; x2: number; y2: number; o: number }[] = [];

  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < 26; i++) {
    dots.push({ x: rand() * 100, y: rand() * 30, r: 0.6 + rand() * 0.5, c: "#2a3140" });
  }

  const gridCols = 7;
  const gridRows = 5;
  const nodes: { x: number; y: number }[] = [];
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      nodes.push({
        x: 20 + c * 10 + (rand() - 0.5) * 3,
        y: 55 + r * 8 + (rand() - 0.5) * 3,
      });
    }
  }
  nodes.forEach((n, i) => {
    dots.push({ x: n.x, y: n.y, r: 0.9, c: "#e8823c" });
    if (i % gridCols !== gridCols - 1) {
      lines.push({ x1: n.x, y1: n.y, x2: nodes[i + 1].x, y2: nodes[i + 1].y, o: 0.5 });
    }
    if (i + gridCols < nodes.length) {
      lines.push({ x1: n.x, y1: n.y, x2: nodes[i + gridCols].x, y2: nodes[i + gridCols].y, o: 0.35 });
    }
  });

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <rect width="100" height="100" fill="#0b0e13" />
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#e8823c"
          strokeWidth={0.15}
          opacity={l.o}
        />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} />
      ))}
    </svg>
  );
}
