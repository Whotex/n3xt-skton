"use client";

import { useEffect, useState } from "react";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { HomeIcon, ClipboardDocumentCheckIcon, TrophyIcon } from "@heroicons/react/24/outline";
import "./globals.css";

const API_URL = "https://sakaton.vercel.app/api";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

// Define global types for Telegram WebApp
declare global {
  interface TelegramWebApp {
    initData?: string;
    initDataUnsafe?: {
      user?: {
        id: number;
        first_name?: string;
        last_name?: string;
        username?: string;
        language_code?: string;
      };
      auth_date?: number;
      hash?: string;
    };
    sendData?: (data: string) => void;
    close?: () => void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [telegramLoaded, setTelegramLoaded] = useState(false);

  useEffect(() => {
    function loadTelegramSDK() {
      if (window.Telegram?.WebApp) {
        console.log("✅ Telegram SDK already loaded.");
        setTelegramLoaded(true);
        return;
      }

      console.log("🔄 Loading Telegram SDK...");
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js?56";
      script.async = true;
      script.onload = () => {
        console.log("✅ Telegram SDK Loaded.");
        setTelegramLoaded(true);
      };
      document.head.appendChild(script);
    }

    loadTelegramSDK();
  }, []);

  useEffect(() => {
    async function authenticate() {
      if (!telegramLoaded) return;

      try {
        console.log("🔍 Checking `window.Telegram.WebApp`...", window.Telegram?.WebApp);

        if (typeof window === "undefined" || !window.Telegram?.WebApp) {
          throw new Error("🚨 Telegram WebApp is not available.");
        }

        const tg = window.Telegram.WebApp;
        console.log("✅ Telegram WebApp Detected:", tg);

        if (!tg.initData || tg.initData === "") {
          throw new Error("🚨 Telegram WebApp did not provide initData.");
        }

        console.log("🔄 Authenticating...");

        const response = await fetch(`${API_URL}/authenticate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        });

        if (!response.ok) throw new Error("🚨 Authentication failed.");

        const data = await response.json();
        localStorage.setItem("jwt_token", data.token); // ✅ Sempre salva o novo JWT

        console.log("✅ New JWT stored:", data.token);
      } catch (err) {
        console.error("❌ Telegram Authentication Error:", err);
        setError("Authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    authenticate();
  }, [telegramLoaded]); // ✅ Agora sempre autentica ao abrir o app

  return (
    <html lang="en">
      <body className={`${pressStart2P.className} bg-gray-900 text-white antialiased relative min-h-screen`}>
        {/* Loading Screen While Authenticating */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-yellow-400">
            <p className="text-lg">🔄 Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-screen text-red-500">
            <p className="text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-yellow-500 px-4 py-2 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 w-full bg-gray-800 border-b border-gray-700 px-4 py-3 z-50 flex items-center justify-center">
              <h1 className="absolute left-1/2 transform -translate-x-1/2 text-base sm:text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 tracking-widest">
                SakaTON
              </h1>
            </nav>

            {/* Main Content */}
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
          </>
        )}
      </body>
    </html>
  );
}
