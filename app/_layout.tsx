import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../app/redux/store"; // 👈 apna store import

import "@/global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}
