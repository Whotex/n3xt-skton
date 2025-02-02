"use client";

import { motion } from "framer-motion";
import Image from "next/image";

function AnimatedDots() {
  return (
    <span className="inline-block">
      <motion.span
        className="inline-block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        .
      </motion.span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      >
        .
      </motion.span>
      <motion.span
        className="inline-block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      >
        .
      </motion.span>
    </span>
  );
}

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-yellow-400">
      {/* Logo com flutuação e sombreamento */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <Image
          src="/LOGO.png"
          alt="Logo"
          width={200}
          height={200}
          className="drop-shadow-xl"
        />
      </motion.div>

      {/* Barra de carregamento animada */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </div>

      {/* Texto com pontos animados */}
      <motion.p
        className="text-lg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading <AnimatedDots />
      </motion.p>
    </div>
  );
}
