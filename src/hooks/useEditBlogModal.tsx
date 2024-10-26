import { create } from "zustand";

interface EditBlogModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEditBlogModal = create<EditBlogModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditBlogModal;