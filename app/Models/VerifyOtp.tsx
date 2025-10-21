import { AuthApi } from "@/api/apis";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface VerifyOtpProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  onResetDone?: () => void;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ visible, email, onClose, onResetDone }) => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [verifiedEmail, setVerifiedEmail] = useState(email);

  useEffect(() => {
    if (!visible) {
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setStep("verify");
      setVerifiedEmail(email);
    }
  }, [visible, email]);

  const handleVerify = async () => {
    if (!otp) {
      Toast.show({ type: "info", text1: "Please enter OTP.", position: "top" });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(AuthApi.ForgotPasswordVerifyOtp, { email, otp });
      if (res.status >= 200 && res.status < 300) {
        const returnedEmail = res.data?.email || email;
        setVerifiedEmail(returnedEmail);
        Toast.show({ type: "success", text1: res.data?.message || "OTP verified", position: "top" });
        setStep("reset");
      } else {
        Toast.show({ type: "error", text1: res.data?.message || "Invalid OTP", position: "top" });
      }
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Error", text2: error.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Toast.show({ type: "info", text1: "Enter and confirm your new password.", position: "top" });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match.", position: "top" });
      return;
    } 
    setLoading(true);
    try {
      const res = await axios.post(AuthApi.ForgotPasswordReset, { email: verifiedEmail, otp, password });
      if (res.status >= 200 && res.status < 300) {
        Toast.show({ type: "success", text1: res.data?.message || "Password reset successfully", position: "top" });
        onClose();
        onResetDone?.();
      } else {
        Toast.show({ type: "error", text1: res.data?.message || "Unable to reset password.", position: "top" });
      }
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Error", text2: error.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{step === "verify" ? "Verify OTP" : "Reset Password"}</Text>

          {step === "verify" ? (
            <>
              <Text style={styles.label}>We sent an OTP to {email}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
              />
              <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Resetting..." : "Reset Password"}</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyOtp;

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
  label: {
    textAlign: "center",
    marginBottom: 8,
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
