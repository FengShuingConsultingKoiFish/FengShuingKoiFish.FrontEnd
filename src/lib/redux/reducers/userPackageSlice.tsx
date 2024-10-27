import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageViewDTO {
  altText?: string | null;
  createdDate: string;
  filePath: string;
  id: number;
  userId: string;
  userName: string;
}

interface UserPruchasedPkgDetail {
  id: number
  monitoredQuantity: number
  userName: string
  status: number 
  createdDate: string
  advertisementPackageViewDTO: AdvertisementPackageViewDTO
}

interface AdvertisementPackageViewDTO {
  id: number;
  name?: string;
  price?: number;
  description?: string;
  limitAd?: number;
  limitContent?: number;
  limitImage?: number;
  createdDate?: string;
  imageViewDTOs: ImageViewDTO[];
}

interface UserPackageState {
  packageList: UserPruchasedPkgDetail[];
  packageDetail: UserPruchasedPkgDetail | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserPackageState = {
  packageList: [], 
  packageDetail: null,
  isLoading: false,
  error: null
};

const userPackageSlice = createSlice({
  name: "userPackages",
  initialState,
  reducers: {
    setPackageList: (state, action: PayloadAction<UserPruchasedPkgDetail[]>) => {
        state.packageList = action.payload;
      },
    
    setUserPackageDetail: (state, action: PayloadAction<UserPruchasedPkgDetail>) => {
      state.packageDetail = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearPackageDetail: (state) => {
      state.packageDetail = null;
    },

    clearUserPackages: (state) => {
      state.packageList = [];
      state.packageDetail = null;
    },
  }
});

export const {
  setPackageList,
  setUserPackageDetail,
  setError,
  clearPackageDetail,
  clearUserPackages
} = userPackageSlice.actions;


export default userPackageSlice.reducer;
