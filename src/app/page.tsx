"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Clicker from "./components/Clicker";

const API_BASE_URL = "https://sakaton.vercel.app/api";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch(`${API_BASE_URL}/getPoints`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar pontuação.");

        const data = await response.json();
        setUserPoints(data.points || 0);
        setUserId(data.user_id);
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
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900 via-black to-gray-900 overflow-hidden">
      {/* Gradiente de fundo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />

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

      {/* 🛠️ Sidebar flutuante na esquerda */}
      <motion.div
        animate={{
          x: sidebarOpen ? 0 : "-90%",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-1/4 left-0 h-60 w-64 bg-gray-900/90 backdrop-blur-md 
          border-r-4 border-yellow-400 shadow-lg rounded-r-lg p-4 z-40 flex flex-col"
      >
        <button
          className="absolute top-1/2 -right-6 transform -translate-y-1/2
            bg-yellow-400 text-black font-bold px-2 py-1 rounded-r shadow-md
            hover:bg-yellow-500 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "❮" : "❯"}
        </button>

        <h2 className="text-yellow-400 text-xl tracking-widest">📢 INFO</h2>
        <p className="text-gray-300 text-sm mt-2">
          Esta seção pode ser usada para carregar dados de uma API no futuro.
        </p>
      </motion.div>

      {/* Caixa de Dados do Usuário - Centralizada no topo */}
      {userId && userPoints !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-lg shadow-xl border-4 border-yellow-400 p-4 mb-6"
          style={{
            backgroundImage: "url('/wood-texture.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl font-bold text-center text-black">Bem-vindo!</h2>
          <p className="mt-2 text-center text-black">ID: {userId}</p>
          <p className="mt-1 text-center text-black">Pontos: {userPoints}</p>
        </motion.div>
      )}

      {/* 🎮 Área principal do Clicker */}
      <div className="z-10 flex flex-col items-center gap-6 px-4">
        {userId && userPoints !== null ? (
          <Clicker _userId={userId} userPoints={userPoints} />
        ) : (
          <p className="text-yellow-300">Carregando...</p>
        )}
      </div>
    </section>
  );
}
