import { create } from "zustand";

interface EditImgChoosingModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEditImgChoosingModal = create<EditImgChoosingModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditImgChoosingModal;