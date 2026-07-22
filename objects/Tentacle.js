/**
 * objects/Tentacle.js
 * Satu lengan gurita dengan IK berbasis FABRIK.
 *
 * Kenapa idle-pose tidak pakai FABRIK: kalau target sangat dekat dengan base
 * (posisi meringkuk), FABRIK dengan banyak sendi cenderung "melipat" jadi
 * zig-zag yang tidak natural. Jadi untuk idle & retract dipakai pose
 * prosedural (kurva melengkung berbasis waktu), sedangkan extend/press
 * memakai FABRIK penuh karena target (posisi switch) cukup jauh untuk
 * menghasilkan lengkungan yang halus.
 */

import { Vec2 } from '../js/physics.js';
import { Easing } from '../js/animation.js';

export class Tentacle {
    constructor(baseX, baseY, segments, segmentLength) {
        this.base = { x: baseX, y: baseY };
        this.segmentCount = segments;
        this.segmentLength = segmentLength;

        this.joints = [];
        for (let i = 0; i <= segments; i++) {
            this.joints.push({ x: baseX, y: baseY - i * 2 });
        }

        this.state = 'idle'; // idle | extend | press | retract
        this.switchRef = null;

        this.idleAngle = Math.random() * Math.PI * 2;
        this.idleSpeed = 0.6 + Math.random() * 0.5;
        this.time = 0;
        this.holdTimer = 0;

        this.retractBlend = 0;
        this.retractFrom = null;

        this.thickness = 9;
    }

    getIdlePose() {
        const n = this.joints.length;
        const wob = Math.sin(this.time * this.idleSpeed + this.idleAngle);
        const pose = [];
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1);
            const droop = t * t * 42;
            const sway = Math.sin(t * Math.PI * 1.6 + this.time * this.idleSpeed) * 9 * t;
            pose.push({
                x: this.base.x + sway + wob * 2 * t,
                y: this.base.y + 6 + droop
            });
        }
        return pose;
    }

    solveFABRIK(target) {
        const n = this.joints.length;
        const total = this.segmentLength;
        const dist = Vec2.dist(this.base, target);
        const reachable = dist < total * (n - 1);

        if (!reachable) {
            const dir = Vec2.normalize(Vec2.sub(target, this.base));
            for (let i = 0; i < n; i++) {
                this.joints[i] = Vec2.add(this.base, Vec2.scale(dir, total * i));
            }
            return;
        }

        // Backward pass: mulai dari ujung menuju target
        this.joints[n - 1] = { x: target.x, y: target.y };
        for (let i = n - 2; i >= 0; i--) {
            const dir = Vec2.normalize(Vec2.sub(this.joints[i], this.joints[i + 1]));
            this.joints[i] = Vec2.add(this.joints[i + 1], Vec2.scale(dir, total));
        }

        // Forward pass: kunci base kembali ke posisi anchor
        this.joints[0] = { x: this.base.x, y: this.base.y };
        for (let i = 1; i < n; i++) {
            const dir = Vec2.normalize(Vec2.sub(this.joints[i], this.joints[i - 1]));
            this.joints[i] = Vec2.add(this.joints[i - 1], Vec2.scale(dir, total));
        }
    }

    assign(sw) {
        this.switchRef = sw;
        this.state = 'extend';
    }

    update(dt, audio, particles) {
        this.time += dt;

        if (this.state === 'idle') {
            this.joints = this.getIdlePose();
            return;
        }

        if (this.state === 'extend') {
            const target = { x: this.switchRef.x + this.switchRef.width / 2, y: this.switchRef.y + 4 };
            this.solveFABRIK(target);
            const tip = this.joints[this.joints.length - 1];
            if (Vec2.dist(tip, target) < 14) {
                this.state = 'press';
                this.holdTimer = 0.16;
                if (this.switchRef) this.switchRef.isOn = false;
                if (audio) audio.playSwitchClick();
                if (particles) particles.spawnBurst(target.x, target.y);
            }
            return;
        }

        if (this.state === 'press') {
            const target = { x: this.switchRef.x + this.switchRef.width / 2, y: this.switchRef.y + 4 };
            this.solveFABRIK(target);
            this.holdTimer -= dt;
            if (this.holdTimer <= 0) {
                this.state = 'retract';
                this.retractBlend = 0;
                this.retractFrom = this.joints.map(p => ({ x: p.x, y: p.y }));
                if (audio) audio.playTentacleFlop();
            }
            return;
        }

        if (this.state === 'retract') {
            this.retractBlend += dt / 0.35;
            const idlePose = this.getIdlePose();
            if (this.retractBlend >= 1) {
                this.joints = idlePose;
                this.state = 'idle';
                this.switchRef = null;
            } else {
                const e = Easing.easeInOutQuad(Math.min(1, this.retractBlend));
                this.joints = this.retractFrom.map((p, i) => Vec2.lerp(p, idlePose[i], e));
            }
        }
    }

    draw(ctx, colorMain, colorDark) {
        const n = this.joints.length;
        if (n < 2) return;

        ctx.save();
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorMain;

        for (let i = 0; i < n - 1; i++) {
            const a = this.joints[i];
            const b = this.joints[i + 1];
            const t = i / (n - 1);
            ctx.lineWidth = Math.max(2, this.thickness * (1 - t * 0.78));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        ctx.fillStyle = colorDark;
        for (let i = 2; i < n; i += 3) {
            const p = this.joints[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
