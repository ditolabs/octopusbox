/**
 * objects/Octopus.js
 * Mengelola array Tentacle (satu per "lengan") dan menggambar kepala yang
 * mengintip dari lubang kotak. Tidak menyimpan state buka/tutup sendiri —
 * itu dibaca dari box.alertnessSpring supaya selalu sinkron dengan Lid.
 */

import { GameObject } from './GameObject.js';
import { CONFIG } from '../js/config.js';
import { Tentacle } from './Tentacle.js';

export class Octopus extends GameObject {
    constructor(box, count = 8) {
        super(box.x, box.y);
        this.box = box;
        this.tentacles = [];

        const innerLeft = box.x + 30;
        const innerRight = box.x + box.width - 30;

        for (let i = 0; i < count; i++) {
            const bx = innerLeft + (innerRight - innerLeft) * (count === 1 ? 0.5 : i / (count - 1));
            const by = box.y + 40;
            this.tentacles.push(
                new Tentacle(bx, by, CONFIG.GAME.TENTACLE_SEGMENTS, CONFIG.GAME.TENTACLE_SEGMENT_LENGTH)
            );
        }

        this.bob = 0;
    }

    // Dipanggil oleh OctopusAI saat ada switch baru yang perlu direspon.
    // Memilih lengan idle yang basenya paling dekat ke switch itu.
    assignTentacleTo(sw) {
        const idle = this.tentacles.filter(t => t.state === 'idle');
        if (idle.length === 0) return false; // semua lengan sedang sibuk
        idle.sort((a, b) => Math.abs(a.base.x - sw.x) - Math.abs(b.base.x - sw.x));
        idle[0].assign(sw);
        return true;
    }

    update(dt, input, audio, particles) {
        this.bob += dt;
        this.tentacles.forEach(t => t.update(dt, audio, particles));
    }

    draw(ctx) {
        const box = this.box;
        const openness = box.alertnessSpring.value;
        const angry = box.angry;
        const boxCenterX = box.x + box.width / 2;
        const boxTopY = box.y + 18;

        // Tentakel digambar dalam area clip supaya tidak menembus keluar lubang
        ctx.save();
        ctx.beginPath();
        ctx.rect(box.x, box.y - 10, box.width, 90);
        ctx.clip();

        const mainColor = angry ? '#8B3A9E' : '#6B4E9E';
        const darkColor = angry ? '#5a1f6e' : '#4a3470';
        this.tentacles.forEach(t => t.draw(ctx, mainColor, darkColor));
        ctx.restore();

        // Kepala hanya muncul saat cukup "terbuka"
        if (openness > 0.05) {
            const headY = boxTopY - openness * 26 + Math.sin(this.bob * 2) * 2;

            ctx.save();
            const grad = ctx.createRadialGradient(boxCenterX - 10, headY - 10, 5, boxCenterX, headY, 45);
            grad.addColorStop(0, angry ? '#a15fd6' : '#8b6fc4');
            grad.addColorStop(1, darkColor);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(boxCenterX, headY, 44, 36 * Math.min(1, openness * 1.4), 0, 0, Math.PI * 2);
            ctx.fill();

            const eyeY = headY - 3;
            [-15, 15].forEach(dx => {
                ctx.fillStyle = '#1a1420';
                ctx.beginPath();
                ctx.ellipse(boxCenterX + dx, eyeY, 7.5, 9.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#eaf6ff';
                ctx.beginPath();
                ctx.arc(boxCenterX + dx - 2, eyeY - 2, 2.2, 0, Math.PI * 2);
                ctx.fill();
            });

            if (angry) {
                ctx.strokeStyle = '#1a1420';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(boxCenterX - 23, eyeY - 13); ctx.lineTo(boxCenterX - 5, eyeY - 7);
                ctx.moveTo(boxCenterX + 23, eyeY - 13); ctx.lineTo(boxCenterX + 5, eyeY - 7);
                ctx.stroke();
            }

            ctx.restore();
        }
    }
}
