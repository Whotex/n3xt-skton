"use client";

import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import { useTelegramAuth } from "./hooks/useTelegramAuth";
import TopNavigation from "./components/TopNavigation";
import BottomNavigation from "./components/BottomNavigation";
import LoadingScreen from "./components/LoadingScreen";  // Importação do novo componente

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { loading, error } = useTelegramAuth();

  // Exibe uma tela de loading enquanto a autenticação ocorre
  if (loading) {
    return (
      <html lang="en">
        <body className={`${pressStart2P.className} bg-gray-900 text-white antialiased relative min-h-screen`}>
          <LoadingScreen />
        </body>
      </html>
    );
  }

  // Em caso de erro, mostra uma mensagem e permite tentar novamente
  if (error) {
    return (
      <html lang="en">
        <body className={`${pressStart2P.className} bg-gray-900 text-white antialiased relative min-h-screen`}>
          <div className="flex flex-col justify-center items-center h-screen text-red-500">
            <p className="text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-yellow-500 px-4 py-2 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
            >
              Try Again
            </button>
          </div>
        </body>
      </html>
    );
  }

  // Renderiza o layout principal, incluindo as barras de navegação e o conteúdo da página
  return (
    <html lang="en">
      <body className={`${pressStart2P.className} bg-gray-900 text-white antialiased relative min-h-screen`}>
        <TopNavigation />
        <main className="pt-24 pb-16">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
