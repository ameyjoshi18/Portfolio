/* Two Sides — one script for every page.
   1. Wipes: content arrives from the seam.
   2. Rails: switch between DMT, AePS and micro-ATM.
   3. Cutover: scroll moves the seam across the screen.
   4. Thread: the red line that stitches the two fields together, and can be plucked. */
(() => {
  const d = document;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia('(max-width: 820px)');

  /* ---------- 1. wipes ---------- */
  const wipes = [...d.querySelectorAll('.split:not(.hero) > .l > *, .split:not(.hero) > .r > *, .end > *')];
  wipes.forEach(el => el.classList.add('w'));
  let pending = RM ? [] : wipes.slice();
  if (RM) wipes.forEach(el => el.classList.add('in'));
  const reveal = () => {
    if (!pending.length) return;
    const line = innerHeight * 0.93;
    pending = pending.filter(el => {
      const r = el.getBoundingClientRect();
      if (r.top < line && r.bottom > -40) { el.classList.add('in'); return false; }
      if (r.bottom <= -40) { el.classList.add('in'); return false; }
      return true;
    });
  };

  /* ---------- 2. rails ---------- */
  const picks = [...d.querySelectorAll('[data-pick]')];
  const showRail = key => {
    picks.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pick === key)));
    d.querySelectorAll('[data-rail]').forEach(p => {
      const on = p.dataset.rail === key;
      p.hidden = !on;
      if (p.classList.contains('legs')) {
        p.classList.remove('go');
        if (on) { void p.offsetWidth; p.classList.add('go'); }
      }
    });
    kick(300);
  };
  picks.forEach(b => b.addEventListener('click', () => showRail(b.dataset.pick)));

  /* ---------- 3. cutover ---------- */
  const cut = d.getElementById('cutover');
  let tracks = [];
  if (cut) {
    const oldLayer = cut.querySelector('.cut-layer');
    const newLayer = oldLayer.cloneNode(true);
    newLayer.classList.replace('old', 'new');
    newLayer.setAttribute('aria-hidden', 'true');
    newLayer.inert = true;
    oldLayer.after(newLayer);
    tracks = [...cut.querySelectorAll('.trk')];
  }
  const cutUpdate = () => {
    if (!cut) return;
    let p = 1, c = 50;
    if (!RM) {
      const r = cut.getBoundingClientRect();
      const span = r.height - innerHeight;
      p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      c = 86 - 72 * e;
    }
    cut.dataset.s = c;
    cut.style.setProperty('--cut', c + '%');
    const n = Math.floor(p * 7.2);
    tracks.forEach(t => t.classList.toggle('on', +t.dataset.i < n));
  };

  /* ---------- 4. thread ---------- */
  const cv = d.getElementById('thread');
  if (!cv) { const f = () => { cutUpdate(); reveal(); }; f(); addEventListener('scroll', f, { passive: true }); return; }
  const ctx = cv.getContext('2d');
  const segs = [...d.querySelectorAll('[data-s]')];
  const seam0 = d.getElementById('seam0');
  const RED = '#FF4127', INK = '#0D0D10';
  const EDGE = 22;           // where the thread runs on narrow screens
  let W = 0, H = 0, raf = 0, until = 0;
  const ptr = { x: 0, y: 0, on: false };
  let grabbed = false, bow = 0;
  const waves = [];

  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = d.documentElement.clientWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    kick(200);
  };

  // The seam as a list of corner points, in viewport coordinates.
  const corners = () => {
    const m = narrow.matches, P = [];
    segs.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const x = (m && s !== cut) ? EDGE : r.left + r.width * (+s.dataset.s) / 100;
      let top = r.top;
      if (i === 0 && m && seam0) {
        top = seam0.getBoundingClientRect().top;
        P.push({ x: W, y: top, b: false }, { x: EDGE, y: top, b: false });
      }
      const b = s.hasAttribute('data-broken');
      P.push({ x, y: top, b }, { x, y: r.bottom, b });
    });
    return P;
  };

  const seamXAt = (P, y) => {
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1];
      if (a.y === b.y) continue;
      if (y >= a.y && y <= b.y) return a.x + (b.x - a.x) * (y - a.y) / (b.y - a.y);
    }
    return null;
  };

  const draw = now => {
    ctx.clearRect(0, 0, W, H);
    const P = corners();
    if (!P.length) return;

    // grab / release
    if (!RM && ptr.on) {
      const sx = seamXAt(P, ptr.y);
      const dx = sx === null ? 999 : ptr.x - sx;
      if (Math.abs(dx) < 64) { grabbed = true; bow = dx * 0.85; }
      else if (grabbed) { waves.push({ y: ptr.y + scrollY, a: bow * 0.8, t: now }); grabbed = false; bow = 0; }
    } else if (grabbed) {
      waves.push({ y: ptr.y + scrollY, a: bow * 0.8, t: now }); grabbed = false; bow = 0;
    }
    for (let i = waves.length - 1; i >= 0; i--) if (now - waves[i].t > 2300) waves.splice(i, 1);

    // sample the visible part of the seam
    const S = [];
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1];
      if (Math.max(a.y, b.y) < -60 || Math.min(a.y, b.y) > H + 60) continue;
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const n = Math.max(1, Math.ceil(len / 9));
      const k0 = a.y === b.y ? 0 : Math.max(0, Math.floor((-60 - a.y) / (b.y - a.y) * n));
      const k1 = a.y === b.y ? n : Math.min(n, Math.ceil((H + 60 - a.y) / (b.y - a.y) * n));
      for (let k = k0; k <= k1; k++) {
        const t = k / n;
        let x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        if (!RM && a.y !== b.y) {
          if (grabbed) x += bow * Math.exp(-((y - ptr.y) ** 2) / 9000);
          const yd = y + scrollY;
          for (const w of waves) {
            const dd = Math.abs(yd - w.y), age = (now - w.t) / 1000;
            x += w.a * Math.exp(-age * 2.4) * Math.cos(age * 19 - dd * 0.03) * Math.exp(-dd / 320);
          }
        }
        S.push({ x, y, k, v: a.x === b.x, b: a.b && b.b });
      }
    }
    if (S.length < 2) return;

    // how far the stitching has reached
    const max = d.documentElement.scrollHeight - H;
    const prog = max > 0 ? Math.min(1, scrollY / max) : 1;
    const head = RM ? Infinity : H * (0.5 + 0.5 * prog);

    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const stroke = (from, to, done, broken) => {
      ctx.beginPath();
      ctx.moveTo(S[from].x, S[from].y);
      for (let i = from + 1; i <= to; i++) ctx.lineTo(S[i].x, S[i].y);
      ctx.strokeStyle = RED;
      ctx.globalAlpha = done ? 1 : 0.6;
      ctx.lineWidth = done ? 3 : 2;
      ctx.setLineDash(broken ? [3, 10] : done ? [] : [1, 8]);
      ctx.stroke();
    };
    let start = 0;
    const key = s => (s.y <= head ? 1 : 0) + (s.b ? 2 : 0);
    for (let i = 1; i <= S.length; i++) {
      if (i === S.length || key(S[i]) !== key(S[start])) {
        stroke(start, Math.min(i, S.length - 1), S[start].y <= head, S[start].b);
        start = i;
      }
    }
    ctx.setLineDash([]); ctx.globalAlpha = 1;

    // the stitches
    ctx.beginPath();
    let last = null;
    for (const s of S) {
      if (s.y > head) break;
      last = s;
      if (s.v && !s.b && s.k % 3 === 0) { ctx.moveTo(s.x - 6, s.y + 4); ctx.lineTo(s.x + 6, s.y - 4); }
    }
    ctx.lineWidth = 2; ctx.strokeStyle = RED; ctx.stroke();

    // the needle, and the knot at the end
    const dot = (x, y, r) => {
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832);
      ctx.fillStyle = RED; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    };
    const end = P[P.length - 1];
    if (end.y <= head + 1 && end.y > -20 && end.y < H + 20) dot(end.x, end.y, 9);
    else if (last && !RM) dot(last.x, last.y, 6.5);
  };

  const frame = now => {
    raf = 0;
    cutUpdate();
    reveal();
    draw(now);
    if (waves.length || grabbed || now < until) raf = requestAnimationFrame(frame);
  };
  function kick(ms = 0) {
    until = Math.max(until, performance.now() + ms);
    if (!raf) raf = requestAnimationFrame(frame);
  }

  addEventListener('scroll', () => kick(), { passive: true });
  addEventListener('resize', size);
  addEventListener('load', () => kick(400));
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => kick(400));
  if (!RM) {
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true; kick();
    }, { passive: true });
    d.documentElement.addEventListener('pointerleave', () => { ptr.on = false; kick(); });
    addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      const sx = seamXAt(corners(), e.clientY);
      if (sx !== null && Math.abs(e.clientX - sx) < 70) {
        waves.push({ y: e.clientY + scrollY, a: e.clientX < sx ? 26 : -26, t: performance.now() });
        kick();
      }
    }, { passive: true });
  }
  size();
})();
