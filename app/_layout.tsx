import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store"; // 👈 apna store import

import "@/global.css";
import { ToastProvider } from "expo-toast";
import Toast from "react-native-toast-message";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
       <ToastProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Login"
         options={{ headerShown: false }} 
         
         />
        <Stack.Screen
          name="(drawer)"
          options={{ headerShown: false }} // 👈 hides the header for the drawer layout
        />
      </Stack>
        <Toast /> 
      </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
