"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TopNavigation() {
  return (
    <nav className="fixed top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-800 via-gray-900 to-pink-800 border-b border-purple-900 z-50 flex items-center justify-center shadow-md">
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: [10, 12, 10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
