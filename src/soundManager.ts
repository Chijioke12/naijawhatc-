// Web Audio API Retro Sound Synthesizer + Audio File / Base64 Audio Playback Manager
// Supports uploaded WAV/MP3/OGG sound files, base64 audio in sounds_base64.json, and pure synth fallback

let audioCtx: AudioContext | null = null;
let muted = false;
let asyncSounds: Record<string, string> = {};
const loadedAudioElements: Record<string, HTMLAudioElement> = {};

export function setSoundMuted(isMuted: boolean): void {
  muted = isMuted;
}

export function isSoundMuted(): boolean {
  return muted;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Background loader for uploaded audio files or base64 audio JSON
if (typeof window !== 'undefined') {
  fetch('./sounds_base64.json')
    .then(r => {
      if (r.ok) return r.json();
      throw new Error('No sounds_base64.json');
    })
    .then(data => {
      if (data && typeof data === 'object') {
        asyncSounds = data;
        console.log('[soundManager] Loaded sound assets from sounds_base64.json');
      }
    })
    .catch(() => {
      // Check for standalone sound files in sounds/
      const soundKeys = [
        'sfx_btn_click', 'sfx_card_deal', 'sfx_card_draw', 'sfx_card_play',
        'sfx_whot_played', 'sfx_hold_on', 'sfx_pick_two', 'sfx_pick_three',
        'sfx_suspension', 'sfx_general_market', 'sfx_last_card', 'sfx_win',
        'sfx_lose', 'sfx_invalid_move', 'sfx_your_turn'
      ];
      soundKeys.forEach(k => {
        const audioPath = `./sounds/${k}.wav`;
        fetch(audioPath, { method: 'HEAD' })
          .then(res => {
            if (res.ok) {
              asyncSounds[k] = audioPath;
            }
          })
          .catch(() => {});
      });
    });
}

export function registerSound(key: string, dataOrUrl: string): void {
  asyncSounds[key] = dataOrUrl;
}

export function playSound(soundKey: string): void {
  if (muted) return;

  // 1. If an actual uploaded audio file / base64 string is available, play it
  if (asyncSounds[soundKey]) {
    try {
      const src = asyncSounds[soundKey];
      let audio = loadedAudioElements[soundKey];
      if (!audio || audio.src !== src) {
        audio = new Audio(src);
        loadedAudioElements[soundKey] = audio;
      }
      audio.currentTime = 0;
      audio.play().catch(() => {
        playSynthSound(soundKey);
      });
      return;
    } catch {
      // Fallback to synth if audio playback fails
    }
  }

  // 2. High performance Web Audio API synthesis
  playSynthSound(soundKey);
}

function playSynthSound(soundKey: string): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    switch (soundKey) {
      case 'sfx_btn_click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'sfx_card_deal':
      case 'sfx_card_draw': {
        // Crisp card sliding flap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
        break;
      }

      case 'sfx_card_play': {
        // Satisfying card slap on table
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case 'sfx_whot_played': {
        // Grand Whot 20 Magical Chime
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.25, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.2);
        });
        break;
      }

      case 'sfx_hold_on': {
        // Double ding
        [659.25, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.3, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.15);
        });
        break;
      }

      case 'sfx_pick_two': {
        // Low double strike
        [300, 240].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.28, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.12);
        });
        break;
      }

      case 'sfx_pick_three': {
        // Triple warning tone
        [350, 290, 220].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.28, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.12);
        });
        break;
      }

      case 'sfx_suspension': {
        // Electric buzz slide down
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }

      case 'sfx_general_market': {
        // Dramatic market siren descending
        [500, 420, 340, 260].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.25, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.12);
        });
        break;
      }

      case 'sfx_last_card': {
        // High alert whistle
        [880, 1174.66].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.3, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.18);
        });
        break;
      }

      case 'sfx_win': {
        // Fanfare Victory Arpeggio
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.3, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.35);
        });
        break;
      }

      case 'sfx_lose': {
        // Minor sad tone
        [392, 349.23, 311.13, 261.63].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.25);
        });
        break;
      }

      case 'sfx_invalid_move': {
        // Thump error
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(65, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }

      case 'sfx_your_turn': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.warn('Synth error:', soundKey, e);
  }
}
