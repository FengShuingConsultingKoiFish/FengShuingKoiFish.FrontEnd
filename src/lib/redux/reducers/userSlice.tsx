import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for the state
interface User {
  Id: string;
  Name: string;
  Email: string;
  Role: string;
}

interface UserDetail {
  userId: string;
  userName: string;
  fullName: string;
  identityCard: string;
  gender: string;
  dateOfBirth: string;
  avatar: string;
  createdDate: string;
}


interface UsersState {
  usersList: User[];
  updateUser: Partial<UserDetail>;
  detailUser: UserDetail | null;
  userHistory: User[];
  currentUser: User | null;
}

// Initial state with type annotations
const initialState: UsersState = {
  usersList: [],
  updateUser: {},
  detailUser: null,
  userHistory: [],
  currentUser: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsersList: (state, action: PayloadAction<User[]>) => {
      state.usersList = action.payload;
    },
    setUpdateUser: (state, action: PayloadAction<Partial<UserDetail>>) => {
      if (state.detailUser) {
        state.updateUser = { ...state.detailUser, ...action.payload };
      } else {
        state.updateUser = action.payload;
      }
    },
    setDetailUser: (state, action: PayloadAction<UserDetail | null>) => {
      state.detailUser = action.payload;
    },
    updateUserDetail: (state, action: PayloadAction<Partial<User>>) => {
      if (state.detailUser) {
        state.detailUser = { ...state.detailUser, ...action.payload };
      }
    },
    setUserHistory: (state, action: PayloadAction<User[]>) => {
      state.userHistory = action.payload;
    },
    setCurrentUser: {
      reducer: (state, action: PayloadAction<{ user: User }>) => {
        state.currentUser = action.payload.user;
      },
      prepare: (user: User) => ({ payload: { user } }),
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.detailUser = null;
      sessionStorage.removeItem("token"); // Remove token from sessionStorage
      sessionStorage.removeItem("user");  // Remove user from sessionStorage
    },
  },
});

export const {
  setUsersList,
  setUpdateUser,
  setDetailUser,
  updateUserDetail,
  setUserHistory,
  setCurrentUser,
  clearCurrentUser,
} = usersSlice.actions;

export default usersSlice.reducer;
