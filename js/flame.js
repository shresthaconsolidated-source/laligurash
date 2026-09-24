/* A candle flame, drawn live.

   Why not the photographed flames: most of them burned in front of cream wax, so lifted
   out of the photo they come away blue, and a still photograph cannot flicker. This one
   is built the way a flame actually looks - a faint blue cup at the wick, an orange skin,
   a yellow body and a near-white core - and it breathes, sways and leans into motion.

   Each layer is a soft teardrop blurred on a small scratch canvas, so the blur costs the
   size of a flame, not the size of the screen. */

const TAU = Math.PI * 2;

// Smooth, never-repeating wobble: three incommensurate sines. Cheap, and good enough that
// no two flames on the page ever move in step.
export const wobble = (t, s) =>
  Math.sin(t * 1.71 + s) * 0.5 + Math.sin(t * 3.93 + s * 2.1) * 0.3 + Math.sin(t * 9.17 + s * 3.7) * 0.2;

let off = null, octx = null;
function scratch(w, h) {
  if (!off) { off = document.createElement('canvas'); octx = off.getContext('2d'); }
  if (off.width < w || off.height < h) { off.width = Math.ceil(Math.max(w, off.width)); off.height = Math.ceil(Math.max(h, off.height)); }
  octx.setTransform(1, 0, 0, 1, 0, 0);
  octx.clearRect(0, 0, off.width, off.height);
  return octx;
}

/* A teardrop from the base (0,0) up to the tip (lean, -h). Widest a little under a third
   of the way up, rounded at the bottom, drawn to a point - the profile of a still flame. */
function drop(c, h, w, lean, y0 = 0) {
  const N = 22, L = [], R = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const r = w * 3.45 * Math.pow(s, 0.6) * Math.pow(1 - s, 1.45);
    const cx = lean * h * s * s;
    const y = y0 - s * h;
    L.push([cx - r, y]); R.push([cx + r, y]);
  }
  c.beginPath();
  c.moveTo(0, y0 + h * 0.015);
  for (const p of L) c.lineTo(p[0], p[1]);
  for (let i = R.length - 1; i >= 0; i--) c.lineTo(R[i][0], R[i][1]);
  c.closePath();
}

function layer(c, h, w, lean, blur, stops, y0 = 0, hh = h) {
  const g = c.createLinearGradient(0, y0, 0, y0 - hh);
  for (const [o, col] of stops) g.addColorStop(o, col);
  c.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none';
  c.fillStyle = g;
  drop(c, hh, w, lean, y0);
  c.fill();
}

/**
 * Draw one flame with its base at (x, y), `h` pixels tall.
 * k     - how alight it is: 0 nothing, 1 burning; above 1 is the flare of catching
 * lean  - tip offset as a fraction of height (+ right), from motion or a draught
 * seed  - its own personality, so neighbours do not flicker together
 */
export function drawFlame(ctx, x, y, h, t, seed, k = 1, lean = 0) {
  if (k <= 0.01 || h < 2) return;
  const a = Math.min(1, k);
  const n1 = wobble(t, seed), n2 = wobble(t * 1.3, seed + 5.1), n3 = wobble(t * 2.2, seed + 9.7);
  const hh = h * (0.35 + 0.65 * Math.min(k, 1.35)) * (1 + 0.055 * n1 + 0.02 * Math.sin(t * 27 + seed));
  const w = h * 0.17 * (1 - 0.04 * n1);
  const ln = lean + 0.07 * n2;

  // halo first, straight onto the page: the air around a flame is lit, softly and far
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const cy = y - hh * 0.42;
  let g = ctx.createRadialGradient(x, cy, 0, x, cy, hh * 3.4);
  g.addColorStop(0, `rgba(255,160,70,${(0.09 * a * (1 + 0.12 * n3)).toFixed(3)})`);
  g.addColorStop(0.35, `rgba(255,130,50,${(0.03 * a).toFixed(3)})`);
  g.addColorStop(1, 'rgba(255,110,40,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - hh * 3.4, cy - hh * 3.4, hh * 6.8, hh * 6.8);
  g = ctx.createRadialGradient(x, cy, 0, x, cy, hh * 1.1);
  g.addColorStop(0, `rgba(255,200,120,${(0.2 * a).toFixed(3)})`);
  g.addColorStop(1, 'rgba(255,160,80,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - hh * 1.1, cy - hh * 1.1, hh * 2.2, hh * 2.2);
  ctx.restore();

  // the flame itself, on its own small canvas so the blurs stay cheap
  const SW = hh * 2.2, SH = hh * 1.9, bx = SW / 2, by = hh * 1.55;
  const c = scratch(SW, SH);
  c.translate(bx, by);

  // the blue cup at the wick, where the wax vapour has not caught yet
  c.globalCompositeOperation = 'lighter';
  c.filter = `blur(${(hh * 0.035).toFixed(1)}px)`;
  c.fillStyle = 'rgba(70,110,255,0.55)';
  c.beginPath(); c.ellipse(0, -hh * 0.05, w * 0.55, hh * 0.075, 0, 0, TAU); c.fill();
  c.globalCompositeOperation = 'source-over';

  // orange skin, yellow body, a white core that stops short of the tip
  layer(c, hh, w * 1.1, ln, hh * 0.03, [
    [0, 'rgba(255,120,40,0)'], [0.08, 'rgba(255,140,50,0.55)'], [0.3, 'rgba(255,150,55,0.85)'],
    [0.75, 'rgba(245,110,30,0.6)'], [1, 'rgba(230,80,20,0)']]);
  layer(c, hh, w * 0.84, ln * 0.95, hh * 0.014, [
    [0, 'rgba(255,220,150,0)'], [0.1, 'rgba(255,228,160,0.9)'], [0.35, 'rgba(255,236,170,1)'],
    [0.8, 'rgba(255,190,90,0.55)'], [1, 'rgba(255,160,60,0)']]);
  layer(c, hh, w * 0.58, ln * 0.85, hh * 0.012, [
    [0, 'rgba(255,255,255,0)'], [0.1, 'rgba(255,255,252,1)'], [0.6, 'rgba(255,252,236,0.9)'],
    [1, 'rgba(255,245,215,0)']], -hh * 0.04, hh * 0.78);
  c.filter = 'none';

  ctx.save();
  ctx.globalAlpha *= a;
  ctx.drawImage(off, 0, 0, SW, SH, x - bx, y - by, SW, SH);
  ctx.restore();
}

/* The moment of catching: a quick flare and a settle, as a height multiplier over the
   seconds since the wick caught. Overshoots to about 1.3 and rings down. */
export function catchCurve(s) {
  if (s <= 0) return 0;
  return 1 - Math.exp(-9 * s) + 0.32 * Math.sin(s * 7.5) * Math.exp(-4.2 * s);
}
