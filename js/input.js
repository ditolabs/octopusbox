/**
 * js/input.js
 * Menangani interaksi pengguna (Mouse & Touch) dan memetakannya ke koordinat internal game.
 */

import { CONFIG } from './config.js';

export class Input {
    constructor(canvas) {
        this.canvas = canvas;

        this.x = 0;
        this.y = 0;

        this.isDown = false;
        this.isClicked = false;

        this.init();
    }

    init() {
        window.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
        window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    }

    updateCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();

        const scaleX = CONFIG.DISPLAY.WIDTH / rect.width;
        const scaleY = CONFIG.DISPLAY.HEIGHT / rect.height;

        this.x = (e.clientX - rect.left) * scaleX;
        this.y = (e.clientY - rect.top) * scaleY;
    }

    handlePointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        this.updateCoordinates(e);
        this.isDown = true;
        this.isClicked = true;
    }

    handlePointerUp(e) {
        this.isDown = false;
    }

    handlePointerMove(e) {
        this.updateCoordinates(e);
    }

    reset() {
        this.isClicked = false;
    }
}
