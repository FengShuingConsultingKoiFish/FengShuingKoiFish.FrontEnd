import { create } from "zustand";

interface ProfileImgModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProfileImgModal = create<ProfileImgModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useProfileImgModal;
