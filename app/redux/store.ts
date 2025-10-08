// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import measurementReducer from "./slices/measureSlice";
import suitBookingSlice from "./slices/suitBookingSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    measurements: measurementReducer,
    booking: suitBookingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
