/**
 * objects/Particle.js
 * Sistem partikel ringan — dipakai untuk percikan kecil saat tentakel
 * berhasil mengenai switch. Bukan GameObject biasa (dikelola & digambar
 * terakhir oleh Engine/Renderer supaya selalu tampil di atas objek lain).
 */

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    spawnBurst(x, y, count = 8, color = '#ffd76b') {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 60 + Math.random() * 90;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 40,
                life: 0.4 + Math.random() * 0.3,
                age: 0,
                size: 2 + Math.random() * 2.5,
                color
            });
        }
    }

    update(dt) {
        this.particles.forEach(p => {
            p.age += dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 220 * dt; // gravitasi ringan
        });
        this.particles = this.particles.filter(p => p.age < p.life);
    }

    draw(ctx) {
        this.particles.forEach(p => {
            const t = Math.max(0, 1 - p.age / p.life);
            ctx.globalAlpha = t;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * t, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
}
