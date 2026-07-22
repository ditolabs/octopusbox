/**
 * objects/Shadow.js
 * Bayangan lonjong sederhana di bawah kotak supaya tidak terasa "melayang".
 */

import { GameObject } from './GameObject.js';

export class Shadow extends GameObject {
    constructor(box) {
        super(box.x, box.y);
        this.box = box;
    }

    draw(ctx) {
        const b = this.box;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.32)';
        ctx.beginPath();
        ctx.ellipse(b.x + b.width / 2, b.y + b.height + 16, b.width * 0.55, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
