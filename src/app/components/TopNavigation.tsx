"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const API_BASE_URL = "https://sakaton.vercel.app/api";

export default function TopNavigation() {
  const [firstName, setFirstName] = useState<string>("User");
  const [userPoints, setUserPoints] = useState<number>(0);
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
        setFirstName(dataUser.user.first_name || "User");
        setReferallCount(dataUser.user.referall_count || 0);

        // Chamada para o endpoint /getPoints
        const responsePoints = await fetch(`${API_BASE_URL}/getPoints`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!responsePoints.ok)
          throw new Error("Erro ao buscar pontuação.");
        const dataPoints = await responsePoints.json();
        setUserPoints(dataPoints.points || 0);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário na top nav:", err);
        setError("Error loading user data");
      }
    }

    fetchUserData();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-800 via-gray-900 to-pink-800 border-b border-purple-900 z-50 flex items-center justify-between px-4 shadow-md">
      {/* Left: Logotipo/Título */}
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: [10, 12, 10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center"
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

      {/* Right: Caixa com dados do usuário */}
      <div className="flex items-center">
        {error ? (
          <p className="text-white text-sm">{error}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black bg-opacity-80 p-2 rounded-md shadow-md flex flex-col items-end"
          >
            <h2
              className="text-lg font-bold text-white"
              style={{ WebkitTextStroke: "1px black" }}
            >
              Welcome, {firstName}!
            </h2>
            <p
              className="text-sm text-white"
              style={{ WebkitTextStroke: "1px black" }}
            >
              Points: {userPoints}
            </p>
            <p
              className="text-xs text-white"
              style={{ WebkitTextStroke: "1px black" }}
            >
              Invited: {referallCount}
            </p>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
