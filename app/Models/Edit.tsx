import { UserApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { User, updateUser } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

// 🔹 Cloudinary Config
const CLOUD_NAME = "dzfqgziwl";
const UPLOAD_PRESET = "tailorImages";

interface EditProps {
  visible: boolean;
  tailor: User;
  onClose: () => void;
}

export default function Edit({ visible, tailor, onClose }: EditProps) {
  const dispatch = useDispatch();
  const [updatedTailor, setUpdatedTailor] = useState<User>(tailor);
  const [originalTailor, setOriginalTailor] = useState<User>(tailor);
  const [loading, setLoading] = useState(false);
   const { currentUser } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (tailor) {
      setUpdatedTailor(tailor);
      setOriginalTailor(tailor);
    }
  }, [tailor]);

  // 🔹 Upload to Cloudinary
  const uploadToCloudinary = async (file: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  // 🔹 Image Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setLoading(true);
      try {
        const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
        const imageUrl = await uploadToCloudinary(base64Img);
        setUpdatedTailor((prev) => ({ ...prev, image: imageUrl }));
      } catch (err) {
        console.error("❌ Image upload failed", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // 🔹 Update Handler
  const handleUpdateTailor = async () => {
    try {
      setLoading(true);

      // ✅ Compare and send only changed fields
      const changedFields: any = {};
      (Object.keys(updatedTailor) as (keyof User)[]).forEach((key) => {
        if (updatedTailor[key] !== originalTailor[key]) {
          changedFields[key] = updatedTailor[key];
        }
      });

      // ✅ Remove empty or placeholder password
      if (
        !changedFields.password ||
        changedFields.password.trim() === "" ||
        changedFields.password === "******"
      ) {
        delete changedFields.password;
      }

      // ✅ Always include image if changed
      if (updatedTailor.image && updatedTailor.image !== originalTailor.image) {
        changedFields.image = updatedTailor.image;
      }

      // ✅ If nothing changed, skip request
      if (Object.keys(changedFields).length === 0) {
        alert("No changes to update.");
        setLoading(false);
        return;
      }

      // 🔹 Send patch request
      const res = await axios.patch(
        UserApi.updateUser(updatedTailor.id),
        changedFields
      );

      console.log("✅ User updated:", res.data);

          dispatch(updateUser(res.data));
     router.push('/Login')
      onClose();
    } catch (err: any) {
      console.error("❌ Update error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Profile Image */}
          <View style={{ position: "relative", alignSelf: "center" }}>
            {updatedTailor?.image ? (
              <Image
                source={{ uri: updatedTailor.image }}
                style={styles.profileImage}
              />
            ) : null}
            <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
              <Ionicons name="camera" size={22} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalHeading}>Edit User</Text>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={updatedTailor?.name}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={updatedTailor?.phone}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, phone: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="CNIC"
              value={updatedTailor?.cnic}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, cnic: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={updatedTailor?.address}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, address: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={updatedTailor?.email}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, email: text }))
              }
            />

          {currentUser?.role === "Admin" && (
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={updatedTailor?.role}
      onValueChange={(value) =>
        setUpdatedTailor((prev) => ({ ...prev, role: value }))
      }
    >
      <Picker.Item label="Select Role" value="" />
      <Picker.Item label="Admin" value="Admin" />
      <Picker.Item label="Tailor" value="Tailor" />
      <Picker.Item label="Helper" value="Helper" />
    </Picker>
  </View>
)}


            {/* Password Field */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={updatedTailor?.password || ""}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, password: text }))
              }
            />
          </ScrollView>

          {/* Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "black", flex: 1 }]}
              onPress={handleUpdateTailor}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? "Updating..." : "Update"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "gray", flex: 1 }]}
              onPress={onClose}
              disabled={loading}
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
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
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
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  btn: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
});
