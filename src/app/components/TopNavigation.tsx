// components/TopNavigation.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TopNavigation() {
  return (
    <nav className="fixed top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-b border-gray-700 z-50 flex items-center justify-center shadow-2xl">
      <motion.div
        initial={{ y: 5 }}
        animate={{ y: [5, 10, 5] }} // Animação sutil: a logo flutua entre 5px e 10px abaixo
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/SAKATON.png"
          alt="SakaTON Logo"
          width={180}
          height={54}
          priority
          className="drop-shadow-2xl"
        />
      </motion.div>
    </nav>
  );
}
