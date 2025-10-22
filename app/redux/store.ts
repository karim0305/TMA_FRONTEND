import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { Platform } from "react-native";
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

// 🧩 Safe storage for redux-persist across native, web, and SSR
const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, _value: string) {
    return Promise.resolve();
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

let persistStorage: any;
if (typeof window === "undefined") {
  // SSR / Node: prevent `window` access
  persistStorage = createNoopStorage();
} else if (Platform.OS === "web") {
  // Web runtime (browser)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const createWebStorage = require("redux-persist/lib/storage/createWebStorage").default;
  persistStorage = createWebStorage("local");
} else {
  // Native platforms
  persistStorage = AsyncStorage;
}

// 🧩 Redux Persist configuration
const persistConfig = {
  key: "root",
  storage: persistStorage,
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
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
