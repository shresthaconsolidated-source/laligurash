/* The room, heard.

   Every sound here is made on the spot from noise and filters - no recordings, nothing
   to download, nothing to license. Only two, and only at the moment something lights:

   - the strike: the rasp of a match head across the box, then the soft whump of it taking
   - a wick catching: a short breath of flame, quieter the more candles are already lit

   There is no background sound. A constant hush of burning was tried and read as wind
   (his call, 24 Sep 2026), so between lightings the room is silent.

   It starts OFF. A page that makes a noise nobody asked for is a page that gets closed,
   so the visitor turns it on, and the choice is remembered for the next visit. */

const KEY = 'laligurash-sound';

export function createSound() {
  let ac = null, master = null, noiseBuf = null;
  let on = false, burning = 0;

  function boot() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain();
    master.gain.value = 0;
    // a gentle ceiling, so a run of catches never stacks into anything harsh
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    master.connect(comp).connect(ac.destination);

    // two seconds of white noise, reused by everything
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function noise(loop = false) {
    const s = ac.createBufferSource();
    s.buffer = noiseBuf; s.loop = loop;
    if (!loop) s.playbackRate.value = 0.9 + Math.random() * 0.2;
    return s;
  }

  // one shaped burst of filtered noise
  function puff({ at = 0, type = 'bandpass', f = 1000, f2 = f, q = 1, a = 0.01, hold = 0, d = 0.2, g = 0.5 }) {
    const t = ac.currentTime + at;
    const s = noise(), flt = ac.createBiquadFilter(), env = ac.createGain();
    flt.type = type; flt.Q.value = q;
    flt.frequency.setValueAtTime(f, t);
    flt.frequency.exponentialRampToValueAtTime(Math.max(40, f2), t + a + hold + d);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(g, t + a);
    env.gain.setValueAtTime(g, t + a + hold);
    env.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + d);
    s.connect(flt).connect(env).connect(master);
    s.start(t, Math.random() * 1.5);
    s.stop(t + a + hold + d + 0.05);
  }

  const ready = () => on && ac && ac.state === 'running';

  function strike() {
    if (!ready()) return;
    // the rasp: a few grains of scratch as the head drags across the striker
    const grains = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < grains; i++) {
      puff({ at: i * 0.018 + Math.random() * 0.006, f: 2600 + Math.random() * 2200, q: 2.2,
        a: 0.002, d: 0.03 + Math.random() * 0.02, g: 0.5 + Math.random() * 0.3 });
    }
    // the flare: bright, then falling as the head takes
    puff({ at: 0.09, type: 'bandpass', f: 3400, f2: 900, q: 0.8, a: 0.01, d: 0.28, g: 0.45 });
    // the whump underneath it
    puff({ at: 0.1, type: 'lowpass', f: 600, f2: 160, q: 0.7, a: 0.03, d: 0.45, g: 0.6 });
  }

  function ignite() {
    if (!ready()) return;
    // the tenth candle catching should not be as loud as the first
    const k = 1 / Math.sqrt(1 + burning * 0.35);
    puff({ type: 'lowpass', f: 900, f2: 260, q: 0.6, a: 0.04, hold: 0.05, d: 0.55, g: 0.55 * k });
    puff({ at: 0.02, type: 'bandpass', f: 1800, f2: 700, q: 1.1, a: 0.015, d: 0.18, g: 0.18 * k });
  }

  // called every frame with how many wicks are burning
  function update(count) { burning = count; }


  function set(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
    if (on) {
      boot();
      ac.resume();
      master.gain.setTargetAtTime(0.8, ac.currentTime, 0.15);
    } else if (ac) {
      master.gain.setTargetAtTime(0, ac.currentTime, 0.1);
    }
    return on;
  }

  // browsers only allow sound after the visitor has done something, so a remembered
  // "on" waits for the first click or key rather than failing silently
  let wanted = false;
  try { wanted = localStorage.getItem(KEY) === '1'; } catch (e) {}

  return {
    strike, ignite, update, set,
    scent: () => {},
    get on() { return on; },
    // for testing: the audio clock state and how loud the room is right now
    get state() { return ac ? ac.state : 'none'; },
    wanted,
  };
}
