/**
 * js/ai.js
 * State machine untuk perilaku gurita, mengikuti state di CONFIG.AI_STATE.
 *
 * - SLEEP: tidak ada lengan aktif.
 * - ALERT: baru saja menerima switch pertama setelah SLEEP.
 * - REACH/PRESS/RETRACT: ditentukan langsung oleh Tentacle masing-masing;
 *   di level Octopus, "REACH" dipakai sebagai representasi umum "sedang bekerja".
 * - ANGRY: dipicu kalau pemain menekan switch terlalu sering dalam window waktu
 *   tertentu (spam) — animasi & suara jadi lebih agresif.
 */

import { CONFIG } from './config.js';

export class OctopusAI {
    constructor(octopus, box, audio) {
        this.octopus = octopus;
        this.box = box;
        this.audio = audio;

        this.state = CONFIG.AI_STATE.SLEEP;
        this.pressTimestamps = [];
        this.angryUntil = 0;
    }

    // Dipanggil oleh Switch.onActivate saat pemain menekan switch.
    notifySwitchOn(sw) {
        const now = performance.now();

        this.pressTimestamps.push(now);
        this.pressTimestamps = this.pressTimestamps.filter(
            t => now - t < CONFIG.AI.ANGRY_WINDOW_MS
        );
        if (this.pressTimestamps.length >= CONFIG.AI.ANGRY_TRIGGER_COUNT) {
            this.angryUntil = now + CONFIG.AI.ANGRY_DURATION_MS;
        }

        const isAngry = now < this.angryUntil;
        if (this.state === CONFIG.AI_STATE.SLEEP) {
            this.state = CONFIG.AI_STATE.ALERT;
        }

        const assigned = this.octopus.assignTentacleTo(sw);
        if (assigned && this.audio) {
            this.audio.playServoWhirr();
            if (isAngry) this.audio.playAngryGrowl();
        }
    }

    update(dt) {
        const activeCount = this.octopus.tentacles.filter(t => t.state !== 'idle').length;
        const now = performance.now();
        const isAngry = now < this.angryUntil;

        if (activeCount === 0) {
            this.state = CONFIG.AI_STATE.SLEEP;
        } else if (isAngry) {
            this.state = CONFIG.AI_STATE.ANGRY;
        } else {
            this.state = CONFIG.AI_STATE.REACH;
        }

        // Semakin banyak lengan aktif sekaligus, semakin lebar lid terbuka —
        // memberi kesan gurita "kewalahan" kalau banyak switch dipencet bareng.
        const openness = activeCount > 0 ? Math.min(1, 0.45 + activeCount * 0.22) : 0;
        this.box.alertnessSpring.set(openness);
        this.box.angry = isAngry;
    }
}
