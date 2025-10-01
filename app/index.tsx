import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Appearance,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function App() {
  const HandleLogin = (): void => {
    router.replace("/home");
  };

  const colorScheme = Appearance.getColorScheme();

  const lightTheme = {
    background: "#f2f2f2",
    card: "#ffffff",
    text: "#000000",
    input: "#f0f0f0",
  };

  const darkTheme = {
    background: "#1c1c1e",
    card: "#2c2c2e",
    text: "#ffffff",
    input: "#3a3a3c",
  };

  const [theme, setTheme] = useState(
    colorScheme === "dark" ? darkTheme : lightTheme
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {/* Tailor Icon */}
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="cut" size={100} color={theme.text} />
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Welcome To E-Tailor
          </Text>
          <Text style={[styles.title, { color: theme.text }]}>Login</Text>

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Sign In Button */}
          <TouchableOpacity style={styles.button} onPress={HandleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Forgot Password link */}
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "gray", marginTop: 12 }]}
            onPress={() => setIsSignUpVisible(true)}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SignUp Modal */}
      <Modal visible={isSignUpVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>Sign Up</Text>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.input, color: theme.text },
              ]}
              placeholder="Name"
              placeholderTextColor="#888"
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.input, color: theme.text },
              ]}
              placeholder="Email"
              placeholderTextColor="#888"
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.input, color: theme.text },
              ]}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsSignUpVisible(false)}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUpVisible(false)}>
              <Text style={styles.linkText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "black",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    padding: 20,
    borderRadius: 12,
  },
});
