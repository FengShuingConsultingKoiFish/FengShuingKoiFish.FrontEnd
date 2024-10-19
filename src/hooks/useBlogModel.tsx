import { create } from "zustand";

interface BlogModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useBlogModal = create<BlogModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useBlogModal;
