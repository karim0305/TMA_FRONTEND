import { AuthApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Appearance,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import Add from "./Models/add";
import { addUser, setCurrentUser, setLoading, User } from "./redux/slices/userSlice";
import { loginStyles } from "./styles/LoginStyle";


export type user = {
  id: string;
  Name: string;
  Email: string;
  Phone: string;
  CNIC: string;
  Address: string;
  Role: string;
  Image: string;
};
export default function App() {
  const dispatch = useDispatch();

const HandleLogin = async (): Promise<void> => {
  if (!email || !password) {
    Toast.show({
      type: "info",
      text1: "Please enter both email and password.",
      position: "top",
      visibilityTime: 3000,
    });
    return;
  }

  try {
    dispatch(setLoading(true));

    const res = await axios.post(AuthApi.Login, { email, password });

    if (res.data.access_token) {
      const user = res.data.user;

      // ✅ Save securely
      let SecureStore: any = null;
      try {
        // Dynamically require to avoid crashes when module is missing or on web
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        SecureStore = require("expo-secure-store");
      } catch {}

      try {
        const secureAvailable = await (SecureStore?.isAvailableAsync?.() ?? Promise.resolve(false));
        if (secureAvailable) {
          await SecureStore.setItemAsync("token", res.data.access_token);
          await SecureStore.setItemAsync("user", JSON.stringify(user));
        } else {
          await AsyncStorage.setItem("token", res.data.access_token);
          await AsyncStorage.setItem("user", JSON.stringify(user));
        }
      } catch {
        // Any failure in secure write falls back to AsyncStorage
        await AsyncStorage.setItem("token", res.data.access_token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }

      // ✅ Save to Redux
      dispatch(
        setCurrentUser({
          user: {
            id: user._id,
            UserId: user.UserId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            cnic: user.cnic,
            address: user.address,
            role: user.role,
            image: user.image,
            status: user.status,
          },
          token: res.data.access_token,
        })
      );

      // ✅ Check user role and status
      if (user.role === "Tailor" || user.role === "Customer") {
        if (user.status === "Active") {
          Toast.show({
            type: "success",
            text1: "Login successful! 🎉",
            text2: `Welcome back, ${user.name}!`,
            position: "top",
            visibilityTime: 3000,
          });

          if (user.role === "Tailor") {
            router.replace("/thome");
          } else {
            router.replace("/chome");
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Your account is not activated.",
            text2: "Contact Administration: 0300-902992093",
            position: "top",
            visibilityTime: 3000,
          });
        }
      } else if (user.role === "Admin") {
        Toast.show({
          type: "success",
          text1: "Login successful! 🎉",
          text2: `Welcome back, ${user.name}!`,
          position: "top",
          visibilityTime: 3000,
        });
        router.replace("/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid user role.",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } else {
      // 🧩 Handle known backend errors (user not found or invalid password)
      const errorMsg = res.data.message?.toLowerCase() || "";

      if (errorMsg.includes("user not found") || errorMsg.includes("not exist")) {
        Toast.show({
          type: "error",
          text1: "User not exist.",
          text2: "Please sign up to continue.",
          position: "top",
          visibilityTime: 3000,
        });
      } else if (errorMsg.includes("invalid password") || errorMsg.includes("wrong password")) {
        Toast.show({
          type: "error",
          text1: "Invalid password.",
          text2: "Please check your password and try again.",
          position: "top",
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Invalid credentials.",
          text2: "Please try again.",
          position: "top",
          visibilityTime: 3000,
        });
      }
    }
  } catch (error: any) {
    console.error("❌ Login Error:", error.response?.data || error.message);

    const msg = error.response?.data?.message?.toLowerCase() || "";

    if (msg.includes("user not found") || msg.includes("not exist")) {
      Toast.show({
        type: "error",
        text1: "User not exist.",
        text2: "Please sign up to continue.",
        position: "top",
        visibilityTime: 3000,
      });
    } else if (msg.includes("invalid password") || msg.includes("wrong password")) {
      Toast.show({
        type: "error",
        text1: "Invalid password.",
        text2: "Please check your password and try again.",
        position: "top",
        visibilityTime: 3000,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Something went wrong.",
        text2: "Please try again later.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  } finally {
    dispatch(setLoading(false));
  }
};




  const handleAddAdmin = (newAdmin: User) => {
    dispatch(
      addUser({
        ...newAdmin,
        id: Date.now().toString(), // ya UUID generate karo
      })
    );
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


  const [selectedRole, setSelectedRole] = useState("Customer");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
       <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
  
    <View>
      <View style={[loginStyles.container, { backgroundColor: theme.background }]}>
        <View style={[loginStyles.card, { backgroundColor: theme.card }]}>
          {/* Tailor Icon */}
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Ionicons name="cut" size={100} color={theme.text} />
          </View>

          <Text style={[loginStyles.title, { color: theme.text }]}>
            Welcome To E-Tailor
          </Text>
          <Text style={[loginStyles.title, { color: theme.text }]}>Login</Text>

          <TextInput
            style={[
              loginStyles.input,
              { backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={[
              loginStyles.input,
              { backgroundColor: theme.input, color: theme.text },
            ]}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Sign In Button */}
          <TouchableOpacity style={loginStyles.button} onPress={HandleLogin}>
            <Text style={loginStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Forgot Password link */}
          <TouchableOpacity>
            <Text style={loginStyles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[loginStyles.button, { backgroundColor: "gray", marginTop: 12 }]}
            onPress={() => setIsSignUpVisible(true)}
          >
            <Text style={loginStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

 

      <Add
        visible={isSignUpVisible}
        onClose={() => setIsSignUpVisible(false)}
        onAdd={handleAddAdmin}
      />
    </View>
      </ScrollView>
  </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
