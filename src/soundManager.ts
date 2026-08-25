import soundsData from '../public/sounds_base64.json';

const sounds = soundsData as Record<string, string>;
const audioElements: Record<string, HTMLAudioElement> = {};
let muted = false;

export function setSoundMuted(isMuted: boolean): void {
  muted = isMuted;
}

export function isSoundMuted(): boolean {
  return muted;
}

export function playSound(soundKey: string): void {
  if (muted) return;
  try {
    const dataUrl = sounds[soundKey];
    if (!dataUrl) return;

    let audio = audioElements[soundKey];
    if (!audio) {
      audio = new Audio(dataUrl);
      audioElements[soundKey] = audio;
    } else {
      audio.currentTime = 0;
    }
    audio.play().catch(() => {
      // Audio playback blocked until user gesture
    });
  } catch (e) {
    console.warn('Audio error:', soundKey, e);
  }
}
