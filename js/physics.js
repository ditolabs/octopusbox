/**
 * js/physics.js
 * Utilitas vektor 2D dan spring physics (dipakai oleh IK tentakel & animasi lid).
 */

export const Vec2 = {
    create(x = 0, y = 0) { return { x, y }; },
    add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; },
    sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; },
    scale(a, s) { return { x: a.x * s, y: a.y * s }; },
    length(a) { return Math.hypot(a.x, a.y); },
    normalize(a) {
        const l = Vec2.length(a);
        return l > 0.0001 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 0 };
    },
    dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); },
    lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }
};

/**
 * Spring: nilai skalar yang "mengejar" target dengan tension & damping.
 * Dipakai untuk animasi lid (buka/tutup) dan alertness gurita — halus, tidak kaku.
 */
export class Spring {
    constructor(value = 0, tension = 0.1, damping = 0.8) {
        this.value = value;
        this.target = value;
        this.velocity = 0;
        this.tension = tension;
        this.damping = damping;
    }

    set(target) {
        this.target = target;
    }

    update() {
        const force = (this.target - this.value) * this.tension;
        this.velocity = (this.velocity + force) * this.damping;
        this.value += this.velocity;
        return this.value;
    }
}
