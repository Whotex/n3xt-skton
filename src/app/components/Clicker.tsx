"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../lib/firebaseConfig";
import { doc, setDoc, getDoc, increment } from "firebase/firestore";

export default function Clicker({ userId }: { userId: string }) {
  const [points, setPoints] = useState(0);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setPoints(userSnap.data().points || 0);
      }
    };
    fetchPoints();
  }, [userId]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setPoints((prev) => prev + 1);
    setClickEffect({ x: event.clientX, y: event.clientY });

    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { points: increment(1) }, { merge: true });

    setTimeout(() => setClickEffect(null), 1000);
  };

  return (
    <div className="flex flex-col items-center gap-4 relative">
      {/* Pontos do usuário */}
      <p className="text-2xl font-bold text-center">
        Seus Pontos: <span className="text-yellow-400">{points}</span>
      </p>

      {/* Botão/Moeda Pixelada com Flutuação Contínua + Tremor no Clique */}
      <motion.button
        /* Animação contínua de flutuação */
        animate={{
          y: [0, -10, 0],              // Move 10px pra cima e volta
          rotate: [0, 2, 0, -2, 0],    // Pequena rotação para “oscilação”
        }}
        transition={{
          duration: 2,                // Duração de cada ciclo
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        /* Ao passar o mouse (hover), cresce levemente */
        whileHover={{ scale: 1.1 }}
        /* Ao clicar (tap), faz um tremor maior */
        whileTap={{
          scale: 0.9, // Leve “encolhida”
          rotate: [0, -10, 10, -10, 10, 0], // Sequência de rotação pra “tremor”
          transition: { duration: 0.4 },
        }}
        onClick={handleClick}
        className="
          relative
          w-48 h-48
          bg-[url('/coin.png')]     /* Ajuste para o nome correto do arquivo */
          bg-no-repeat bg-center bg-contain
          image-rendering: pixelated
          shadow-lg
          focus:outline-none
          cursor-pointer
        "
      />

      {/* Efeito de +1 com sombra preta no texto */}
      {clickEffect && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -50, scale: 1.3 }}
          transition={{ duration: 1 }}
          style={{
            left: clickEffect.x,
            top: clickEffect.y,
            textShadow: "1px 1px 2px black, -1px 1px 2px black", // Borda preta p/ destacar
          }}
          className="
            pointer-events-none 
            absolute 
            font-bold 
            text-2xl 
            text-yellow-300
            select-none
          "
        >
          +1
        </motion.div>
      )}
    </div>
  );
}
