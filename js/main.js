/**
 * js/main.js
 * Entry point aplikasi. Mengatur UI DOM dan menjalankan Game Engine.
 */

import { CONFIG } from './config.js';
import { Engine } from './engine.js';

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    initGame();
});

function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function initGame() {
    const canvas = document.getElementById('game-canvas');
    const loadingScreen = document.getElementById('loading-screen');

    try {
        const game = new Engine(canvas);
        game.start();

        loadingScreen.classList.add('hidden');

        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 500);

        console.log("Octopus Useless Box v2: Sistem Siap.");
    } catch (error) {
        console.error("Gagal menginisialisasi game:", error);
        loadingScreen.innerText = "Terjadi kesalahan saat memuat game.";
    }
}
