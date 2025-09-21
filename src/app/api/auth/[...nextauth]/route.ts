import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

// Perhatikan: AUTH_URL, AUTH_SECRET, AUTH_GITHUB_ID, dan AUTH_GITHUB_SECRET
// secara otomatis dibaca dari file .env.local oleh NextAuth.js v5+

export const { handlers: { GET, POST }, auth } = NextAuth({
  providers: [
    GitHub,
    // Jika Anda ingin menambahkan lebih banyak provider, letakkan di sini
  ],
})
