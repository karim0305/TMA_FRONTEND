
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Get token and user info from secure storage
        const token = await SecureStore.getItemAsync("token");
        const userData = await SecureStore.getItemAsync("user");

        // Artificial delay for splash animation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (token && userData) {
          const user = JSON.parse(userData);

          // ✅ Redirect based on user role
          if (user.role === "Admin") {
            router.replace("/home");
          } else if (user.role === "Tailor") {
            router.replace("/thome");
          } else if (user.role === "Customer") {
            router.replace("/chome");
          } else {
            // Unknown role
            router.replace("/Login");
          }
        } else {
          // No token → go to login
          router.replace("/Login");
        }
      } catch (error) {
        console.log("❌ Error checking login:", error);
        router.replace("/Login");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="cut" size={120} color="#fff" />
      <Text style={styles.title}>E-Tailor</Text>
      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
});
