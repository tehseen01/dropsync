import { User } from "@supabase/supabase-js";
import { StateCreator } from "zustand";

export type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const createUserSlice: StateCreator<
  UserState,
  [["zustand/devtools", never]],
  [],
  UserState
> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});
