import { mockUsers } from "../../mock/data";


const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

async function simulate<T>(data: T, ms = 200): Promise<T> {
  await delay(ms);
  return structuredClone(data);
}

// ===== Admin =====
export const adminApi = {
  usuarios: async () => simulate(mockUsers),
};