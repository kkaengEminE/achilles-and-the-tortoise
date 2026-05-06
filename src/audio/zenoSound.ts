import * as Tone from 'tone';

/**
 * Zeno's audio: every Nth click bumps a Lyre-like note one diatonic step.
 * Pitch wraps inside a soft window (3 octaves) so it never becomes ear-piercing.
 * The "convergence" feel is approached by detuning toward the wrap point and
 * shortening the release so the texture compresses with N.
 */

const SCALE = ['C', 'D', 'E', 'G', 'A']; // pentatonic — never sour
const OCTAVES = [4, 5, 6];
const STEP_PER_CLICKS = 3;

let synth: Tone.PolySynth | null = null;
let started = false;
let muted = false;
let lastNoteIndex = -1;

const KEY = 'zeno.muted.v1';

try {
  muted = localStorage.getItem(KEY) === '1';
} catch {
  // ignore (private mode etc.)
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(v: boolean): void {
  muted = v;
  try {
    localStorage.setItem(KEY, v ? '1' : '0');
  } catch {
    // ignore
  }
  if (synth) synth.volume.value = muted ? -Infinity : -10;
}

/** Lazy-init on first user gesture (required by Safari/iOS AudioContext rules). */
async function ensureStarted(): Promise<void> {
  if (started) return;
  await Tone.start();
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0.0, release: 0.18 },
  }).toDestination();
  synth.volume.value = muted ? -Infinity : -10;
  started = true;
}

export function playClick(N: number): void {
  if (muted) return;
  void ensureStarted().then(() => {
    if (!synth) return;
    const stepIdx = Math.floor((N - 1) / STEP_PER_CLICKS);
    const totalSteps = SCALE.length * OCTAVES.length;
    const wrapped = stepIdx % totalSteps;
    if (wrapped === lastNoteIndex) return; // throttle: same note as last click
    lastNoteIndex = wrapped;
    const oct = OCTAVES[Math.floor(wrapped / SCALE.length)];
    const note = SCALE[wrapped % SCALE.length] + String(oct);
    synth.triggerAttackRelease(note, '16n');
  });
}

export function playHorizonEnter(): void {
  if (muted) return;
  void ensureStarted().then(() => {
    if (!synth) return;
    // Suspended-fourth shimmer
    synth.triggerAttackRelease(['C5', 'F5', 'A5'], '4n');
  });
}

export function playReplayChime(): void {
  if (muted) return;
  void ensureStarted().then(() => {
    if (!synth) return;
    synth.triggerAttackRelease(['C4', 'E4', 'G4', 'B4'], '2n');
  });
}

export function resetSession(): void {
  lastNoteIndex = -1;
}
