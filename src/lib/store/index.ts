import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createFileSlice, FileState } from "./file-slice";
import { createUserSlice, UserState } from "./user";

type Store = UserState & FileState;

const useStore = create<Store>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createUserSlice(set, get, api),
        ...createFileSlice(set, get, api),
      }),
      { name: "store" },
    ),
  ),
);

export default useStore;
