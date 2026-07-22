/**
 * objects/GameObject.js
 * Base class untuk semua entitas yang akan di-render di dalam game.
 */

export class GameObject {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;

        // Jika isActive false, engine tidak akan meng-update atau merender objek ini
        this.isActive = true;
    }

    /**
     * Memperbarui logika fisika atau state objek.
     * @param {number} dt - Delta time dalam hitungan detik
     */
    update(dt) {
        // Akan dioverride oleh child class (Box, Octopus, Switch, dll.)
    }

    /**
     * Merender objek ke kanvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Akan dioverride oleh child class
    }

    /**
     * Utilitas dasar untuk mendeteksi apakah kursor berada di dalam batas objek (AABB)
     */
    checkHover(inputX, inputY, width, height) {
        return (
            inputX >= this.x &&
            inputX <= this.x + width &&
            inputY >= this.y &&
            inputY <= this.y + height
        );
    }
}
