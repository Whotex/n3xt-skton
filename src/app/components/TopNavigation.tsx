"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const API_BASE_URL = "https://sakaton.vercel.app/api";

export default function TopNavigation() {
  const [firstName, setFirstName] = useState<string>("Player");
  const [referallCount, setReferallCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Usuário não autenticado.");
        
        // Chamada para o endpoint /getUser
        const responseUser = await fetch(`${API_BASE_URL}/getUser`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!responseUser.ok)
          throw new Error("Erro ao buscar dados do usuário.");
        const dataUser = await responseUser.json();
        setFirstName(dataUser.user.first_name || "Player");
        setReferallCount(dataUser.user.referall_count || 0);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário na top nav:", err);
        setError("Error loading user data");
      }
    }
    fetchUserData();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center">
      <div className="w-full max-w-7xl bg-black bg-opacity-50 rounded-xl shadow-md flex items-center justify-between px-6 py-2">
        {/* Área esquerda: Novo LOGO do jogo (maior) */}
        <div className="flex items-center mr-4">
          <Image
            src="/LOGO.png"
            alt="SakaTON Logo"
            width={120}  // Logo maior
            height={120}
            priority
            className="object-contain drop-shadow-lg"
          />
        </div>

        {/* Área direita: Caixa com os dados do usuário */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black bg-opacity-75 p-3 rounded-xl shadow-lg"
        >
          {error ? (
            <p className="text-xs text-white">Error loading data</p>
          ) : (
            <>
              <p
                className="text-sm font-semibold text-white"
                style={{ WebkitTextStroke: "1px black" }}
              >
                {firstName}
              </p>
              <p
                className="text-xs text-white mt-1"
                style={{ WebkitTextStroke: "1px black" }}
              >
                Ref: {referallCount}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </nav>
  );
}
