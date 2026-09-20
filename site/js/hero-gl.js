/* Hero background — raw WebGL, no library, ~4 KB.
   A slow flowing gradient that leans toward the pointer. Fails silently to CSS. */
(() => {
  const cv = document.getElementById('gl');
  if (!cv) return;
  const gl = cv.getContext('webgl', { antialias: false, alpha: true });
  if (!gl) { cv.style.background = 'radial-gradient(circle at 50% 60%, #e8853a22, #14100c))'; return; }

  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

  const FRAG = `
  precision highp float;
  uniform vec2 u_res; uniform float u_t; uniform vec2 u_m;

  vec3 hash3(vec2 p){
    vec3 q = vec3(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)));
    return fract(sin(q)*43758.5453);
  }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    float a = hash3(i).x, b = hash3(i+vec2(1,0)).x, c = hash3(i+vec2(0,1)).x, d = hash3(i+vec2(1,1)).x;
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    vec2 st = uv; st.x *= u_res.x/u_res.y;
    float t = u_t * 0.045;

    vec2 q = vec2(fbm(st + t), fbm(st + vec2(3.2,1.7) - t));
    vec2 r = vec2(fbm(st + 3.0*q + vec2(1.7,9.2) + 0.6*t),
                  fbm(st + 3.0*q + vec2(8.3,2.8) + 0.4*t));
    float f = fbm(st + 2.4*r);

    vec3 c1 = vec3(0.078,0.063,0.047);
    vec3 c2 = vec3(0.122,0.097,0.073);
    vec3 c3 = vec3(0.182,0.104,0.045);

    vec3 col = mix(c1, c2, clamp(f*f*2.1, 0.0, 1.0));
    col = mix(col, c3, clamp(length(r)*0.85, 0.0, 1.0));

    // pointer glow
    vec2 m = u_m; m.x *= u_res.x/u_res.y;
    float d = 1.0 - smoothstep(0.0, 0.55, distance(st, m));
    col += c3 * d * 0.16;

    // vignette + dither, so the gradient never bands
    col *= 1.0 - 0.55*pow(distance(uv, vec2(0.5)), 1.6);
    col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453) - 0.5) / 190.0;

    gl_FragColor = vec4(col, 1.0);
  }`;

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog); gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uT = gl.getUniformLocation(prog, 'u_t');
  const uM = gl.getUniformLocation(prog, 'u_m');

  const mouse = { x: 0.5, y: 0.5 }, cur = { ...mouse };
  addEventListener('pointermove', e => {
    mouse.x = e.clientX / innerWidth;
    mouse.y = 1 - e.clientY / innerHeight;
  }, { passive: true });

  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
    gl.viewport(0, 0, cv.width, cv.height);
    gl.uniform2f(uRes, cv.width, cv.height);
  };
  addEventListener('resize', size); size();

  let raf, running = true;
  const draw = now => {
    cur.x += (mouse.x - cur.x) * 0.05; cur.y += (mouse.y - cur.y) * 0.05;
    gl.uniform1f(uT, now * 0.001);
    gl.uniform2f(uM, cur.x, cur.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);

  // stop painting when the hero is off screen - it is a laptop, not a render farm
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(draw); }
    else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
  }, { threshold: 0.01 }).observe(cv);
})();
