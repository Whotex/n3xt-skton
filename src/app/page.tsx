"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Clicker from "./components/Clicker";

export default function Home() {
  const userId = "test-user";
  const [showPopup, setShowPopup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Verifica se já mostrou a janela inicial antes (exibe apenas na primeira vez)
    const hasSeenPopup = localStorage.getItem("seenPopup");
    if (!hasSeenPopup) {
      setShowPopup(true);
      localStorage.setItem("seenPopup", "true");
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900 via-black to-gray-900 overflow-hidden">
      {/* Gradiente de fundo para efeito extra */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />

      {/* 🏆 Janela flutuante - só aparece uma vez quando o usuário entra */}
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
          {/* Botão de Fechar */}
          <button
            className="absolute top-2 right-2 bg-yellow-400 text-black font-bold px-2 py-1 rounded shadow-md hover:bg-yellow-500 transition"
            onClick={() => setShowPopup(false)}
          >
            ✖
          </button>

          {/* Conteúdo da Janela */}
          <h2 className="text-2xl text-yellow-400 mb-3 tracking-widest">
            🚀 Novidades!
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Bem-vindo ao SakaTON! Aqui você pode clicar para acumular pontos e competir no ranking global. Fique atento para novas atualizações em breve!
          </p>
        </motion.div>
      )}

      {/* 🛠️ Sidebar flutuante na esquerda */}
      <motion.div
        animate={{
          x: sidebarOpen ? 0 : "-85%", // Abre ou esconde
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-1/4 left-0 h-60 w-64 bg-gray-900/90 backdrop-blur-md 
          border-r-4 border-yellow-400 shadow-lg rounded-r-lg p-4 z-40 flex flex-col"
      >
        {/* Botão para abrir/fechar a sidebar */}
        <button
          className="absolute top-1/2 -right-6 transform -translate-y-1/2
            bg-yellow-400 text-black font-bold px-2 py-1 rounded-r shadow-md
            hover:bg-yellow-500 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "❮" : "❯"}
        </button>

        {/* Conteúdo da Sidebar */}
        <h2 className="text-yellow-400 text-xl tracking-widest">📢 INFO</h2>
        <p className="text-gray-300 text-sm mt-2">
          Esta seção pode ser usada para carregar dados de uma API no futuro.
        </p>
      </motion.div>

      {/* 🎮 Área principal do Clicker */}
      <div className="z-10 flex flex-col items-center gap-6 px-4">
        <Clicker userId={userId} />
      </div>
    </section>
  );
}
