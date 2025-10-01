import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function Profile() {
  const [visible, setVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
  const options = ["Male", "Female", "Other"];

  // Dummy user data
  const [formData, setFormData] = useState({
    id: "1",
    Name: "John Doe",
    CNIC: "12345-6789012-3",
    Address: "123 Tailor Street",
    Phone: "03001234567",
    Gander: "Male",
    Role: "Tailor",
    email: "johndoe@example.com",
    password: "******",
    Image: "https://randomuser.me/api/portraits/men/32.jpg", // Dummy profile image
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Profile View */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: formData.Image }}
            style={styles.profileImage}
          />
          {/* Camera Icon for editing image */}
          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={() => alert("Change profile image clicked!")}
          >
            <Ionicons name="camera" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{formData.Name}</Text>
        <Text style={styles.role}>{formData.Role}</Text>

        <View style={styles.infoBox}>
          <Info label="CNIC" value={formData.CNIC} />
          <Info label="Phone" value={formData.Phone} />
          <Info label="Email" value={formData.email} />
          <Info label="Address" value={formData.Address} />
          <Info label="Gender" value={formData.Gander} />
        </View>
      </ScrollView>

      {/* Floating Edit Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)}>
        <Ionicons name="pencil" size={28} color="white" />
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={{ position: "relative", alignSelf: "center" }}>
              <Image
                source={{ uri: formData.Image }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={() => alert("Change profile image clicked!")}
              >
                <Ionicons name="camera" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.Name}
              onChangeText={(text) => handleChange("Name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={formData.Phone}
              onChangeText={(text) => handleChange("Phone", text)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={formData.Address}
              onChangeText={(text) => handleChange("Address", text)}
            />

            <RNPickerSelect
              onValueChange={(value) => handleChange("Gander", value)}
              value={formData.Gander}
              placeholder={{ label: "Select Gender", value: null }}
              items={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#999" }]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  role: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  infoBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 16,
  
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  infoLabel: {
    fontWeight: "600",
    fontSize: 20,
    color: "#333",
  },
  infoValue: {
    color: "#444",
    maxWidth: "60%",
    fontSize: 15,
    textAlign: "right",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "black",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
