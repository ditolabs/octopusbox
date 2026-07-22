/**
 * objects/Lid.js
 * Tutup kotak yang "membuka" saat gurita waspada, ditutup lagi saat tenang.
 * Digambar terpisah dari Box supaya urutan render bisa menimpa tentakel/kepala
 * gurita saat lid dalam posisi tertutup atau setengah terbuka.
 */

import { GameObject } from './GameObject.js';

export class Lid extends GameObject {
    constructor(box) {
        super(box.x, box.y);
        this.box = box;
    }

    draw(ctx) {
        const box = this.box;
        const openness = box.alertnessSpring ? box.alertnessSpring.value : 0;
        const topHeight = 60;

        // Simulasi engsel: lid "menciut" secara vertikal dan naik sedikit
        // untuk memberi kesan terbuka ke belakang (pendekatan 2D untuk rotateX).
        const scaleY = 1 - Math.min(0.88, openness * 0.88);
        const liftY = openness * 20;

        ctx.save();
        ctx.translate(box.x, box.y + topHeight - liftY);
        ctx.scale(1, Math.max(0.06, scaleY));
        ctx.translate(-box.x, -(box.y + topHeight - liftY));

        ctx.fillStyle = box.colorTop;
        ctx.fillRect(box.x, box.y, box.width, topHeight);
        ctx.strokeStyle = '#b8afa0';
        ctx.lineWidth = 4;
        ctx.strokeRect(box.x, box.y, box.width, topHeight);

        // Baut dekoratif di tepi lid
        ctx.fillStyle = '#8a8272';
        [0.06, 0.94].forEach(fx => {
            ctx.beginPath();
            ctx.arc(box.x + box.width * fx, box.y + topHeight * 0.7, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}
