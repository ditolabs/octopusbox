/**
 * js/audio.js
 * Semua efek suara disintesis langsung lewat Web Audio API (oscillator + envelope).
 * Tidak ada file .mp3/.wav yang perlu di-hosting — ringan untuk GitHub Pages
 * dan otomatis konsisten kalau parameter game (kecepatan, mode marah, dst) berubah.
 */

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.unlocked = false;

        // Browser mobile butuh gesture user sebelum AudioContext boleh main.
        this._unlockHandler = () => this.unlock();
        window.addEventListener('pointerdown', this._unlockHandler, { once: true });
    }

    unlock() {
        if (this.unlocked) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.unlocked = true;
        } catch (e) {
            this.enabled = false;
        }
    }

    _tone(type, freq, duration, { gain = 0.15, freqEnd = null, attack = 0.005 } = {}) {
        if (!this.enabled || !this.ctx) return;
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        if (freqEnd !== null) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), ctx.currentTime + duration);
        }

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gainNode).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration + 0.02);
    }

    playSwitchClick() { this._tone('square', 900, 0.06, { gain: 0.12, freqEnd: 400 }); }
    playServoWhirr() { this._tone('sawtooth', 220, 0.18, { gain: 0.06, freqEnd: 340 }); }
    playTentacleFlop() { this._tone('sine', 180, 0.14, { gain: 0.16, freqEnd: 60 }); }
    playLidCreak() { this._tone('triangle', 140, 0.22, { gain: 0.05, freqEnd: 100 }); }

    playAngryGrowl() {
        this._tone('sawtooth', 90, 0.35, { gain: 0.1, freqEnd: 55 });
        setTimeout(() => this._tone('square', 70, 0.2, { gain: 0.08, freqEnd: 40 }), 60);
    }
}
