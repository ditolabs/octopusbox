import { CONFIG } from './config.js';
import { Renderer } from './renderer.js';
import { Input } from './input.js';
import { AudioEngine } from './audio.js';
import { OctopusAI } from './ai.js';
import { Box } from '../objects/Box.js';
import { Lid } from '../objects/Lid.js';
import { Switch } from '../objects/Switch.js';
import { Octopus } from '../objects/Octopus.js';
import { Shadow } from '../objects/Shadow.js';
import { ParticleSystem } from '../objects/Particle.js';

export class Engine {
    constructor(canvas) {
        this.renderer = new Renderer(canvas);
        this.input = new Input(canvas);
        this.audio = new AudioEngine();
        this.particles = new ParticleSystem();

        this.lastTime = 0;
        this.accumulator = 0;
        this.timeStep = 1000 / CONFIG.DISPLAY.TARGET_FPS;
        this.isRunning = false;

        this.gameObjects = [];
        this.ai = null;

        this.initEnvironment();

        this.loop = this.loop.bind(this);
    }

    initEnvironment() {
        const box = new Box();
        const shadow = new Shadow(box);
        const octopus = new Octopus(box, 8);
        const lid = new Lid(box);

        this.ai = new OctopusAI(octopus, box, this.audio);

        // Posisikan 7 switch merata di sepanjang tepi atas kotak
        const switchCount = CONFIG.GAME.SWITCH_COUNT;
        const paddingArea = box.width - 40;
        const spacing = paddingArea / switchCount;
        const startX = box.x + 20 + (spacing / 2) - 15;
        const startY = box.y + 62;

        const switches = [];
        for (let i = 0; i < switchCount; i++) {
            const s = new Switch(i, startX + (i * spacing), startY);
            s.onActivate = (sw) => this.ai.notifySwitchOn(sw);
            switches.push(s);
        }

        // Urutan render penting: shadow -> box (belakang+depan) -> gurita
        // (tentakel+kepala) -> lid (menutupi lubang saat idle) -> switch (selalu
        // terlihat & bisa diklik) -> particle digambar terakhir oleh renderer.
        this.gameObjects.push(shadow, box, octopus, lid, ...switches);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.isRunning = false;
    }

    loop(timestamp) {
        try {
            if (!this.isRunning) return;

            let dt = timestamp - this.lastTime;
            if (dt < 0) dt = 0;

            this.lastTime = timestamp;
            if (dt > 1000) dt = this.timeStep;

            this.accumulator += dt;
            while (this.accumulator >= this.timeStep) {
                this.update(this.timeStep / 1000);
                this.accumulator -= this.timeStep;
            }

            this.render();
            requestAnimationFrame(this.loop);
        } catch (error) {
            this.isRunning = false;
            console.error("Crash in Game Loop:", error);
            document.body.innerHTML += `<div style="position:absolute;top:10%;left:5%;right:5%;background:#ff3333;color:white;padding:20px;border-radius:10px;z-index:9999;font-family:monospace;box-shadow:0 10px 30px rgba(0,0,0,0.5);"><b>ENGINE CRASH:</b><br><br>${error.message}</div>`;
        }
    }

    update(dt) {
        this.gameObjects.forEach(obj => {
            if (typeof obj.update === 'function') {
                obj.update(dt, this.input, this.audio, this.particles);
            }
        });

        if (this.ai) this.ai.update(dt);
        this.particles.update(dt);
        this.input.reset();
    }

    render() {
        this.renderer.render(this.gameObjects, this.particles);
    }
}
