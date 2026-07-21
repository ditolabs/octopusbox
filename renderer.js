import { CONFIG } from './config.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.logicalWidth = CONFIG.DISPLAY.WIDTH;
        this.logicalHeight = CONFIG.DISPLAY.HEIGHT;

        this.init();
    }

    init() {
        window.addEventListener('resize', () => this.resize());
        // Memberi sedikit jeda agar DOM HP selesai me-render container
        setTimeout(() => this.resize(), 50);
    }

    resize() {
        const parent = this.canvas.parentElement;
        const windowWidth = parent.clientWidth || window.innerWidth;
        const windowHeight = parent.clientHeight || window.innerHeight;

        if (windowWidth === 0 || windowHeight === 0) {
            setTimeout(() => this.resize(), 100);
            return;
        }

        const scaleX = windowWidth / this.logicalWidth;
        const scaleY = windowHeight / this.logicalHeight;
        const scale = Math.min(scaleX, scaleY);

        const displayWidth = Math.floor(this.logicalWidth * scale);
        const displayHeight = Math.floor(this.logicalHeight * scale);

        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;

        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = Math.floor(displayWidth * dpr);
        this.canvas.height = Math.floor(displayHeight * dpr);

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(scale * dpr, scale * dpr);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    }

    render(gameObjects, particles) {
        this.clear();
        gameObjects.forEach(obj => {
            if (obj.isActive && typeof obj.draw === 'function') {
                obj.draw(this.ctx);
            }
        });
        if (particles) particles.draw(this.ctx);
    }
}
