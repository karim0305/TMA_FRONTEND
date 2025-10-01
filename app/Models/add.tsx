import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
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

interface AddProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (tailor: any) => void;
}

export default function Add({ visible, onClose, onAdd }: AddProps) {
  const [newTailor, setNewTailor] = useState({
    Name: "",
    Phone: "",
    CNIC: "",
    Address: "",
    Role: "",
    Email: "",
    Password: "",
    Image: "",
  });

  // 🔹 Image picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setNewTailor((prev) => ({ ...prev, Image: result.assets[0].uri }));
    }
  };

  const handleAddTailor = () => {
    if (
      !newTailor.Name ||
      !newTailor.Phone ||
      !newTailor.CNIC ||
      !newTailor.Address ||
      !newTailor.Role ||
      !newTailor.Email ||
      !newTailor.Password
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    onAdd({ ...newTailor, id: Date.now().toString() });
    setNewTailor({
      Name: "",
      Phone: "",
      CNIC: "",
      Address: "",
      Role: "",
      Email: "",
      Password: "",
      Image: "",
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Add New</Text>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newTailor.Name}
              onChangeText={(text) =>
                setNewTailor((prev) => ({ ...prev, Name: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newTailor.Phone}
              onChangeText={(text) =>
                setNewTailor((prev) => ({ ...prev, Phone: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              value={newTailor.CNIC}
              onChangeText={(text) =>
                setNewTailor((prev) => ({ ...prev, CNIC: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newTailor.Address}
              onChangeText={(text) =>
                setNewTailor((prev) => ({ ...prev, Address: text }))
              }
            />

            {/* 🔹 Email */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={newTailor.Email}
              onChangeText={(text) =>
                setNewTailor((prev) => ({ ...prev, Email: text }))
              }
            />

            {/* 🔹 Password */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={newTailor.Password}
              onChangeText={(text) =>
                setNewTailor((prev) => ({ ...prev, Password: text }))
              }
            />

            {/* 🔹 Role Dropdown */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={newTailor.Role}
                onValueChange={(value) =>
                  setNewTailor((prev) => ({ ...prev, Role: value }))
                }
              >
                <Picker.Item label="Select Role" value="" />
                <Picker.Item label="Admin" value="Admin" />
                <Picker.Item label="Tailor" value="Tailor" />
                <Picker.Item label="Customer" value="Customer" />
              </Picker>
            </View>

            {/* 🔹 Image Picker Button */}
            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: "#3b82f6", marginBottom: 10 },
              ]}
              onPress={pickImage}
            >
              <Text style={styles.btnText}>Pick Image</Text>
            </TouchableOpacity>

            {/* 🔹 Preview Image */}
            {newTailor.Image ? (
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Image
                  source={{ uri: newTailor.Image }}
                  style={{ width: 80, height: 80, borderRadius: 8 }}
                />
              </View>
            ) : null}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "black", flex: 1 }]}
              onPress={handleAddTailor}
            >
              <Text style={styles.btnText}>Add</Text>
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
