"use client";
import { useEffect, useState } from "react";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { HomeIcon, ClipboardDocumentCheckIcon, TrophyIcon } from "@heroicons/react/24/outline";

const API_URL = "https://sakaton.vercel.app/api";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function authenticate() {
      const storedToken = localStorage.getItem("jwt_token");

      if (storedToken) {
        setLoading(false);
        return;
      }

      const tg = (window as unknown as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp;
      if (!tg || !tg.initData) {
        setError("Erro: Não foi possível carregar os dados do Telegram.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/authenticate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        });

        if (!response.ok) throw new Error("Falha na autenticação.");

        const data = await response.json();
        localStorage.setItem("jwt_token", data.token);
      } catch (err) {
        console.error("Erro ao autenticar no Telegram:", err);
        setError("Erro na autenticação. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    authenticate();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-yellow-400 text-xl">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <p className="text-xl">{error}</p>
        <button
          onClick={() => window.location.reload()} // 🔄 Atualiza a página corretamente
          className="mt-4 bg-yellow-500 px-4 py-2 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <html lang="en">
      <body className={`${pressStart2P.className} bg-gray-900 text-white antialiased relative min-h-screen`}>
        {/* Top Nav (SakaTON) */}
        <nav className="fixed top-0 left-0 w-full bg-gray-800 border-b border-gray-700 px-4 py-3 z-50 flex items-center justify-center">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-base sm:text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 tracking-widest">
            SakaTON
          </h1>
        </nav>

        {/* Main Content with spacing for top & bottom nav */}
        <main className="pt-16 pb-16">{children}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-3">
          <ul className="flex justify-around items-center">
            {[
              { href: "/", label: "Home", Icon: HomeIcon },
              { href: "/tasks", label: "Tasks", Icon: ClipboardDocumentCheckIcon },
              { href: "/ranking", label: "Ranking", Icon: TrophyIcon },
            ].map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex flex-col items-center justify-center text-xs sm:text-sm p-2 rounded-lg bg-gray-700 hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="mt-1">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </body>
    </html>
  );
}
