import { UserApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Edit from "../Models/Edit";
import { RootState } from "../redux/store";

export default function Profile() {
  const { currentUser } = useSelector((state: RootState) => state.users);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const dispatch = useDispatch();

  // ✅ Fetch User Details
  useEffect(() => {
    if (currentUser?.id || currentUser?.id) {
      GetOneUser(currentUser.id || currentUser.id);
    }
  }, []);

  const GetOneUser = async (userId: string) => {
    try {
      const res = await axios.get(UserApi.getUser(userId));

      // ✅ Use res.data directly (since it’s a single object, not an array)
      const u = res.data;

      setFormData({
        id: u._id,
        name: u.name,
        cnic: u.cnic,
        address: u.address,
        phone: u.phone,
        gender: u.gender || "Not specified",
        role: u.role,
        email: u.email,
        password: "******",
        image: u.image,
      });
     
    } catch (err) {
      console.error("❌ Error fetching user:", err);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!formData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: formData.image }} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.cameraIcon}
           onPress={() => setVisible(true)}
          >
            <Ionicons name="camera" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{formData.name}</Text>
        <Text style={styles.role}>{formData.role}</Text>

        <View style={styles.infoBox}>
          <Info label="CNIC" value={formData.cnic} />
          <Info label="Phone" value={formData.phone} />
          <Info label="Email" value={formData.email} />
          <Info label="Address" value={formData.address} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)}>
        <Ionicons name="pencil" size={28} color="white" />
      </TouchableOpacity>

      {/* ✏️ Edit Modal */}
      {/* <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={{ position: "relative", alignSelf: "center" }}>
              <Image
                source={{ uri: formData.image }}
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
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={formData.phone}
              onChangeText={(text) => handleChange("phone", text)}
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
              value={formData.address}
              onChangeText={(text) => handleChange("address", text)}
            />

            <RNPickerSelect
              onValueChange={(value) => handleChange("gender", value)}
              value={formData.gender}
              placeholder={{ label: "Select Gender", value: null }}
              items={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
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
      </Modal> */}

       <Edit
                visible={visible}
                tailor={formData} // 👈 still generic
                onClose={() => setVisible(false)}
                 
              />
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 40 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 6,
  },
  name: { fontSize: 24, fontWeight: "700" },
  role: { fontSize: 16, color: "#555", marginBottom: 20 },
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
  infoLabel: { fontWeight: "600", fontSize: 18, color: "#333" },
  infoValue: { color: "#444", maxWidth: "60%", fontSize: 16, textAlign: "right" },
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
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
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
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
