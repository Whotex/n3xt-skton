"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = "https://sakaton.vercel.app/api"; // URL da API

interface UserProfile {
  id: string;
  first_name: string;
  referall_count: number;
}

export default function HomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await fetch(`${API_BASE_URL}/getUser`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do usuário.");

        const data = await response.json();
        setUserProfile(data.user);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setErrorProfile("Não foi possível carregar os dados do usuário.");
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      {loadingProfile ? (
        <p className="text-yellow-300">Carregando perfil...</p>
      ) : errorProfile ? (
        <p className="text-red-400">{errorProfile}</p>
      ) : userProfile ? (
        <motion.div
          className="w-full max-w-md p-6 rounded-xl shadow-2xl border-4 border-yellow-600"
          style={{
            backgroundImage: "url('/wood-texture.jpg')", // ou 'metal-texture.jpg'
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            {userProfile.first_name}
          </h2>
          <p className="text-lg text-center text-gray-200">
            Referral Count:{" "}
            <span className="font-semibold text-yellow-300">
              {userProfile.referall_count}
            </span>
          </p>
        </motion.div>
      ) : null}
    </section>
  );
}
