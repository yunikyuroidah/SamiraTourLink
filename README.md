# 🌐 SAMIRATOURLINK - SAMIRA TRAVEL

Aplikasi web modern untuk Samira Travel, dibangun menggunakan React, Tailwind, TypeScript, dan Vite. Proyek ini berfungsi sebagai *interface* utama.

[![Teknologi](https://img.shields.io/badge/Frontend-React%20%26%20TS-blueviolet.svg)]()
[![Styling](https://img.shields.io/badge/CSS-TailwindCSS-06B6D4.svg)]()
[![Status Proyek](https://img.shields.io/badge/Status-Aktif-brightgreen.svg)]()

## 🛠️ Teknologi yang Digunakan

Proyek ini memanfaatkan *modern stack* berikut:

* **Framework:** React v18
* **Bahasa:** TypeScript
* **Bundler & Tooling:** Vite
* **Styling:** Tailwind CSS & PostCSS
* **Database/Backend Connection:** Firebase

## 🚀 Fitur Utama

* **Tampilan Publik:** Halaman Utama (`Hero.tsx`), Galeri (`Gallery.tsx`), dan Tentang Kami (`About.tsx`).
* **Komponen Spesifik:** Komponen untuk menampilkan paket (`Packages.tsx`), *tour leader* (`Leader.tsx`), dan keunggulan (`Keunggulan.tsx`).
* **Rute Admin:** Terdapat rute-rute admin terpisah (`admin-login.tsx`, `admin-packages.tsx`, `admin-profile-travel.tsx`, dll.) yang dilindungi oleh `PrivateRoute.tsx`.
* **Integrasi Firebase:** Manajemen data melalui konfigurasi Firebase.

## ⚙️ Persyaratan Sistem

* Node.js (Versi disarankan: 18 atau lebih baru)
* npm atau Yarn (npm v8+ disarankan)
