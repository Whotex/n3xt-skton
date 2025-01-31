"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

interface UserData {
  id: string;
  displayName?: string;
  points?: number;
}

// Se você precisar, pode ajustar a forma de receber o userId.
// Aqui, faremos de exemplo fixo "test-user", mas você pode
// usar Context/Auth para obter o ID real do usuário logado.
const USER_ID = "test-user";

export default function RankingPage() {
  const [topTen, setTopTen] = useState<UserData[]>([]);
  const [myRank, setMyRank] = useState<number>(0);
  const [myPoints, setMyPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Pegar pontos do usuário atual
        const userRef = doc(db, "users", USER_ID);
        const userSnap = await getDoc(userRef);

        let userPoints = 0;
        if (userSnap.exists()) {
          userPoints = userSnap.data().points || 0;
        }
        setMyPoints(userPoints);

        // 2) Buscar TODOS os usuários ordenados por points desc
        const usersRef = collection(db, "users");
        const rankingQuery = query(usersRef, orderBy("points", "desc"));
        const allSnap = await getDocs(rankingQuery);

        // 3) Calcular rank do usuário
        //    Percorre cada doc e incrementa rank se tiver mais pontos que user
        let rankCounter = 1;
        const allDocs: UserData[] = [];
        allSnap.forEach((docSnap) => {
          const data = docSnap.data();
          const userData: UserData = {
            id: docSnap.id,
            displayName: data.displayName,
            points: data.points || 0,
          };
          allDocs.push(userData);
        });
        // Ordenar localmente (embora já esteja ordenado, mas p/ garantir).
        allDocs.sort((a, b) => (b.points || 0) - (a.points || 0));

        for (const docItem of allDocs) {
          if ((docItem.points || 0) > userPoints) {
            rankCounter++;
          } else {
            break;
          }
        }
        setMyRank(rankCounter);

        // 4) Pegar top 10
        const topTenDocs = allDocs.slice(0, 10);
        setTopTen(topTenDocs);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Indicador de carregamento */}
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
      {/* Título e Cartão de rank */}
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
          <span className="text-yellow-300 text-2xl">{myRank}º</span>
        </p>
        <p className="text-center">
          Seus pontos:{" "}
          <span className="text-yellow-300 font-semibold">{myPoints}</span>
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
            {topTen.map((user, index) => (
              <li
                key={user.id}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3"
              >
                {/* Posição */}
                <div className="w-8 text-center text-yellow-400 font-bold">
                  {index + 1}
                </div>
                {/* Nome do usuário */}
                <div className="flex-1 text-center">
                  {user.displayName || user.id}
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
