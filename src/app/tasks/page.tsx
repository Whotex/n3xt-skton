"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = "https://sakaton.vercel.app/api"; // URL do backend

interface Task {
  id: string;
  name: string;
  points: number;
  link: string;
  startedBy?: string;
  completedBy?: string;
  completed: boolean;
}

export default function TasksPage() {
  const userId = "123456789"; // Substituir com o ID real do usuário depois
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskStatus, setTaskStatus] = useState<{ [key: string]: "idle" | "waiting" | "claimable" }>({});

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks?user_id=${userId}`);
        if (!response.ok) throw new Error("Erro ao buscar as tasks.");
        
        const data = await response.json();
        
        // Atualiza o estado para tasks já iniciadas
        const status: { [key: string]: "claimable" | "idle" } = {};
        data.tasks.forEach((task: Task) => {
          if (task.startedBy === userId && !task.completedBy) {
            status[task.id] = "claimable"; // Se a task já foi iniciada, exibir "Claim"
          } else {
            status[task.id] = "idle";
          }
        });
  
        setTaskStatus(status);
        setTasks(data.tasks);
      } catch (_error) { // ✅ Alterado de "err" para "_error"
        console.error("Erro ao buscar as tasks:", _error);
        setError("Não existem missões no momento.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchTasks();
  }, []);

  const handleStartTask = async (taskId: string, link: string) => {
    setTaskStatus((prev) => ({ ...prev, [taskId]: "waiting" }));
  
    try {
      const response = await fetch(`${API_BASE_URL}/start-task`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost:3000",
        },
        body: JSON.stringify({ task_id: taskId, user_id: userId }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro ao iniciar task: ${errorText}`);
        throw new Error(errorText);
      }
  
      setTimeout(() => {
        window.open(link, "_blank");
      }, 500);
  
      setTimeout(() => {
        setTaskStatus((prev) => ({ ...prev, [taskId]: "claimable" }));
      }, 3000);
    } catch (_error) { // ✅ Alterado "err" para "_error"
      console.error("Erro ao iniciar task:", _error);
      setTaskStatus((prev) => ({ ...prev, [taskId]: "idle" }));
    }
  };
  

  const handleClaimTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/claim-task`, {
        method: "POST",
        mode: "cors", // Garante que estamos lidando com CORS corretamente
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: taskId, user_id: userId }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro ao dar claim na task: ${errorText}`);
        throw new Error(errorText);
      }
  
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (err) {
      console.error("Erro ao dar claim na task:", err);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-start pt-12 pb-20 px-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6 tracking-widest">🎯 Missões</h1>

      {loading && <p className="text-gray-300 animate-pulse">Carregando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="w-full max-w-2xl space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400">Não há missões disponíveis no momento.</p>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg shadow-md border-2 ${
                task.completed
                  ? "bg-gray-800 text-gray-500 border-gray-600"
                  : "bg-gray-900 border-yellow-400"
              }`}
            >
              <h3 className="text-xl font-semibold">{task.name}</h3>
              <p className="text-gray-300">🎁 {task.points} pontos</p>

              <div className="mt-3 flex gap-2">
                {/* Task já concluída */}
                {task.completed ? (
                  <span className="text-green-400 font-bold">✅ Concluído</span>
                ) : (
                  <>
                    {/* Estado: Pronto para "Claim" imediatamente ao recarregar */}
                    {taskStatus[task.id] === "claimable" && (
                      <button
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition-all"
                        onClick={() => handleClaimTask(task.id)}
                      >
                        Claim 🎉
                      </button>
                    )}

                    {/* Estado: Esperando (Botão cinza) */}
                    {taskStatus[task.id] === "waiting" && (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-600 text-white font-bold rounded-lg shadow-md transition-all cursor-not-allowed"
                      >
                        ⏳ Aguardando...
                      </button>
                    )}

                    {/* Estado: Normal (Start) */}
                    {taskStatus[task.id] !== "waiting" &&
                      taskStatus[task.id] !== "claimable" &&
                      task.startedBy !== userId && (
                        <button
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg shadow-md transition-all"
                          onClick={() => handleStartTask(task.id, task.link)}
                        >
                          Start 🚀
                        </button>
                      )}
                  </>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
