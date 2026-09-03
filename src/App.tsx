import { useEffect, useState } from "react";
import { usersApi, type User } from "./api/users.api";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await usersApi.list({
          page: 1,
          page_size: 10,
        });

        setUsers(response.results);
      } catch (error) {
        console.error(error);
        setError("No se pudieron obtener los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return <h1>Cargando usuarios...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <main>
      <h1>Usuarios</h1>

      {users.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} — {user.email}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
