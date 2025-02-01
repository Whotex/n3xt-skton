// components/TopNavigation.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TopNavigation() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 border-b border-gray-700 px-4 py-5 z-50 flex items-center justify-center">
      <motion.div
        initial={{ y: 5 }}
        animate={{ y: [5, -5, 5] }} // Efeito de flutuação
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 transform -translate-x-1/2 translate-y-2"
      >
        <Image
          src="/SAKATON.png"
          alt="SakaTON Logo"
          width={180}
          height={54}
          priority
          className="drop-shadow-lg"
        />
      </motion.div>
    </nav>
  );
}
