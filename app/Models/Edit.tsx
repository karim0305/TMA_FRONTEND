import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditProps {
  visible: boolean;
  tailor: any; // jo tailor edit karna hai
  onClose: () => void;
  onUpdate: (tailor: any) => void;
}

export default function Edit({ visible, tailor, onClose, onUpdate }: EditProps) {
  const [updatedTailor, setUpdatedTailor] = useState(tailor);

  // ✅ jab bhi tailor change ho to state update ho jaye
  useEffect(() => {
    if (tailor) setUpdatedTailor(tailor);
  }, [tailor]);

  // 🔹 Image picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setUpdatedTailor((prev: any) => ({ ...prev, Image: result.assets[0].uri }));
    }
  };

  const handleUpdateTailor = () => {
    if (
      !updatedTailor.Name ||
      !updatedTailor.Phone ||
      !updatedTailor.CNIC ||
      !updatedTailor.Address ||
      !updatedTailor.Role ||
      !updatedTailor.Email ||
      !updatedTailor.Password
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    onUpdate(updatedTailor);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Edit</Text>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedTailor?.Name}
              onChangeText={(text) =>
                setUpdatedTailor((prev: any) => ({ ...prev, Name: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={updatedTailor?.Phone}
              onChangeText={(text) =>
                setUpdatedTailor((prev: any) => ({ ...prev, Phone: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              value={updatedTailor?.CNIC}
              onChangeText={(text) =>
                setUpdatedTailor((prev: any) => ({ ...prev, CNIC: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={updatedTailor?.Address}
              onChangeText={(text) =>
                setUpdatedTailor((prev: any) => ({ ...prev, Address: text }))
              }
            />

            {/* 🔹 Email */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={updatedTailor?.Email}
              onChangeText={(text) =>
                setUpdatedTailor((prev: any) => ({ ...prev, Email: text }))
              }
            />

            {/* 🔹 Password */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={updatedTailor?.Password}
              onChangeText={(text) =>
                setUpdatedTailor((prev: any) => ({ ...prev, Password: text }))
              }
            />

            {/* 🔹 Role Dropdown */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={updatedTailor?.Role}
                onValueChange={(value) =>
                  setUpdatedTailor((prev: any) => ({ ...prev, Role: value }))
                }
              >
                <Picker.Item label="Select Role" value="" />
                <Picker.Item label="Admin" value="Admin" />
                <Picker.Item label="Tailor" value="Tailor" />
                <Picker.Item label="Helper" value="Helper" />
              </Picker>
            </View>

            {/* 🔹 Image Picker Button */}
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#3b82f6", marginBottom: 10 }]}
              onPress={pickImage}
            >
              <Text style={styles.btnText}>Change Image</Text>
            </TouchableOpacity>

            {/* 🔹 Preview Image */}
            {updatedTailor?.Image ? (
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Image
                  source={{ uri: updatedTailor.Image }}
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                />
              </View>
            ) : null}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "black", flex: 1 }]}
              onPress={handleUpdateTailor}
            >
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "gray", flex: 1 }]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  modalContent: { backgroundColor: "white", borderRadius: 8, padding: 20 },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 13 },
});
