/**
 * objects/Switch.js
 * Sakelar yang bisa ditekan oleh pemain (dan dimatikan oleh gurita).
 * Switch sendiri tidak lagi meng-toggle balik secara otomatis — itu tanggung
 * jawab Tentacle setelah IK-nya sampai di posisi switch (lihat Tentacle.js).
 */

import { GameObject } from './GameObject.js';

export class Switch extends GameObject {
    constructor(id, x, y) {
        super(x, y);
        this.id = id;

        // Hitbox klik untuk user
        this.width = 30;
        this.height = 60;

        this.isOn = false;

        // Dipasang oleh Engine: callback saat pemain berhasil menyalakan switch ini
        this.onActivate = null;

        // Warna desain sakelar
        this.baseColor = '#333333';
        this.leverOnColor = '#4CAF50';  // Hijau
        this.leverOffColor = '#F44336'; // Merah
    }

    update(dt, input) {
        if (input && input.isClicked) {
            if (this.checkHover(input.x, input.y, this.width, this.height)) {
                // Hanya bisa dinyalakan kalau sedang mati — mencegah trigger ganda
                // selagi tentakel sedang menuju switch ini.
                if (!this.isOn) {
                    this.isOn = true;
                    if (typeof this.onActivate === 'function') {
                        this.onActivate(this);
                    }
                }
            }
        }
    }

    draw(ctx) {
        // 1. Dudukan sakelar (Base)
        ctx.fillStyle = this.baseColor;
        ctx.fillRect(this.x, this.y + 30, this.width, this.height - 30);

        // 2. Batang Tuas (Lever)
        ctx.save();

        const pivotX = this.x + this.width / 2;
        const pivotY = this.y + 40;
        ctx.translate(pivotX, pivotY);

        const angle = this.isOn ? (Math.PI / 4) : -(Math.PI / 4);
        ctx.rotate(angle);

        ctx.fillStyle = this.isOn ? this.leverOnColor : this.leverOffColor;
        ctx.fillRect(-6, -30, 12, 30);

        ctx.beginPath();
        ctx.arc(0, -30, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
