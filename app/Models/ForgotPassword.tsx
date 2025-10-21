import { AuthApi } from "@/api/apis";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";



const ForgotPassword = ({ visible, onClose, onOtpSent }: { visible: boolean; onClose: () => void; onOtpSent: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
useEffect(() => {
  if (!visible) {
    setEmail(""); // clear field when modal closes
  }
}, [visible]);
  const handleForgot = async () => {
    if (!email) {
      Toast.show({
        type: "info",
        text1: "Please enter your email.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(AuthApi.ForgotPasswordSendOtp, { email });

      // Treat any 2xx as success and proceed to OTP
      if (res.status >= 200 && res.status < 300) {
        Toast.show({
          type: "success",
          text1: res.data?.message || "OTP sent successfully",
          position: "top",
        });
        onOtpSent(email);
      } else {
        Toast.show({
          type: "error",
          text1: res.data?.message || "Unable to send reset link.",
          position: "top",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button} onPress={handleForgot} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  closeText: {
    textAlign: "center",
    color: "gray",
  },
});

