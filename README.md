Folder ini sengaja dikosongkan (kecuali file ini).

- Grafis digambar prosedural langsung ke <canvas> (tidak pakai SVG/PNG file),
  jadi folder svg/ dan textures/ tidak dipakai untuk versi ini.
- Semua efek suara disintesis langsung lewat Web Audio API (lihat js/audio.js),
  jadi folder sound/ juga tidak butuh file .mp3/.wav.

Keuntungannya: repo tetap ringan (nyaris 0 KB aset biner) dan gampang di-deploy
ke GitHub Pages tanpa masalah lisensi/hosting aset.
