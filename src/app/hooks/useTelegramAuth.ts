// hooks/useTelegramAuth.ts
"use client";

import { useEffect, useState } from "react";

const API_URL = "https://sakaton.vercel.app/api";

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

export function useTelegramAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [telegramLoaded, setTelegramLoaded] = useState(false);

  // Carrega o SDK do Telegram
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

  // Realiza a autenticação assim que o Telegram estiver carregado
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
  }, [telegramLoaded]);

  return { loading, error };
}
