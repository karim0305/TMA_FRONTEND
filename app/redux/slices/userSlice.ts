import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
    UserId?: string;
  name: string;
  email: string;
  phone?: string;
  cnic?: string;
  address?: string;
  role: string;
  image?: string;
  status?: string;
  password?: string; 
  token?:string;
}

interface UserState {
  list: User[];
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  currentUser: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.list = state.list.map((u) =>
        u.id === action.payload.id ? action.payload : u
      );
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((u) => u.id !== action.payload);
    },
    setCurrentUser: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
  setCurrentUser,
  logoutUser,
} = userSlice.actions;

export default userSlice.reducer;
