# Kawuruh Pranoto Mongso v0.8.4

Aplikasi interaktif modern berbasis penanggalan tradisional Jawa **Pranata Mangsa** untuk membaca sasmita alam (tanda-tanda ekologis), merencanakan aktivitas pertanian, dan hidup selaras dengan ritme alam kosmologi nusantara.

---

## Fitur Utama

- **12 Mangsa Lengkap & Akurat**: Menampilkan seluruh siklus lengkap dari Kasa, Karo, Katelu, Kapat, Kalima, Kanem, Kapitu, Kawolu, Kasanga, Kadasa, Desta, hingga Saddha dengan panduan candra, sasmita, durasi, dan rekomendasi aktivitas agraris.
- **Dynamic Date-to-Mangsa Sync**: Pencarian otomatis penanggalan masehi ke dalam siklus surya Pranata Mangsa Jawa. Memungkinkan pengguna memilih tanggal secara interaktif untuk melihat ramalan mangsa di masa depan maupun sejarah masa lalu.
- **Live Weather Integration (Satelit & Geoposisi)**: Sinkronisasi cuaca waktu nyata menggunakan koordinat GPS pengguna melalui integrasi Open-Meteo API dan pencarian nama wilayah secara otomatis menggunakan OpenStreetMap Nominatim.
- **Jurnal Sasmita Luhur**: Pengarsipan catatan observasi lokal mandiri secara persisten menggunakan `localStorage` dengan validasi input yang aman.
- **Kecerdasan Buatan (Gemini AI)**: Layanan analisis ekologis terintegrasi yang mampu menyusun kesimpulan kondisi lingkungan lokal dan memberikan rekomendasi pertanian presisi berdasarkan jurnal observasi Anda.

---

## Struktur Proyek

- `/server.ts` — Server full-stack berbasis Express yang menangani proxy API kecerdasan buatan Gemini secara aman.
- `/src/App.tsx` — Pusat interaksi utama aplikasi yang mengoordinasikan status cuaca realtime, kalender dinamis, dan entri observasi.
- `/src/utils/dateUtils.ts` — Logika pemetaan matematis penanggalan Masehi ke 12 Siklus Pranata Mangsa Jawa.
- `/src/data.ts` — Basis data statis sasmita agraris dan 12 siklus mangsa luhur Jawa.
- `/src/components/` — Kumpulan komponen antarmuka mandiri (HeaderSection, AiAnalysisView, AddObservationModal).

---

## Log Perubahan (Changelog)

### v0.8.4 — Pembaruan Stabilisasi & Sinkronisasi Realtime
- **Penyelarasan Kalender Surya**: Mengintegrasikan algoritma konversi penanggalan Gregorius ke Pranata Mangsa pada modul `src/utils/dateUtils.ts`.
- **Interaksi Tanggal Dinamis**: Menyediakan komponen input tanggal masehi untuk memperbarui status Mangsa yang aktif secara langsung.
- **Prakiraan Cuaca Realtime**: Mengimplementasikan sensor geoposisi (Geolocation API) browser terintegrasi Open-Meteo untuk menampilkan cuaca lokal yang sesungguhnya di pekarangan pengguna.
- **Peningkatan Konteks AI**: Memperbaiki prompt server untuk merangkum mangsa secara cerdas bahkan jika jurnal observasi masih kosong.
- **Ikon Shortcut Baru**: Mendesain ulang ikon berlatar belakang hitam berkontras tinggi untuk mempermudah pemasangan shortcut layar beranda.
- **Pemberihan Kode & Struktur**: Menata ulang dependensi, memperbarui versi metadata pada `package.json` dan `metadata.json`, serta menghapus variabel usang.
