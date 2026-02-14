/**
 * SoundService
 * Generates synthesizer sounds using the Web Audio API.
 * This ensures sounds work offline and without external file dependencies.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      // Initialize AudioContext only on user interaction to comply with browser policies
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  private initCtx() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playCorrect() {
    if (this.isMuted || !this.ctx) return;
    this.initCtx();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // High pitched "Ding"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, this.ctx.currentTime + 0.1); // C6

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  public playIncorrect() {
    if (this.isMuted || !this.ctx) return;
    this.initCtx();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Low pitched "Buzz"
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);

    // Trigger Haptic Feedback on Mobile
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  }

  public playSuccess() {
    if (this.isMuted || !this.ctx) return;
    this.initCtx();

    // Play a major chord
    const notes = [523.25, 659.25, 783.99]; // C Major
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = this.ctx!.currentTime + (i * 0.1);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

      osc.start(startTime);
      osc.stop(startTime + 1.5);
    });
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Text-to-Speech implementation
   * @param text The text to read
   * @param lang The language code (MK, SQ, TR, EN)
   */
  public speak(text: string, lang: string) {
    if (this.isMuted) return;
    
    // Clean text from LaTeX symbols for better reading
    const cleanText = text.replace(/\$/g, '').replace(/\\text\{([^}]+)\}/g, '$1');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Map our language codes to BCP 47 tags
    const langMap: Record<string, string> = {
      'MK': 'mk-MK',
      'SQ': 'sq-AL',
      'TR': 'tr-TR',
      'EN': 'en-US'
    };

    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Stop any current speech before starting new one
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

export const soundService = new SoundService();