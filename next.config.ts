/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  distDir: ".next", // Garante que o Netlify use a pasta de build correta
};

export default nextConfig;