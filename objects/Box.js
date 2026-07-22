/**
 * objects/Box.js
 * Lingkungan fisik utama game. Sisi atas (lid) digambar terpisah oleh Lid.js
 * supaya bisa dianimasikan buka/tutup tanpa mengganggu Box.
 */

import { GameObject } from './GameObject.js';
import { CONFIG } from '../js/config.js';
import { Spring } from '../js/physics.js';

export class Box extends GameObject {
    constructor() {
        // Posisikan kotak di tengah bawah layar
        const x = (CONFIG.DISPLAY.WIDTH - CONFIG.GAME.BOX_WIDTH) / 2;
        const y = CONFIG.DISPLAY.HEIGHT - CONFIG.GAME.BOX_HEIGHT - 60; // Margin bawah + ruang bayangan

        super(x, y);

        this.width = CONFIG.GAME.BOX_WIDTH;
        this.height = CONFIG.GAME.BOX_HEIGHT;

        // Properti warna (senada dengan mainan aslinya: casing putih gading)
        this.colorFront = '#efe9df';
        this.colorTop = '#fbf8f2';
        this.colorInside = '#100a17'; // Warna lubang tempat gurita bersembunyi

        // Spring tunggal untuk "keterbukaan" — dipakai bersama oleh Lid & Octopus
        // supaya keduanya selalu sinkron (satu sumber kebenaran).
        this.alertnessSpring = new Spring(0, CONFIG.PHYSICS.SPRING_TENSION, CONFIG.PHYSICS.SPRING_DAMPING);
        this.angry = false;
    }

    update(dt) {
        this.alertnessSpring.update();
    }

    draw(ctx) {
        const topHeight = 60;
        const padding = 20;

        // 1. Lubang interior (selalu ada di belakang; Lid akan menutupinya saat idle)
        ctx.fillStyle = this.colorInside;
        ctx.fillRect(
            this.x + padding,
            this.y + 6,
            this.width - padding * 2,
            topHeight - 12
        );

        // 2. Sisi depan (Front Face)
        ctx.fillStyle = this.colorFront;
        ctx.fillRect(this.x, this.y + topHeight, this.width, this.height - topHeight);
        ctx.strokeStyle = '#b8afa0';
        ctx.lineWidth = 4;
        ctx.strokeRect(this.x, this.y + topHeight, this.width, this.height - topHeight);

        // 3. Plakat "Don't Touch"
        const plateW = 220;
        ctx.fillStyle = '#fbf8f2';
        ctx.fillRect(this.x + this.width / 2 - plateW / 2, this.y + topHeight + 18, plateW, 46);
        ctx.strokeStyle = '#cfc7b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(this.x + this.width / 2 - plateW / 2, this.y + topHeight + 18, plateW, 46);

        ctx.fillStyle = '#2a2330';
        ctx.textAlign = 'center';
        ctx.font = 'bold 12px "Segoe UI", sans-serif';
        ctx.fillText("Don't Touch..", this.x + this.width / 2, this.y + topHeight + 34);
        ctx.font = 'bold 11px "Segoe UI", sans-serif';
        ctx.fillText('Treasure Guardian Inside!!!', this.x + this.width / 2, this.y + topHeight + 50);
    }
}
