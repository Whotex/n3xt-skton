"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import crypto from "crypto"; // 🔒 Usado para criar o hash SHA256

const API_BASE_URL = "https://sakaton.vercel.app/api";
const MAX_CLICKS_PER_SECOND = 8;
const CLICKS_PER_REQUEST = 20;

const SECRET_KEY = process.env.NEXT_PUBLIC_CLICKER_SECRET || "defaultSecret"; // 🔒 Frase secreta do `.env.local`
/* eslint-disable @typescript-eslint/no-unused-vars */
interface ClickerProps {
  _userId: string;
  userPoints: number | null;
}

export default function Clicker({ _userId, userPoints }: ClickerProps) {
  const [points, setPoints] = useState<number>(userPoints ?? 0); // ✅ Garante que `userPoints` tenha valor inicial
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);
  const [clicks, setClicks] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const lastClickTimestamps = useRef<number[]>([]);

  useEffect(() => {
    if (userPoints !== null) {
      setPoints(userPoints); // ✅ Atualiza pontos corretamente sempre que `userPoints` mudar
    }
  }, [userPoints]);

  const generateHash = (timestamp: number, jwt: string) => {
    const hmac = crypto.createHmac("sha256", SECRET_KEY);
    hmac.update(`${timestamp}:${jwt}`); // 🔐 Combina timestamp + JWT
    return hmac.digest("hex"); // Retorna o hash
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const now = Date.now();

    lastClickTimestamps.current = lastClickTimestamps.current.filter(
      (timestamp) => now - timestamp <= 1000
    );

    if (lastClickTimestamps.current.length >= MAX_CLICKS_PER_SECOND) return;

    lastClickTimestamps.current.push(now);
    setPoints((prev) => prev + 1);
    setClicks((prev) => prev + 1);
    setClickEffect({ x: event.clientX, y: event.clientY });

    if (clicks + 1 >= CLICKS_PER_REQUEST) {
      sendClicks();
    }

    setTimeout(() => setClickEffect(null), 1000);
  };

  const sendClicks = async () => {
    if (isSending) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Usuário não autenticado.");

      const timestamp = Date.now(); // 🔥 Garante que cada request é única
      const hash = generateHash(timestamp, token); // 🔐 Gera um hash seguro

      const response = await fetch(`${API_BASE_URL}/click`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timestamp, hash }), // 🔐 Envia timestamp + hash
      });

      if (!response.ok) throw new Error("Erro ao registrar clique.");

      setClicks(0);
    } catch (err) {
      console.error("Erro ao enviar cliques:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 relative">
      <p className="text-2xl font-bold text-center">
        Seus Pontos: <span className="text-yellow-400">{points}</span>
      </p>

      <motion.button
        animate={{ y: [0, -10, 0], rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } }}
        onClick={handleClick}
        className="
          relative w-48 h-48 bg-[url('/coin.png')] bg-no-repeat bg-center bg-contain
          image-rendering: pixelated shadow-lg focus:outline-none cursor-pointer
        "
      />

      {clickEffect && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -50, scale: 1.3 }}
          transition={{ duration: 1 }}
          style={{ left: clickEffect.x, top: clickEffect.y, textShadow: "1px 1px 2px black, -1px 1px 2px black" }}
          className="pointer-events-none absolute font-bold text-2xl text-yellow-300 select-none"
        >
          +1
        </motion.div>
      )}
    </div>
  );
}
