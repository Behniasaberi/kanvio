import { create } from "zustand";

type ShortcutsHelpState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useShortcutsHelp = create<ShortcutsHelpState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
