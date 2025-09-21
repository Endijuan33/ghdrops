# Blueprint Aplikasi: GitHub Airdrop Checker

## 1. Ringkasan & Tujuan

Aplikasi "GitHub Airdrop Checker" adalah alat berbasis web yang dirancang untuk memungkinkan pengguna GitHub dengan cepat memeriksa kelayakan mereka untuk mendapatkan airdrop token. Kelayakan ditentukan berdasarkan metrik aktivitas publik akun GitHub mereka. Aplikasi ini menawarkan dua metode pengecekan dan pengalaman pengguna yang sangat dinamis dan interaktif.

---

## 2. Arsitektur & Desain yang Diimplementasikan

### Stack Teknologi
- **Framework**: Next.js 14+ (dengan App Router)
- **Bahasa**: TypeScript
- **Autentikasi**: Next-Auth.js v5 (Auth.js)
- **Styling**: Tailwind CSS
- **Animasi & Interaksi**: Framer Motion, React Parallax Tilt
- **Validasi**: Zod

### Fitur Inti & Fungsionalitas

**A. Pengecekan Ganda (Dual-Method Check):**

1.  **Pengecekan Otomatis (via Login):**
    - Pengguna dapat login dengan aman menggunakan akun GitHub mereka.
    - Setelah login, aplikasi menampilkan `UserCard` yang secara otomatis memeriksa dan menampilkan hasil kelayakan.

2.  **Pengecekan Manual (via Username):**
    - Pengguna dapat memasukkan username GitHub ke dalam form input.
    - Form ini menggunakan **Server Action** Next.js untuk memicu logika backend secara langsung dan aman.
    - Hasilnya ditampilkan secara dinamis di bawah form tanpa perlu me-refresh halaman.

**B. Logika Perhitungan Skor & Alokasi:**

- **Pengambilan Data**: Mengambil umur akun, jumlah repositori publik, pengikut, dan pull request dari GitHub API.
- **Formula Skor**: `Skor = (UmurAkun * 10) + (Repositori * 2) + (Followers * 1.5) + (PR * 5)`
- **Tingkat Alokasi**: Alokasi token ditentukan berdasarkan skor (5000, 2000, 500, atau 100 token).

**C. Desain Antarmuka & UX (Pengalaman Pengguna):**

- **Desain Glassmorphism**: Menggunakan efek `glass-card` (latar belakang buram dengan border) untuk tampilan yang modern.
- **Efek 3D Interaktif**: Semua kartu utama (`UserCard`, form input, kartu hasil) menggunakan `react-parallax-tilt` untuk memberikan efek miring 3D yang merespons gerakan mouse, menciptakan nuansa premium dan interaktif.
- **Animasi Halus**: Komponen dianimasikan menggunakan `framer-motion` untuk efek `fade-in` dan `stagger` saat muncul, membuat antarmuka terasa hidup.
- **Umpan Balik Status Lanjutan**:
    - **Skeleton Loading**: Menampilkan komponen *skeleton loader* dengan efek *shimmer* saat data sedang diambil, memberikan umpan balik visual yang jelas kepada pengguna.
    - **Tombol Dinamis**: Tombol submit menampilkan status `pending` (Memeriksa...) selama Server Action berjalan.
- **Tipografi & Ikonografi**: Penggunaan ikon dari `lucide-react` dan gradien teks (`text-gradient`) untuk memperkuat hierarki visual dan keterbacaan.

**D. Kualitas Kode & Refaktor:**

- **Type-Safety Penuh**: Menghilangkan semua penggunaan tipe `any` dengan mendefinisikan dan menerapkan tipe `CheckResult` dan `FormState` di seluruh codebase (dari `actions.ts` hingga komponen React), memastikan keamanan tipe dari ujung ke ujung.
- **Hooks Modern**: Mengadopsi hook `useActionState` dari React, menggantikan `useFormState` dari `react-dom` untuk manajemen state form yang lebih modern.
- **Kode Bersih (Lint-Free)**: Seluruh basis kode telah divalidasi dengan `ESLint` untuk memastikan tidak ada error atau peringatan, termasuk memperbaiki `interface` kosong dengan `type` alias untuk praktik terbaik.

---

## 3. Rencana Perubahan (Sesi Saat Ini - Selesai)

*   **Tujuan**: Meningkatkan pengalaman visual dan kualitas kode secara fundamental.
*   **Langkah-langkah yang Diselesaikan**:
    1.  **Implementasi Efek Visual**: Mengintegrasikan `react-parallax-tilt` di semua komponen kartu untuk efek 3D interaktif.
    2.  **Migrasi Hook**: Memperbarui `useFormState` ke `useActionState` di seluruh aplikasi untuk mengikuti praktik React terbaru.
    3.  **Refaktor Tipe TypeScript**: Membuat tipe `FormState` dan `CheckResult` untuk menghilangkan semua penggunaan `any` dan memastikan keamanan tipe.
    4.  **Pembersihan Kode**: Menjalankan `npm run lint` dan memperbaiki semua error yang dilaporkan, termasuk masalah `interface` kosong pada komponen `Input`.
    5.  **Pembaruan Blueprint**: Mendokumentasikan semua peningkatan visual, interaktivitas, dan kualitas kode yang telah diimplementasikan.
