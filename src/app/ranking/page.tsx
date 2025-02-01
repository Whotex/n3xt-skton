"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = "https://sakaton.vercel.app/api"; // URL da API

interface UserData {
  id: string;
  first_name: string;
  points: number;
  rank: number;
}

export default function RankingPage() {
  const [topTen, setTopTen] = useState<UserData[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myPoints, setMyPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch(`${API_BASE_URL}/getRanking`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // ✅ Enviando JWT
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar ranking.");

        const data = await response.json();

        if (!data || !data.top_10) {
          throw new Error("Ranking não encontrado.");
        }

        // Atualiza os estados com os dados recebidos da API
        setTopTen(data.top_10); // Top 10 usuários
        setMyRank(data.user_rank?.rank ?? null);
        setMyPoints(data.user_rank?.points ?? null);
      } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        setError("Não foi possível carregar o ranking.");
      } finally {
        setLoading(false);
      }
    }

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-4 border-t-yellow-400 rounded-full animate-spin"></div>
          <p className="text-xl text-yellow-300 animate-pulse text-center">
            Carregando ranking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-8 pb-20 px-4">
      {/* Mensagem de erro */}
      {error && (
        <motion.div
          className="bg-red-500 text-white px-4 py-2 rounded-md text-center mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

      {/* Cartão de ranking do usuário */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 tracking-widest">
          Ranking Geral
        </h2>
        <p className="text-center text-lg font-semibold">
          Sua posição atual:{" "}
          <span className="text-yellow-300 text-2xl">{myRank ?? "?"}º</span>
        </p>
        <p className="text-center">
          Seus pontos:{" "}
          <span className="text-yellow-300 font-semibold">{myPoints ?? "?"}</span>
        </p>
      </motion.div>

      {/* Lista Top 10 */}
      <motion.div
        className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-4 text-center text-yellow-300">
          Top 10
        </h3>
        {topTen.length === 0 ? (
          <p className="text-center">Nenhum usuário encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {topTen.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3"
              >
                {/* Posição */}
                <div className="w-8 text-center text-yellow-400 font-bold">
                  {user.rank}
                </div>
                {/* Nome do usuário */}
                <div className="flex-1 text-center">
                  {user.first_name || `Usuário ${user.rank}`}
                </div>
                {/* Pontos */}
                <div className="w-16 text-right text-yellow-300 font-semibold">
                  {user.points}
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </section>
  );
}
