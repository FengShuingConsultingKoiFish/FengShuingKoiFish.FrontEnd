import { create } from "zustand";

interface ConfirmModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useConfirmModal = create<ConfirmModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useConfirmModal;