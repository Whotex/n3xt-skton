/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Garante que está usando a estrutura correta do Next.js 13+
  },
  distDir: ".next", // Garante que o Netlify use a pasta de build correta
};

export default nextConfig;