"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = "https://sakaton.vercel.app/api"; // URL do backend

interface Task {
  id: string;
  name: string;
  points: number;
  link: string;
  status: "idle" | "claimable" | "completed"; // Status já retornado pela API
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para dados do usuário (para a caixa de convite)
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("Usuário não autenticado.");

        // Busca as tasks
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Erro ao buscar as tasks.");
        const data = await response.json();
        setTasks(data.tasks);

        // Busca os dados do usuário para obter o ref_code
        const responseUser = await fetch(`${API_BASE_URL}/getUser`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!responseUser.ok) throw new Error("Erro ao buscar dados do usuário.");
        const dataUser = await responseUser.json();
        setRefCode(dataUser.user.ref_code || "");
      } catch (_error) {
        console.error("Erro ao buscar as tasks:", _error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleStartTask = async (taskId: string, link: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch(`${API_BASE_URL}/start-task`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: taskId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro ao iniciar task: ${errorText}`);
        throw new Error(errorText);
      }

      setTimeout(() => {
        window.open(link, "_blank");
      }, 500);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: "claimable" } : task
        )
      );
    } catch (_error) {
      console.error("Erro ao iniciar task:", _error);
    }
  };

  const handleClaimTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("Usuário não autenticado.");

      const response = await fetch(`${API_BASE_URL}/claim-task`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: taskId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro ao dar claim na task: ${errorText}`);
        throw new Error(errorText);
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: "completed" } : task
        )
      );
    } catch (_error) {
      console.error("Erro ao dar claim na task:", _error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <p className="text-gray-300 text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  // Filtra tarefas disponíveis (status idle ou claimable) e tarefas concluídas
  const availableTasks = tasks.filter(task => task.status !== "completed");
  const completedTasks = tasks.filter(task => task.status === "completed");

  return (
    <section className="min-h-screen flex flex-col items-center justify-start pt-6 pb-8 px-3 text-white">
      {/* Caixa de convite */}
<div className="w-full max-w-2xl p-4 mb-6 bg-gray-800/80 rounded-lg shadow-lg">
  <h2 className="text-xl font-bold text-yellow-400 mb-2">Invite your friends</h2>
  <div className="flex items-center">
    <input
      type="text"
      readOnly
      value={`https://t.me/yamiwolfbot/sakaton?start=${refCode || ""}`}
      className="flex-1 min-w-0 p-2 bg-gray-900 text-white border border-gray-600 rounded-l focus:outline-none truncate whitespace-nowrap overflow-hidden"
    />
    <button
      onClick={() => {
        navigator.clipboard.writeText(`https://t.me/yamiwolfbot/sakaton?start=${refCode || ""}`);
      }}
      className="p-2 bg-yellow-500 text-black font-bold rounded-r hover:bg-yellow-600 transition"
    >
      Copy
    </button>
  </div>
  <p className="mt-2 text-sm text-gray-300">1 ref = 1000 points</p>
</div>


      {/* Seção Available Tasks */}
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4 tracking-wider">Available Tasks</h1>
        {availableTasks.length === 0 ? (
          <div className="p-4 bg-gray-800/80 rounded-lg shadow-lg">
            <p className="text-center text-gray-300 text-sm">
              There are no available tasks at the moment.
            </p>
          </div>
        ) : (
          availableTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg shadow-sm border-2 ${
                task.status === "completed"
                  ? "bg-gray-800 text-gray-500 border-gray-600"
                  : "bg-gray-900 border-yellow-400"
              }`}
            >
              <h3 className="text-lg font-medium">{task.name}</h3>
              <p className="text-gray-300 text-sm">🎁 {task.points} points</p>
              <div className="mt-2 flex gap-2">
                {task.status === "claimable" ? (
                  <button
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded shadow-sm transition-all text-sm"
                    onClick={() => handleClaimTask(task.id)}
                  >
                    Claim 🎉
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded shadow-sm transition-all text-sm"
                    onClick={() => handleStartTask(task.id, task.link)}
                  >
                    Start 🚀
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Seção Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h1 className="text-2xl font-bold text-yellow-400 mb-4 tracking-wider">Completed Tasks</h1>
          {completedTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 rounded-lg shadow-sm border-2 bg-gray-800 text-gray-500 border-gray-600"
            >
              <h3 className="text-lg font-medium">{task.name}</h3>
              <p className="text-gray-300 text-sm">🎁 {task.points} Points</p>
              <div className="mt-2 flex gap-2">
                <span className="text-green-400 font-bold text-sm">✅ Done </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
