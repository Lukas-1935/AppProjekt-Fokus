/**
 * Fokus-Klang ohne Assets: braunes Rauschen durch einen Tiefpass,
 * dessen Frequenz ein sehr langsamer LFO sanft moduliert – klingt wie
 * fernes Meeresrauschen und läuft komplett offline über die Web Audio API.
 */

let ctx = null;
let gain = null;

const MAX_GAIN = 0.35; // Rauschen ist laut – Regler 0–1 auf 0–0.35 abbilden

export function startFocusSound(volume = 0.5) {
  stopFocusSound();
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;

  try {
    ctx = new AC();

    // 4 Sekunden braunes Rauschen als Loop-Puffer
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;

    // Langsame Bewegung im Klang (Periode ~14 s)
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 130;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    gain = ctx.createGain();
    gain.gain.value = 0;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    lfo.start();
    if (ctx.state === 'suspended') ctx.resume();
    // sanft einblenden
    gain.gain.setTargetAtTime(volume * MAX_GAIN, ctx.currentTime, 0.4);
    return true;
  } catch {
    stopFocusSound();
    return false;
  }
}

export function setFocusVolume(volume) {
  if (gain && ctx) {
    gain.gain.setTargetAtTime(volume * MAX_GAIN, ctx.currentTime, 0.1);
  }
}

export function stopFocusSound() {
  if (ctx) {
    try {
      ctx.close();
    } catch {
      // Kontext war schon geschlossen
    }
  }
  ctx = null;
  gain = null;
}
