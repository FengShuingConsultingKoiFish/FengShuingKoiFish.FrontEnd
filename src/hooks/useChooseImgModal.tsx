import { create } from "zustand";

interface ImgChoosingModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useImgChoosingModal = create<ImgChoosingModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useImgChoosingModal;
