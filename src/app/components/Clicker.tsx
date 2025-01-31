"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../lib/firebaseConfig";
import { doc, setDoc, getDoc, increment } from "firebase/firestore";

export default function Clicker({ userId }: { userId: string }) {
  const [points, setPoints] = useState(0);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setPoints(userSnap.data().points || 0);
        }
      } catch (err) {
        console.error("Erro ao buscar pontos do usuário:", err);
        setError("Erro ao carregar pontos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [userId]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setPoints((prev) => prev + 1);
      setClickEffect({ x: event.clientX, y: event.clientY });

      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { points: increment(1) }, { merge: true });
    } catch (err) {
      console.error("Erro ao atualizar pontuação:", err);
      setError("Erro ao registrar clique.");
    } finally {
      setTimeout(() => setClickEffect(null), 1000);
    }
  };

  if (loading) {
    return <p className="text-yellow-400">Carregando...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

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
