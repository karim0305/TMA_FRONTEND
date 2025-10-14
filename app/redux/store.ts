import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import measurementReducer from "./slices/measureSlice";
import suitBookingSlice from "./slices/suitBookingSlice";
import userReducer from "./slices/userSlice";

// 🧩 Combine all reducers
const rootReducer = combineReducers({
  users: userReducer,
  measurements: measurementReducer,
  booking: suitBookingSlice,
});

// 🧩 Redux Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["users"], // ✅ only persist user data
};

// 🧩 Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🧩 Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 🧩 Create persistor
export const persistor = persistStore(store);

// 🧩 Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
