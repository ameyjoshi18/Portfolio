/* X-Ray — stage and interactions.
   One WebGL quad holds three aligned pictures: the surface (a shop counter), the inside (the same
   moment as glass and light) and the city (deep inside the machine). A lens of light follows the
   pointer and shows the inside; scrolling opens the lens, dives in, and at the end comes back out. */
(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia('(max-width: 820px)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;

  /* Local pictures load first. Sharper copies replace them when they arrive. */
  const CDN = 'https://res.cloudinary.com/lkt6kwju/image/upload/';
  const PICS = [
    { u: 'uA', local: 'img/surface.jpg', sharp: CDN + 'c_scale,w_2200,q_auto:good,f_auto/v1794883350/xray/surface.jpg' },
    { u: 'uB', local: 'img/inside.jpg',  sharp: CDN + 'c_scale,w_2200,q_auto:good,f_auto/v1794883411/xray/inside.jpg' },
    { u: 'uC', local: 'img/city.jpg',    sharp: CDN + 'q_auto:good,f_auto/v1794883576/xray/city.jpg' },
    { u: 'uD', local: 'img/depth.jpg' }
  ];

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FRAG = `
precision highp float;
uniform sampler2D uA,uB,uC,uD;
uniform vec2 uRes,uPtr,uPar;
uniform float uLens,uZoom,uCity,uCityZoom,uTime,uDim,uCut,uFlow;
const float IA=1.7778;
vec2 cover(vec2 s,vec2 f,float z){
  float sa=uRes.x/uRes.y;
  vec2 sc=sa>IA?vec2(1.,IA/sa):vec2(sa/IA,1.);
  sc/=1.06;
  vec2 c=clamp(f,sc*.5,1.-sc*.5);
  vec2 uv=c+(s-.5)*sc;
  return f+(uv-f)/z;
}
float flow(vec3 c,vec2 uv){
  float warm=smoothstep(.06,.4,c.r-c.b);
  float pulse=.5+.5*sin(dot(uv,vec2(42.,17.))-uTime*4.5);
  return 1.+warm*pulse*.65*uFlow;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 s=gl_FragCoord.xy/uRes; s.y=1.-s.y;
  float sa=uRes.x/uRes.y;
  vec2 F=vec2(.565,.66);
  float dep=texture2D(uD,cover(s,F,uZoom)).r;
  vec2 par=uPar*(dep-.45)*.024;

  vec2 p=(s-uPtr)*vec2(sa,1.);
  float dist=length(p), ang=atan(p.y,p.x);
  vec2 n=p/max(dist,1e-4);
  float R=uLens*(1.+.035*sin(ang*3.+uTime*1.1)+.02*sin(ang*7.-uTime*1.7));
  float m=1.-smoothstep(R-.004,R+.004,dist);
  float k=clamp(dist/max(R,1e-3),0.,1.);
  float small=clamp(1.6-uLens,0.,1.);
  vec2 off=-n*pow(k,5.)*.05*small*vec2(1./sa,1.);

  vec3 a=texture2D(uA,cover(s,F,uZoom)+par).rgb;
  vec2 ub=cover(s+off,F,uZoom)+par*1.4;
  float ca=pow(k,8.)*.006*small;
  vec3 b=vec3(texture2D(uB,ub+n*ca).r,texture2D(uB,ub).g,texture2D(uB,ub-n*ca).b);
  b*=flow(b,ub);
  vec3 col=mix(a,b,m);
  float ring=smoothstep(R-.014,R-.003,dist)*(1.-smoothstep(R-.001,R+.003,dist));
  col+=ring*vec3(1.,.86,.62)*.55*small;
  col*=1.-.3*(1.-m)*smoothstep(R+.09,R,dist)*small;

  if(uCity>.001){
    vec2 V=vec2(.5,.44);
    vec2 uc=cover(s,V,uCityZoom)+uPar*(s-.5)*.03;
    vec3 c=texture2D(uC,uc).rgb;
    c*=flow(c,uc*vec2(1.,2.2));
    float e=s.x+(s.y-.5)*.3;
    float edge=mix(-.25,1.25,uCut);
    float side=1.-smoothstep(edge-.003,edge+.003,e);
    c=mix(c,mix(c,c.brg,.9),side);
    c+=exp(-abs(e-edge)*70.)*vec3(1.,.92,.75);
    col=mix(col,c,uCity);
  }
  col*=1.-.38*pow(length(s-.5)*1.25,2.2);
  col*=1.-uDim;
  col+=(hash(gl_FragCoord.xy+uTime)-.5)*.022;
  gl_FragColor=vec4(col,1.);
}`;

  /* ---------- WebGL ---------- */
  const cv = d.getElementById('stage');
  let gl = null, U = {}, ready = 0;
  try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (e) {}
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const setTex = (unit, img) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  };
  if (gl) {
    try {
      const pr = gl.createProgram();
      gl.attachShader(pr, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(pr); gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uA', 'uB', 'uC', 'uD', 'uRes', 'uPtr', 'uPar', 'uLens', 'uZoom', 'uCity', 'uCityZoom', 'uTime', 'uDim', 'uCut', 'uFlow'].forEach(n => { U[n] = gl.getUniformLocation(pr, n); });
      PICS.forEach((pic, i) => {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([6, 10, 20]));
        gl.uniform1i(U[pic.u], i);
        const img = new Image();
        img.onload = () => {
          setTex(i, img);
          if (++ready === PICS.length) root.classList.add('gl');
          if (pic.sharp) {
            const hi = new Image(); hi.crossOrigin = 'anonymous';
            hi.onload = () => { try { setTex(i, hi); } catch (e) {} };
            hi.src = pic.sharp;
          }
        };
        img.src = pic.local;
      });
    } catch (e) { gl = null; }
  }

  /* ---------- scroll choreography ---------- */
  const $ = id => d.getElementById(id);
  const sReq = $('requirement'), sRails = $('rails'), sCut = $('cutover'), sEnd = $('contact');
  const tracks = [...d.querySelectorAll('.trks li')], goLine = d.querySelector('.go');
  const coreOld = $('core-old'), coreNew = $('core-new');
  let W = 1, H = 1;
  const state = { lens: .17, zoom: 1, city: 0, cityZoom: 1.6, dim: 0, cut: 0 };
  const ptr = { x: .62, y: .55, tx: .62, ty: .55, last: -1e9 };
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  const enter = el => { const r = el.getBoundingClientRect(); return clamp((H - r.top) / H); };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, narrow.matches ? 1.5 : 1.75);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    if (gl) gl.viewport(0, 0, cv.width, cv.height);
  };

  const choreograph = () => {
    const base = narrow.matches ? .2 : .17;
    const p1 = smooth(0, 1, enter(sReq)), p2 = smooth(.05, .95, enter(sRails)), p6 = enter(sEnd);
    const out = smooth(0, .55, p6), close = smooth(.4, 1, p6);
    state.lens = mix(base + p1 * p1 * 2.7, base * 1.15, close);
    state.zoom = mix(1 + .45 * p1 + 1.9 * p2, 1, out);
    state.city = p2 * (1 - out);
    state.cityZoom = mix(1.6, 1, p2) + .25 * out;
    state.dim = mix(mix(0, .5, p1), .12, close);
    const r = sCut.getBoundingClientRect(), span = r.height - H;
    const pc = span > 0 ? clamp(-r.top / span) : (r.top < 0 ? 1 : 0);
    state.cut = pc;
    const n = Math.floor(pc * 6.4);
    tracks.forEach((t, i) => t.classList.toggle('on', i < n));
    if (goLine) goLine.classList.toggle('on', pc > .86);
    if (coreNew) coreNew.style.opacity = smooth(.12, .3, pc);
    if (coreOld) coreOld.style.opacity = 1 - smooth(.78, .95, pc);
  };

  const frame = now => {
    requestAnimationFrame(frame);
    if (d.hidden) return;
    choreograph();
    const t = now / 1000;
    // the lens follows the pointer, and wanders round the terminal when left alone
    if (now - ptr.last > 2600 && !RM) {
      const cx = narrow.matches ? .5 : .6, cy = narrow.matches ? .62 : .6;
      ptr.tx = cx + Math.sin(t * .55) * (narrow.matches ? .2 : .13);
      ptr.ty = cy + Math.sin(t * .83 + 1.2) * .1;
    }
    const k = RM ? 1 : .09;
    ptr.x += (ptr.tx - ptr.x) * k; ptr.y += (ptr.ty - ptr.y) * k;
    par.x += (par.tx - par.x) * .06; par.y += (par.ty - par.y) * .06;
    if (!gl) return;
    gl.uniform2f(U.uRes, cv.width, cv.height);
    gl.uniform2f(U.uPtr, ptr.x, ptr.y);
    gl.uniform2f(U.uPar, par.x + (RM ? 0 : Math.sin(t * .4) * .25), par.y + (RM ? 0 : Math.cos(t * .33) * .2));
    gl.uniform1f(U.uLens, state.lens);
    gl.uniform1f(U.uZoom, state.zoom);
    gl.uniform1f(U.uCity, state.city);
    gl.uniform1f(U.uCityZoom, state.cityZoom);
    gl.uniform1f(U.uDim, state.dim);
    gl.uniform1f(U.uCut, state.cut);
    gl.uniform1f(U.uFlow, RM ? 0 : 1);
    gl.uniform1f(U.uTime, RM ? 0 : t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const point = (x, y) => { ptr.tx = x / W; ptr.ty = y / H; ptr.last = performance.now(); par.tx = (x / W - .5) * 2; par.ty = (y / H - .5) * 2; };
  addEventListener('pointermove', e => point(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', e => { const t = e.touches[0]; if (t) point(t.clientX, t.clientY); }, { passive: true });
  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);

  /* ---------- reveals ---------- */
  const rev = [...d.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !RM) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rev.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(el); });
  } else rev.forEach(el => el.classList.add('in'));

  /* ---------- glass: tilt and a highlight that follows the cursor ---------- */
  if (!RM && matchMedia('(hover:hover)').matches) {
    d.querySelectorAll('.glass').forEach(g => {
      g.addEventListener('pointermove', e => {
        const r = g.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        g.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); g.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        g.style.setProperty('--ry', ((x - .5) * 5).toFixed(2) + 'deg'); g.style.setProperty('--rx', ((.5 - y) * 5).toFixed(2) + 'deg');
      });
      g.addEventListener('pointerleave', () => { g.style.setProperty('--rx', '0deg'); g.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- rails: picker and the travelling packet ---------- */
  const picks = [...d.querySelectorAll('[data-pick]')], route = $('route');
  const ROUTES = {
    dmt:  { n: ['Customer', 'Agent', 'Bank', 'NPCI', 'Other bank'] },
    aeps: { n: ['Customer', 'Agent', 'Bank', 'NPCI', 'Customer’s bank'], up: 'UIDAI' },
    matm: { n: ['Customer', 'Agent', 'Bank', 'NPCI', 'Card’s bank'] }
  };
  let key = 'dmt', way = [], nodes = [], pk = null, t0 = 0, live = false;
  const build = () => {
    if (!route) return;
    const R = ROUTES[key], xs = [7, 28.5, 50, 71.5, 93];
    let h = `<i class="ln" style="left:${xs[0]}%;width:${xs[4] - xs[0]}%"></i>`;
    R.n.forEach((t, i) => { h += `<i class="nd${i === 0 ? ' first' : ''}${i === 4 ? ' last' : ''}" style="left:${xs[i]}%;top:50%"><span>${t}</span></i>`; });
    way = xs.map((x, i) => ({ x, y: 50, n: i }));
    if (R.up) {
      h += `<i class="up" style="left:${xs[3]}%;top:20%;height:30%"></i><i class="nd hi" style="left:${xs[3]}%;top:20%"><span>${R.up}</span></i>`;
      way.splice(4, 0, { x: xs[3], y: 20, n: 5 }, { x: xs[3], y: 50, n: 3 });
    }
    way = way.concat(way.slice(0, -1).reverse().filter(p => p.y === 50));
    route.innerHTML = h + '<i class="pk"></i>';
    nodes = [...route.querySelectorAll('.nd')]; pk = route.querySelector('.pk');
    pk.style.left = way[0].x + '%'; pk.style.top = '50%'; t0 = performance.now();
  };
  const run = now => {
    if (!live || !pk) return;
    const per = 560, total = (way.length - 1) * per + 800, t = (now - t0) % total;
    const seg = Math.min(way.length - 2, Math.floor(t / per)), f = Math.min(1, (t - seg * per) / per), e = f * f * (3 - 2 * f);
    const a = way[seg], b = way[seg + 1];
    pk.style.left = (a.x + (b.x - a.x) * e) + '%'; pk.style.top = (a.y + (b.y - a.y) * e) + '%';
    const at = f > .6 ? b.n : a.n;
    nodes.forEach((n, i) => n.classList.toggle('on', i === at));
    requestAnimationFrame(run);
  };
  if (route) {
    build();
    if (!RM && 'IntersectionObserver' in window) new IntersectionObserver(es => { const was = live; live = es[0].isIntersecting; if (live && !was) requestAnimationFrame(run); }).observe(route);
  }
  picks.forEach(b => b.addEventListener('click', () => {
    key = b.dataset.pick;
    picks.forEach(p => p.setAttribute('aria-pressed', String(p === b)));
    d.querySelectorAll('[data-rail]').forEach(p => { p.hidden = p.dataset.rail !== key; });
    build();
  }));
})();
