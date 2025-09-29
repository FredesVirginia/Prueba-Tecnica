import secureLocalStorage from "react-secure-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "../hooks/useUsers/IResUser";

interface IUserStore {
  user: User;
  setUser: (user: User) => void;
}

const INITIAL_USER_STATE: User = {
  _id: "",
  name: "",

  email: "",
};

const isTest = process.env.NODE_ENV === 'test';

let memory: { [key: string]: string | null } = {};
const memoryStorage = {
  getItem: (key: string) => memory[key] || null,
  setItem: (key: string, value: string) => { memory[key] = value; },
  removeItem: (key: string) => { delete memory[key]; },
};

export const useUserStore = create(
  persist<IUserStore>(
    (set) => ({
      user: INITIAL_USER_STATE,
      setUser: (user: User) => set((prev) => ({ ...prev, user })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => isTest ? memoryStorage : secureLocalStorage as any),
    }
  )
);
