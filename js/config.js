/**
 * js/config.js
 * Menyimpan semua parameter global, physics, dan state untuk game.
 */

export const CONFIG = {
    // Pengaturan Tampilan & Render
    DISPLAY: {
        WIDTH: 1280,           // Resolusi logis internal kanvas
        HEIGHT: 720,
        TARGET_FPS: 60,
        PIXEL_RATIO: window.devicePixelRatio || 1
    },

    // Konstanta Fisika (Physics & IK)
    PHYSICS: {
        GRAVITY: 0.8,          // Tarikan gravitasi pada tentakel/tutup kotak
        FRICTION: 0.95,        // Gesekan udara
        SPRING_TENSION: 0.1,   // Ketegangan pegas untuk tutup kotak (Lid)
        SPRING_DAMPING: 0.8    // Redaman agar tutup tidak memantul selamanya
    },

    // Pengaturan Game & Objek
    GAME: {
        SWITCH_COUNT: 7,               // 7 switch seperti permintaan
        TENTACLE_SEGMENTS: 15,         // Jumlah sendi tentakel untuk IK
        TENTACLE_SEGMENT_LENGTH: 20,   // Panjang tiap sendi tentakel
        BOX_WIDTH: 500,
        BOX_HEIGHT: 200
    },

    // State Machine untuk AI Gurita
    AI_STATE: {
        SLEEP: 0,       // Tertidur di dalam kotak
        ALERT: 1,       // Switch ditekan, gurita bangun
        PEEK: 2,        // Membuka tutup kotak sedikit untuk mengintip
        REACH: 3,       // Menjulurkan tentakel menuju switch
        PRESS: 4,       // Menekan switch untuk mematikannya
        RETRACT: 5,     // Menarik tentakel kembali ke dalam kotak
        ANGRY: 6        // Mode marah jika pemain menekan terlalu cepat/banyak
    },

    // Tuning perilaku AI (mode marah dipicu spam switch)
    AI: {
        ANGRY_TRIGGER_COUNT: 5,    // Berapa kali switch ditekan dalam window ini untuk memicu ANGRY
        ANGRY_WINDOW_MS: 4000,
        ANGRY_DURATION_MS: 3000
    }
};
