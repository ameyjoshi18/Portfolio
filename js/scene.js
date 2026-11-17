/* Downstream — the landscape.
   Everything on screen is drawn here, in code: sky, sun and moon, five ranges of hills, trees, a
   viaduct, a town, a lighthouse, the river and one paper boat. Scrolling carries the boat downstream
   and moves the day from dawn to night. Nothing is a photograph or a generated image. */
(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const cv = d.getElementById('scene');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia('(max-width: 820px)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- noise ---------- */
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i) * (1 - u) + hash(i + 1) * u; };
  const fbm = (x, o) => { let a = .5, s = 0, n = 0; for (let k = 0; k < o; k++) { s += a * vnoise(x); n += a; x = x * 2.03 + 17.1; a *= .5; } return s / n; };

  /* ---------- colour ---------- */
  const rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const KEYS = [
    [0.00, '#3E5C9A', '#FFC2A0', '#8E9CC6', '#233B57', '#E7A590', '#33557A', '#FFE0A6'],
    [0.16, '#3F9BDC', '#D6F0F7', '#9CC6DA', '#24684F', '#86CBDD', '#237489', '#FFF6CF'],
    [0.40, '#2A86D6', '#C4E9F4', '#8FBFD3', '#2B7A4B', '#62BAD3', '#1C6C88', '#FFFBE6'],
    [0.56, '#3C8FD0', '#FFD9A0', '#9DB7C4', '#3B6B45', '#7FC0CC', '#2A6A80', '#FFF0C0'],
    [0.70, '#4A6FAE', '#FFA65E', '#C58A7C', '#3A2F44', '#F0A05C', '#54445C', '#FFCB6B'],
    [0.82, '#1C2A5A', '#D96A78', '#585A8E', '#171E3C', '#9C5674', '#18223F', '#FF9A76'],
    [0.93, '#060C22', '#18305E', '#20355F', '#071022', '#142C56', '#050C1E', '#EAF0FF'],
    [1.00, '#060C22', '#18305E', '#20355F', '#071022', '#142C56', '#050C1E', '#EAF0FF']
  ].map(k => [k[0], ...k.slice(1).map(rgb)]);
  const palette = p => {
    let i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
    const a = KEYS[i], b = KEYS[i + 1], t = clamp((p - a[0]) / (b[0] - a[0]));
    const m = j => mixc(a[j], b[j], t);
    return { st: m(1), sb: m(2), far: m(3), near: m(4), wt: m(5), wb: m(6), sun: m(7) };
  };

  /* ---------- world ---------- */
  const F = [.06, .12, .22, .4, .7];             // how fast each range slides past
  const AMP = [.40, .32, .25, .17, .10], MIN = [.10, .07, .05, .03, .014], FREQ = [1 / 520, 1 / 420, 1 / 330, 1 / 250, 1 / 190];
  const WORLD = 9000;
  let W = 1, H = 1, WL = 1, dpr = 1;
  const S = { p: 0, uw: 0, cut: 0, t: 0, px: 0, py: 0, tpx: 0, tpy: 0 };
  const ripples = [];
  let flag = '#FF5A3C';

  const env = p => { // how mountainous the land is along the journey
    const k = [[0, 1], [.25, .92], [.45, .6], [.6, .46], [.8, .3], [1, .1]];
    let i = 0; while (i < k.length - 2 && p > k[i + 1][0]) i++;
    return lerp(k[i][1], k[i + 1][1], smooth(k[i][0], k[i + 1][0], p));
  };
  const ridgeY = (i, xl, e) => {
    let n = fbm(xl * FREQ[i] + i * 31.7, i < 2 ? 4 : 3);
    if (i < 3) n = 1 - Math.abs(2 * n - 1) * .9;           // far ranges are peaked
    return WL - H * (MIN[i] + AMP[i] * e * n);
  };

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; WL = H * .76;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  };

  /* ---------- pieces ---------- */
  const pine = (x, y, h, col) => {
    ctx.fillStyle = col; ctx.beginPath();
    for (let k = 0; k < 3; k++) { const w = h * (.42 - k * .09), yy = y - h * (.28 * k); ctx.moveTo(x - w, yy); ctx.lineTo(x, yy - h * .5); ctx.lineTo(x + w, yy); }
    ctx.fill(); ctx.fillRect(x - 1, y - 2, 2, 4);
  };
  const leafy = (x, y, h, col, sway) => {
    ctx.fillStyle = col; ctx.fillRect(x - 1.2, y - h * .5, 2.4, h * .5);
    ctx.beginPath(); ctx.arc(x + sway, y - h * .68, h * .36, 0, 6.2832); ctx.arc(x - h * .2 + sway, y - h * .5, h * .26, 0, 6.2832); ctx.arc(x + h * .22 + sway, y - h * .52, h * .24, 0, 6.2832); ctx.fill();
  };
  const cloud = (x, y, s, col) => {
    ctx.fillStyle = col; ctx.beginPath();
    ctx.ellipse(x, y, s * .7, s * .26, 0, 0, 6.2832); ctx.ellipse(x + s * .8, y - s * .14, s * .8, s * .34, 0, 0, 6.2832); ctx.ellipse(x + s * 1.7, y, s * .75, s * .24, 0, 0, 6.2832);
    ctx.rect(x - s * .1, y, s * 1.9, s * .2); ctx.ellipse(x + s * .85, y + s * .2, s * 1.25, s * .12, 0, 0, 6.2832); ctx.fill();
  };
  const boat = (x, y, s, night) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(S.t * 1.3) * .045);
    ctx.globalAlpha = .22; ctx.fillStyle = '#04121f'; ctx.beginPath(); ctx.ellipse(0, s * .34, s * 1.05, s * .12, 0, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.lineTo(s * .58, s * .36); ctx.lineTo(-s * .58, s * .36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#DDE6EE'; ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(0, 0); ctx.lineTo(-s * .2, s * .36); ctx.lineTo(-s * .58, s * .36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(-s * .42, 0); ctx.lineTo(0, -s * .86); ctx.lineTo(s * .42, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#C9D6E2'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s * .86); ctx.lineTo(s * .42, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#33475a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, -s * .86); ctx.lineTo(0, -s * 1.3); ctx.stroke();
    ctx.fillStyle = flag; ctx.beginPath(); ctx.moveTo(0, -s * 1.3); ctx.lineTo(s * .34 + Math.sin(S.t * 5) * 1.5, -s * 1.2); ctx.lineTo(0, -s * 1.08); ctx.closePath(); ctx.fill();
    if (night > .02) {
      const g = ctx.createRadialGradient(-s * .1, -s * .1, 0, -s * .1, -s * .1, s * 2.4);
      g.addColorStop(0, `rgba(255,200,110,${.55 * night})`); g.addColorStop(1, 'rgba(255,200,110,0)');
      ctx.fillStyle = g; ctx.fillRect(-s * 3, -s * 3, s * 6, s * 6);
      ctx.fillStyle = `rgba(255,224,160,${night})`; ctx.beginPath(); ctx.arc(-s * .1, -s * .1, s * .09, 0, 6.2832); ctx.fill();
    }
    ctx.restore();
  };

  const viaduct = (cx, deckY, width, pal, cut) => {
    const n = 5, span = width / n, x0 = cx - width / 2;
    const stone = css(mixc([201, 124, 92], pal.near, .22)), steel = css(mixc(pal.sun, [255, 255, 255], .5));
    for (let i = 0; i < n; i++) {
      const xa = x0 + i * span, t = smooth(0, 1, cut * 6.4 - i - .7);
      if (t < 1) { // the old stone arch
        ctx.globalAlpha = 1 - t; ctx.fillStyle = stone; ctx.beginPath();
        ctx.rect(xa, deckY, span, WL - deckY + 4);
        ctx.moveTo(xa + span * .86, WL + 4); ctx.arc(xa + span / 2, WL + 4, span * .36, 0, Math.PI, true); ctx.fill('evenodd');
        ctx.fillRect(xa, deckY - 6, span, 6);
      }
      if (t > 0) { // the new span rises into place
        ctx.globalAlpha = t; ctx.strokeStyle = steel; ctx.fillStyle = steel; ctx.lineWidth = 3;
        const lift = (1 - t) * 26;
        ctx.fillRect(xa, deckY - 4 + lift, span, 5);
        ctx.beginPath(); ctx.moveTo(xa, deckY + lift); ctx.quadraticCurveTo(xa + span / 2, deckY - span * .62 + lift, xa + span, deckY + lift); ctx.stroke();
        ctx.lineWidth = 1.2; ctx.beginPath();
        for (let k = 1; k < 6; k++) { const u = k / 6, hx = xa + span * u, hy = deckY - span * .62 * 2 * u * (1 - u) * 1 + lift; ctx.moveTo(hx, deckY + lift); ctx.lineTo(hx, hy); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = css(mixc(pal.near, pal.far, .25));
    for (let i = 0; i <= n; i++) ctx.fillRect(x0 + i * span - 5, deckY - 8, 10, WL - deckY + 12);
  };

  const lighthouse = (x, y, h, night, pal) => {
    if (night > .02 && !RM) {
      const a = S.t * .7;
      for (const s of [1, -1]) {
        const dir = Math.cos(a) * s, len = W * .7 * Math.abs(dir) + 40;
        const g = ctx.createLinearGradient(x, 0, x + dir * len, 0);
        g.addColorStop(0, `rgba(255,236,170,${.5 * night})`); g.addColorStop(1, 'rgba(255,236,170,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y - h * .93); ctx.lineTo(x + dir * len, y - h * .93 - len * .12); ctx.lineTo(x + dir * len, y - h * .93 + len * .12); ctx.closePath(); ctx.fill();
      }
    }
    ctx.fillStyle = '#F4F7FA'; ctx.beginPath(); ctx.moveTo(x - h * .13, y); ctx.lineTo(x - h * .08, y - h * .86); ctx.lineTo(x + h * .08, y - h * .86); ctx.lineTo(x + h * .13, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#E2452F'; ctx.fillRect(x - h * .115, y - h * .34, h * .23, h * .12); ctx.fillRect(x - h * .095, y - h * .68, h * .19, h * .1);
    ctx.fillStyle = css(mixc(pal.near, [0, 0, 0], .2)); ctx.fillRect(x - h * .11, y - h * .9, h * .22, h * .04);
    ctx.fillStyle = night > .1 ? '#FFE9A8' : '#C9E4F2'; ctx.fillRect(x - h * .06, y - h * .99, h * .12, h * .09);
    ctx.fillStyle = '#E2452F'; ctx.beginPath(); ctx.moveTo(x - h * .09, y - h * .99); ctx.lineTo(x, y - h * 1.1); ctx.lineTo(x + h * .09, y - h * .99); ctx.closePath(); ctx.fill();
  };

  /* ---------- one frame ---------- */
  const draw = () => {
    const p = S.p, pal = palette(p), e = env(p), t = S.t;
    const night = smooth(.74, .92, p), day = 1 - smooth(.66, .8, p);
    const camX = p * WORLD + S.px * 26;
    const sink = S.uw * H * .6;                         // how far the camera has gone under
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // sky
    let g = ctx.createLinearGradient(0, 0, 0, WL);
    g.addColorStop(0, css(pal.st)); g.addColorStop(1, css(pal.sb));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    ctx.save(); ctx.translate(0, -sink);

    if (night > .01) { // stars
      for (let i = 0; i < 130; i++) {
        const x = hash(i * 3.1) * W, y = hash(i * 7.7) * WL * .8, tw = RM ? 1 : .6 + .4 * Math.sin(t * (1 + hash(i) * 2) + i);
        ctx.fillStyle = `rgba(255,255,255,${night * tw * (.35 + hash(i * 1.3) * .65)})`;
        ctx.fillRect(x, y, hash(i * 9.1) > .85 ? 2 : 1.2, hash(i * 9.1) > .85 ? 2 : 1.2);
      }
    }
    // sun, then moon
    const sd = clamp(p / .74), sx = W * (.16 + .68 * sd), sy = WL - Math.sin(Math.PI * sd) * H * .56 + H * .02;
    if (day > .01 || p < .8) {
      const r = Math.max(26, Math.min(W, H) * .055);
      g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 6);
      g.addColorStop(0, css(pal.sun, .55)); g.addColorStop(1, css(pal.sun, 0));
      ctx.fillStyle = g; ctx.fillRect(sx - r * 6, sy - r * 6, r * 12, r * 12);
      ctx.fillStyle = css(pal.sun); ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.2832); ctx.fill();
    }
    if (night > .01) {
      const mx = W * (narrow.matches ? .24 : .52), my = H * (narrow.matches ? lerp(.66, .58, night) : lerp(.5, .2, night)), r = Math.max(22, Math.min(W, H) * .045);
      g = ctx.createRadialGradient(mx, my, 0, mx, my, r * 5);
      g.addColorStop(0, `rgba(210,225,255,${.35 * night})`); g.addColorStop(1, 'rgba(210,225,255,0)');
      ctx.fillStyle = g; ctx.fillRect(mx - r * 5, my - r * 5, r * 10, r * 10);
      ctx.fillStyle = `rgba(238,243,255,${night})`; ctx.beginPath(); ctx.arc(mx, my, r, 0, 6.2832); ctx.fill();
      ctx.fillStyle = css(pal.st, night); ctx.beginPath(); ctx.arc(mx + r * .42, my - r * .2, r * .86, 0, 6.2832); ctx.fill();
    }
    // clouds
    const cc = css(mixc([255, 255, 255], pal.sb, .3 + night * .45), .62 - night * .42);
    for (let i = 0; i < 7; i++) {
      const sp = .03 + hash(i * 5.3) * .06, span = W + 500;
      const x = ((hash(i * 2.9) * span - camX * sp - t * (4 + i)) % span + span) % span - 250;
      cloud(x, H * (.06 + hash(i * 4.1) * .26), 40 + hash(i * 6.7) * 70, cc);
    }
    // birds by day
    if (day > .05 && p > .06 && p < .66) {
      ctx.strokeStyle = css(pal.near, .7 * day); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      const bx = ((t * 22 - camX * .05) % (W + 300) + W + 300) % (W + 300) - 150, by = H * .2 + Math.sin(t * .4) * 14;
      for (let i = 0; i < 7; i++) {
        const x = bx - Math.abs(i - 3) * 16 + (i % 2) * 3, y = by + (i - 3) * 9, f = RM ? 3 : Math.sin(t * 7 + i) * 4;
        ctx.beginPath(); ctx.moveTo(x - 7, y - f); ctx.quadraticCurveTo(x - 3, y - 2, x, y); ctx.quadraticCurveTo(x + 3, y - 2, x + 7, y - f); ctx.stroke();
      }
    }

    // five ranges, far to near
    for (let i = 0; i < 5; i++) {
      const col = mixc(pal.far, pal.near, i / 4), off = camX * F[i];
      const step = i < 3 ? 7 : 5;
      ctx.beginPath(); ctx.moveTo(0, WL + 4);
      let top = WL;
      for (let x = 0; x <= W + step; x += step) { const y = ridgeY(i, x + off, e); if (y < top) top = y; ctx.lineTo(x, y); }
      ctx.lineTo(W + step, WL + 4); ctx.closePath();
      g = ctx.createLinearGradient(0, top, 0, WL);
      g.addColorStop(0, css(col)); g.addColorStop(1, css(mixc(col, pal.sb, i < 4 ? .5 : .22)));
      ctx.fillStyle = g; ctx.fill();

      if (i === 2) { // the viaduct stands between the third and fourth range
        const bx = W * (narrow.matches ? .5 : .66) + (.53 - p) * WORLD * F[3] * .3;
        const bw = Math.min(W * .92, 760);
        if (p > .36 && p < .72 && bx > -bw && bx < W + bw) viaduct(bx, WL - H * .105, bw, pal, S.cut);
      }
      if (i >= 3) { // trees, a town, a lighthouse
        const gap = i === 3 ? 38 : 54, scale = i === 3 ? .62 : 1, tc = css(mixc(col, [4, 14, 22], .28));
        const j0 = Math.floor(off / gap) - 1, j1 = Math.floor((off + W) / gap) + 1, span = WORLD * F[i] + W;
        for (let j = j0; j <= j1; j++) {
          const r = hash(j * 7.31 + i * 13), xl = j * gap + (hash(j * 3.3) - .5) * gap * .7, wq = xl / span;
          const x = xl - off, y = ridgeY(i, xl, e) + 3;
          if (i === 4 && wq > .66 && wq < .8 && r > .35) { // town
            const hw = 11 + hash(j * 1.7) * 9, hh = 12 + hash(j * 2.3) * 14;
            ctx.fillStyle = css(mixc(pal.near, pal.far, .22)); ctx.fillRect(x - hw / 2, y - hh, hw, hh + 3);
            ctx.fillStyle = css(mixc(pal.near, [226, 69, 47], .45)); ctx.beginPath(); ctx.moveTo(x - hw / 2 - 2, y - hh); ctx.lineTo(x, y - hh - hw * .5); ctx.lineTo(x + hw / 2 + 2, y - hh); ctx.closePath(); ctx.fill();
            ctx.fillStyle = `rgba(255,214,130,${.15 + .85 * smooth(.66, .8, p)})`; ctx.fillRect(x - 2.5, y - hh * .62, 5, 5);
            continue;
          }
          if (wq > .86 || r < .42) continue;
          const h = (20 + hash(j * 5.9) * 26) * scale;
          if (wq < .44 + hash(j) * .1) pine(x, y, h, tc); else leafy(x, y, h * .9, tc, RM ? 0 : Math.sin(t * 1.4 + j) * 1.1);
        }
        if (i === 4) { const lx = W * .74 + (1 - p) * WORLD * F[4]; if (lx > -80 && lx < W + 80) lighthouse(lx, ridgeY(4, lx + off, e) + 4, Math.min(H * .26, 190), night, pal); }
      }
    }
    ctx.restore();

    // water
    const wl = WL - sink;
    g = ctx.createLinearGradient(0, wl, 0, Math.max(H, wl + 1));
    const deepTop = mixc(pal.wt, [46, 157, 176], S.uw), deepBot = mixc(pal.wb, [4, 30, 46], S.uw);
    g.addColorStop(0, css(deepTop)); g.addColorStop(1, css(deepBot));
    ctx.fillStyle = g; ctx.fillRect(0, wl, W, H - wl + 2);

    if (S.uw < .98) { // surface details
      const a = 1 - S.uw;
      // the sun's road on the water
      const lx = night > .5 ? W * (narrow.matches ? .24 : .52) : sx, lc = night > .5 ? [220, 232, 255] : pal.sun;
      for (let k = 0; k < 16; k++) {
        const y = wl + 5 + k * k * .9 + k * 4, w = (10 + k * 5) * (1 + .3 * Math.sin(t * 2 + k * 1.7));
        if (y > H) break;
        ctx.fillStyle = css(lc, a * (.55 - k * .028)); ctx.fillRect(lx - w / 2 + Math.sin(t * 1.5 + k) * 4, y, w, 2.2);
      }
      ctx.strokeStyle = css(mixc(pal.wt, [255, 255, 255], .55), .5 * a); ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      for (let r = 0; r < 6; r++) {
        const y = wl + 14 + r * r * 5 + r * 9; if (y > H) break;
        const gap = 90 + r * 34, sh = ((camX * (.8 + r * .12) + t * (14 + r * 5)) % gap);
        ctx.beginPath();
        for (let x = -sh; x < W + gap; x += gap) { const xx = x + hash(r * 9 + Math.floor((x + sh + camX) / gap)) * 30; ctx.moveTo(xx, y); ctx.quadraticCurveTo(xx + 12 + r * 2, y - 2.5, xx + 24 + r * 5, y); }
        ctx.stroke();
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i], age = t - rp.t; if (age > 2.4) { ripples.splice(i, 1); continue; }
        for (let k = 0; k < 3; k++) { const rr = (age - k * .22) * 46; if (rr <= 0) continue; ctx.strokeStyle = `rgba(255,255,255,${(1 - age / 2.4) * .55 * a})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(rp.x, rp.y - sink, rr, rr * .3, 0, 0, 6.2832); ctx.stroke(); }
      }
      // reeds in the near corners
      const rc = css(mixc(pal.near, [3, 10, 16], .45), a);
      ctx.strokeStyle = rc; ctx.lineCap = 'round';
      for (const side of [0, 1]) for (let k = 0; k < 9; k++) {
        const bx = side ? W - 14 - k * 13 + ((camX * 1.5) % 40) * 0 : 10 + k * 12, bh = H * (.1 + hash(k * 3 + side) * .13), sw = RM ? 0 : Math.sin(t * 1.2 + k * .7) * 7;
        ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(bx, H + 4); ctx.quadraticCurveTo(bx + sw * .3, H - bh * .6, bx + sw + (side ? -8 : 8), H - bh); ctx.stroke();
      }
    }

    // the boat
    const bx = W * (narrow.matches ? .3 : .26), bs = Math.max(20, Math.min(W, H) * .034);
    const by = wl + H * .075 + (RM ? 0 : Math.sin(t * 1.3) * 2.6);
    if (S.uw < .5) {
      boat(bx, by, bs, night);
      ctx.strokeStyle = `rgba(255,255,255,${.5 * (1 - S.uw * 2)})`; ctx.lineWidth = 1.4;
      for (let k = 0; k < 3; k++) { const o = ((t * 26 + k * 22) % 66); ctx.globalAlpha = 1 - o / 66; ctx.beginPath(); ctx.moveTo(bx - bs - o, by + bs * .36); ctx.quadraticCurveTo(bx - bs - o - 8, by + bs * .3, bx - bs - o - 16, by + bs * .4); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }

    // under the water
    if (S.uw > .01) {
      const u = S.uw;
      ctx.save(); ctx.beginPath(); ctx.rect(0, wl, W, H - wl); ctx.clip();
      for (let i = 0; i < 6; i++) { // light coming down
        const x = W * (.08 + i * .17) + Math.sin(t * .5 + i) * 26;
        g = ctx.createLinearGradient(0, wl, 0, H);
        g.addColorStop(0, `rgba(190,240,245,${.16 * u})`); g.addColorStop(1, 'rgba(190,240,245,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, wl); ctx.lineTo(x + 46, wl); ctx.lineTo(x + 150, H); ctx.lineTo(x - 30, H); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = `rgba(4,22,34,${.75 * u})`; ctx.beginPath(); ctx.ellipse(bx, wl + 3, bs * 1.1, bs * .34, 0, 0, Math.PI); ctx.fill(); // the hull from below
      for (let i = 0; i < 22; i++) { // fish
        const sp = 16 + hash(i * 2.1) * 30, dir = hash(i * 8.3) > .5 ? 1 : -1, span = W + 200;
        const x = ((hash(i * 4.4) * span + dir * t * sp) % span + span) % span - 100;
        const y = wl + (H - wl) * (.14 + hash(i * 6.2) * .72) + Math.sin(t + i) * 6, s = 5 + hash(i * 3.9) * 9;
        ctx.fillStyle = `rgba(${200 - i * 4},${240 - i * 3},245,${(.25 + hash(i) * .4) * u})`;
        ctx.beginPath(); ctx.ellipse(x, y, s, s * .38, 0, 0, 6.2832); ctx.moveTo(x - dir * s * .8, y); ctx.lineTo(x - dir * s * 1.7, y - s * .45); ctx.lineTo(x - dir * s * 1.7, y + s * .45); ctx.closePath(); ctx.fill();
      }
      for (let i = 0; i < 26; i++) { // bubbles
        const x = hash(i * 5.5) * W + Math.sin(t + i) * 8, y = H - ((t * (18 + hash(i) * 26) + hash(i * 3) * H) % (H - wl + 40));
        ctx.strokeStyle = `rgba(230,250,255,${.4 * u})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 1.5 + hash(i * 2) * 3, 0, 6.2832); ctx.stroke();
      }
      // the riverbed and its weeds
      ctx.fillStyle = `rgba(3,18,28,${u})`; ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, H - 18 - fbm((x + camX * .5) / 160, 3) * H * .09 * u);
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `rgba(20,92,84,${u})`; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = 0; i < Math.ceil(W / 46); i++) {
        const x = i * 46 + hash(i * 7) * 30, h = H * (.06 + hash(i * 3) * .12) * u, base = H - 16;
        ctx.beginPath(); ctx.moveTo(x, base); ctx.bezierCurveTo(x + Math.sin(t + i) * 12, base - h * .4, x - Math.sin(t * .8 + i) * 12, base - h * .7, x + Math.sin(t * 1.1 + i) * 9, base - h); ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = `rgba(255,255,255,${.6 * u})`; ctx.lineWidth = 2; ctx.beginPath(); // the surface seen from underneath
      for (let x = 0; x <= W; x += 14) ctx.lineTo(x, wl + Math.sin(x * .03 + t * 2) * 2.4);
      ctx.stroke();
    }

    // fireflies after dark
    if (night > .05 && S.uw < .3) for (let i = 0; i < 34; i++) {
      const x = (hash(i * 3.7) * W + Math.sin(t * .5 + i) * 30 + W) % W, y = H * (.45 + hash(i * 9.9) * .5) + Math.cos(t * .7 + i * 2) * 16;
      const a = night * (RM ? .7 : .35 + .65 * Math.abs(Math.sin(t * 1.6 + i)));
      g = ctx.createRadialGradient(x, y, 0, x, y, 9); g.addColorStop(0, `rgba(255,224,140,${a})`); g.addColorStop(1, 'rgba(255,224,140,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 9, y - 9, 18, 18);
    }
  };

  /* ---------- scroll drives the journey ---------- */
  const $ = id => d.getElementById(id);
  const sec = ['top', 'requirement', 'rails', 'cutover', 'know', 'builds', 'contact'].map($);
  const ANCH = [0, .15, .33, .48, .58, .76, .92];
  const spans = [...d.querySelectorAll('.spans li')], goLine = d.querySelector('.go');
  let mode = '';
  const read = () => {
    const y = scrollY + H * .35, tops = sec.map(s => s.getBoundingClientRect().top + scrollY);
    const endY = d.documentElement.scrollHeight - H * .65;
    const pts = tops.map((ty, i) => [ty, ANCH[i]]).concat([[endY, 1]]);
    let i = 0; while (i < pts.length - 2 && y > pts[i + 1][0]) i++;
    S.p = clamp(lerp(pts[i][1], pts[i + 1][1], clamp((y - pts[i][0]) / Math.max(1, pts[i + 1][0] - pts[i][0]))));
    const rk = sec[4].getBoundingClientRect(), rb = sec[5].getBoundingClientRect();
    S.uw = smooth(H * .8, H * .25, rk.top) * (1 - smooth(H * 1.05, H * .5, rb.top));
    const rc = sec[3].getBoundingClientRect(), sp = rc.height - H;
    S.cut = sp > 0 ? clamp(-rc.top / sp) : (rc.top < 0 ? 1 : 0);
    const n = Math.floor(S.cut * 6.3);
    spans.forEach((li, k) => li.classList.toggle('on', k < n));
    if (goLine) goLine.classList.toggle('on', S.cut > .86);
    const m = S.uw > .45 ? 'deep' : S.p > .74 ? 'night' : 'day';
    if (m !== mode) { mode = m; root.dataset.time = m; }
  };

  const frame = now => {
    requestAnimationFrame(frame);
    if (d.hidden) return;
    if (!RM) S.t = now / 1000;
    S.px += (S.tpx - S.px) * .06; S.py += (S.tpy - S.py) * .06;
    read(); draw();
  };
  addEventListener('resize', resize);
  addEventListener('pointermove', e => { S.tpx = (e.clientX / W - .5) * 2; S.tpy = (e.clientY / H - .5) * 2; }, { passive: true });
  addEventListener('pointerdown', e => {
    if (e.target.closest('a,button,.card')) return;
    if (e.clientY > WL - S.uw * H * .6 && S.uw < .5 && !RM) ripples.push({ x: e.clientX, y: e.clientY + S.uw * H * .6, t: S.t });
  }, { passive: true });
  resize();
  requestAnimationFrame(frame);

  /* ---------- page behaviour ---------- */
  const rev = [...d.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !RM) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rev.forEach(el => io.observe(el));
  } else rev.forEach(el => el.classList.add('in'));

  const FLAGS = { dmt: '#FF5A3C', aeps: '#FFC531', matm: '#2FD3A6' };
  const picks = [...d.querySelectorAll('[data-pick]')];
  picks.forEach(b => b.addEventListener('click', () => {
    picks.forEach(q => q.setAttribute('aria-pressed', String(q === b)));
    d.querySelectorAll('[data-rail]').forEach(el => { el.hidden = el.dataset.rail !== b.dataset.pick; });
    flag = FLAGS[b.dataset.pick] || flag;
  }));
})();
