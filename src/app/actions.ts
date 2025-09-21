'use server'

import { z } from 'zod';

// Skema untuk memvalidasi input username
const usernameSchema = z.string().min(1, "Username tidak boleh kosong");

// Tipe data untuk hasil yang akan dikembalikan ke klien. Diekspor agar bisa digunakan di komponen lain.
export interface CheckResult {
  username: string;
  accountAgeYears: number;
  publicRepos: number;
  followers: number;
  pullRequests: number;
  score: number;
  allocation: number;
}

// Tipe untuk state form, yang bisa berisi hasil sukses, error, atau null (initial state).
// Diekspor agar bisa digunakan di komponen lain.
export type FormState = {
  status: 'success';
  data: CheckResult;
} | {
  status: 'error';
  message: string;
} | null;

// Mendefinisikan tipe kembalian yang lebih spesifik untuk action
type ActionResult = { status: 'success', data: CheckResult } | { status: 'error', message: string };

// Fungsi utama untuk mengecek kelayakan airdrop berdasarkan username
export async function checkAirdropEligibility(prevState: FormState, formData: FormData): Promise<ActionResult> {
  const validatedFields = usernameSchema.safeParse(formData.get('username'));

  // 1. Validasi input
  if (!validatedFields.success) {
    // Untuk tipe data primitif (seperti string), Zod menempatkan error di `formErrors`.
    const errorMessages = validatedFields.error.flatten().formErrors;
    return {
      status: 'error',
      message: errorMessages[0] || 'Input tidak valid.',
    };
  }

  const username = validatedFields.data;

  try {
    // 2. Ambil data pengguna dasar dan data PR secara bersamaan
    const [userRes, prRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/search/issues?q=author:${username}+is:pr+is:public`)
    ]);

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return { status: 'error', message: `Username '${username}' tidak ditemukan.` };
      }
      throw new Error(`Gagal mengambil data pengguna: ${userRes.statusText}`);
    }

    if (!prRes.ok) {
      throw new Error(`Gagal mengambil data pull request: ${prRes.statusText}`);
    }

    const userData = await userRes.json();
    const prData = await prRes.json();

    // 3. Hitung umur akun
    const createdAt = new Date(userData.created_at);
    const now = new Date();
    const accountAgeYears = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    // 4. Hitung skor
    const score = 
      (accountAgeYears * 10) + 
      (userData.public_repos * 2) + 
      (userData.followers * 1.5) + 
      (prData.total_count * 5);

    // 5. Tentukan alokasi
    let allocation = 0;
    if (score > 100) allocation = 5000;
    else if (score > 50) allocation = 2000;
    else if (score > 20) allocation = 500;
    else if (score > 0) allocation = 100;

    const result: CheckResult = {
        username: userData.login,
        accountAgeYears: Math.floor(accountAgeYears),
        publicRepos: userData.public_repos,
        followers: userData.followers,
        pullRequests: prData.total_count,
        score: Math.round(score),
        allocation: allocation,
    };

    return { status: 'success', data: result };

  } catch (error) {
    console.error("Error dalam checkAirdropEligibility:", error);
    return { status: 'error', message: 'Terjadi kesalahan pada server saat memproses permintaan Anda.' };
  }
}
