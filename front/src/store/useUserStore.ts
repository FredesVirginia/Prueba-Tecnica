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

export const useUserStore = create(
  persist<IUserStore>(
    (set) => ({
      user: INITIAL_USER_STATE,
      setUser: (user: User) => set((prev) => ({ ...prev, user })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => secureLocalStorage as any),
    }
  )
);
