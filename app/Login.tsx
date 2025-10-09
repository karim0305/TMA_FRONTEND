import { AuthApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import Add from "./Models/add";
import { addUser, setCurrentUser, setLoading, User } from "./redux/slices/userSlice";


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
        type: "error", // 'success' | 'error' | 'info'
        text1: "Please enter both email and password.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(AuthApi.Login, { email, password });

      if (res.data.access_token) {
        const user = res.data.user;

        // ✅ Save to AsyncStorage
        await AsyncStorage.setItem("token", res.data.access_token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

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
            if (user.role === "Tailor") {
              Toast.show({
                type: "success",
                text1: "Login successful! 🎉",
                text2: "Welcome back, John!",
              });
              router.replace("/thome");
            } else if (user.role === "Customer") {
              Toast.show({
                type: "success",
                text1: "Login successful! 🎉",
                text2: "Welcome back, John!",
              });
              router.replace("/chome");
            }
          } else {
            Toast.show({
              type: "error",
              text1: "Your Account is Not Activated",
              text2: "Contact Administration 0300902992093",
              position: "top",
              visibilityTime: 3000,
            });
          }
        } else if (user.role === "Admin") {
          Toast.show({
            type: "success",
            text1: "Login successful! 🎉",
            text2: "Welcome back, John!",
          });
          router.replace("/home");
        } else {
          alert("Invalid user role.");
        }

      } else {

        Toast.show({
          type: "error",
          text1: "Invalid credentials. Please try again..",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again",
        position: "top",
        visibilityTime: 3000,
      });

    } finally {
      setLoading(false);
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
    <View>
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
      {/* <Modal visible={isSignUpVisible} animationType="slide" transparent>
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
              placeholder="Phone Number"
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

            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.input, color: theme.text },
              ]}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry
            />

           <RNPickerSelect
  onValueChange={(value) => setSelectedRole(value)}
  items={[
   
    { label: "Tailor", value: "2" },
    { label: "Customer", value: "3" },
  ]}
  placeholder={{ label: "Select Role", value: null }}
  style={{
    inputAndroid: {
         width: "100%",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    },
    inputIOS: {
        width: "100%",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    },
  }}
  value={selectedRole}
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
      </Modal> */}

      <Add
        visible={isSignUpVisible}
        onClose={() => setIsSignUpVisible(false)}
        onAdd={handleAddAdmin}
      />
    </View>
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






  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
  },

});
