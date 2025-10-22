// src/redux/slices/suitBookingSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BookingStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

export interface SuitBooking {
  _id?: string; 
  id: string;
   userId: string | null;
  customerId: string | null;
  customerName: string;
  measurementId: string | null;
  bookingDate: string | null;
  measurementDate: string;
  completionDate: string;
  stitchingFee: number;
  status: BookingStatus;
  image: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SuitBookingState {
  list: SuitBooking[];
  loading: boolean;
  error: string | null;
}

const initialState: SuitBookingState = {
  list: [],
  loading: false,
  error: null,
};

const suitBookingSlice = createSlice({
  name: "suitBookings",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<SuitBooking[]>) => {
      state.list = action.payload;
    },
    addSuitBooking: (state, action: PayloadAction<SuitBooking>) => {
      state.list.push(action.payload);
    },
    updateSuitBooking: (state, action: PayloadAction<SuitBooking>) => {
      state.list = state.list.map((b) =>
        b.id === action.payload.id ? action.payload : b
      );
    },
    updateBookingStatus: (
  state,
  action: PayloadAction<{ id: string; status: BookingStatus }>
) => {
  const { id, status } = action.payload;
  state.list = state.list.map((b) =>
    b.id === id ? { ...b, status } : b
  );
},
    deleteSuitBooking: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((b) => b.id !== action.payload);
    },
    setSuitBookingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSuitBookingError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBookings,
  addSuitBooking,
  updateSuitBooking,
  deleteSuitBooking,
  setSuitBookingLoading,
  setSuitBookingError,
} = suitBookingSlice.actions;

export default suitBookingSlice.reducer;
