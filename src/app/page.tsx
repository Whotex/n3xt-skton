"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Clicker from "./components/Clicker";

const API_BASE_URL = "https://sakaton.vercel.app/api";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Usuário não autenticado.");

        // Chamada para o endpoint /getPoints
        const responsePoints = await fetch(`${API_BASE_URL}/getPoints`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!responsePoints.ok) throw new Error("Erro ao buscar pontuação.");
        const dataPoints = await responsePoints.json();
        setUserPoints(dataPoints.points || 0);

        // Chamada para o endpoint /getUser para pegar o user_id
        const responseUser = await fetch(`${API_BASE_URL}/getUser`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!responseUser.ok) throw new Error("Erro ao buscar dados do usuário.");
        const dataUser = await responseUser.json();
        setUserId(dataUser.user.id);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError("Erro ao buscar dados do usuário.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("seenPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("seenPopup", "true");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <p className="text-xl text-yellow-300 animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <p className="text-xl text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-yellow-500 px-4 py-2 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28">
      {/* Removido o gradiente de fundo para deixar o background global aparecer */}

      {/* 🏆 Janela flutuante (exibe apenas na primeira vez) */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-16 sm:top-24 left-1/2 transform -translate-x-1/2 
            bg-gray-900/90 backdrop-blur-md border-4 border-yellow-400
            shadow-2xl rounded-lg p-6 max-w-lg w-full text-center
            font-mono text-white z-50"
        >
          <button
            className="absolute top-2 right-2 bg-yellow-400 text-black font-bold px-2 py-1 rounded shadow-md hover:bg-yellow-500 transition"
            onClick={() => setShowPopup(false)}
          >
            ✖
          </button>

          <h2 className="text-2xl text-yellow-400 mb-3 tracking-widest">
            🚀 Novidades!
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Bem-vindo ao SakaTON! Clique para acumular pontos e compita no ranking global. Fique atento para novas atualizações em breve!
          </p>
        </motion.div>
      )}

      {/* 🎮 Área principal do Clicker */}
      <div className="z-10 flex flex-col items-center gap-6 px-4 pt-4">
        {userId && userPoints !== null ? (
          <Clicker _userId={userId} userPoints={userPoints} />
        ) : (
          <p className="text-yellow-300">Carregando...</p>
        )}
      </div>
    </section>
  );
}
