const API_URL = "https://sakaton.vercel.app/api";

/**
 * Fetch wrapper that automatically adds JWT authentication
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("jwt_token");

  // ✅ Definir explicitamente headers como objeto
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>), // Garantir que `headers` seja um objeto válido
  };

  // ✅ Adicionar Authorization se houver token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers, // Passa os headers corrigidos
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
