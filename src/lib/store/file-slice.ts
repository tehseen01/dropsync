import { TFile } from "@/types";
import { StateCreator } from "zustand";

export type FileState = {
  files: TFile[];
  setFiles: (files: TFile[]) => void;
};

export const createFileSlice: StateCreator<
  FileState,
  [["zustand/devtools", never]],
  [],
  FileState
> = (set) => ({
  files: [],
  setFiles: (files) => set({ files }),
});
