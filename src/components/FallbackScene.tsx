// Static, non-animated stand-in for prefers-reduced-motion and no-WebGL contexts.
// Same idea as the live scene — flat colored blocks, resolved into a calm
// skyline — rendered once as plain SVG, no motion at all.
export function FallbackScene() {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const colors = ["#a83d0d", "#14663f", "#1c1712"];
  const bars: { x: number; w: number; h: number; c: string }[] = [];
  let x = 4;
  while (x < 96) {
    const w = 3 + rand() * 4;
    const h = 10 + rand() * 34;
    bars.push({ x, w, h, c: colors[Math.floor(rand() * colors.length)] });
    x += w + 2.4;
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
    >
      <rect width="100" height="100" fill="#faf4e8" />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={70 - b.h} width={b.w} height={b.h} fill={b.c} />
      ))}
      <rect y="70" width="100" height="0.4" fill="#1c1712" opacity="0.15" />
    </svg>
  );
}
