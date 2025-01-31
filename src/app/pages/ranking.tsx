import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

interface User {
  id: string;
  points: number;
}

export default function Ranking() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        points: doc.data().points ?? 0, // 🔥 Garante que `points` sempre existe
      }));

      setUsers(userList.sort((a, b) => b.points - a.points));
    };

    fetchRanking();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Ranking Global</h1>
      <ul>
        {users.map((user, index) => (
          <li key={user.id} className="text-lg">
            {index + 1}. {user.id} - {user.points} pontos
          </li>
        ))}
      </ul>
    </div>
  );
}
