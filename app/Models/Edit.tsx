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
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { User, updateUser } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import { EditUserStyle } from "../styles/EditUserStyle";
import Toast from "react-native-toast-message";

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
  const uploadToCloudinary = async (uri: string) => {
    const formData = new FormData();
    formData.append(
      "file",
      { uri, type: "image/jpeg", name: "profile.jpg" } as any
    );
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (!response.ok || !data?.secure_url) {
      throw new Error(data?.error?.message || "Failed to upload image");
    }
    return data.secure_url as string;
  };

  // 🔹 Image Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setLoading(true);
      try {
        const selectedUri = result.assets[0].uri;
        const imageUrl = await uploadToCloudinary(selectedUri);
        setUpdatedTailor((prev) => ({ ...prev, image: imageUrl }));
        Toast.show({
          type: "success",
          text1: "Image uploaded successfully! 🎉",
          position: "top",
          visibilityTime: 3000,
        });
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Image upload failed",
          position: "top",
          visibilityTime: 3000,
        });
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
        Toast.show({
                  type: "success",
                  text1: "User Updated successful! 🎉",
               
                  position: "top",
                  visibilityTime: 3000,
                });
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
      <View style={EditUserStyle.modalContainer}>
        <View style={EditUserStyle.modalContent}>
          {/* Profile Image */}
          <View style={{ position: "relative", alignSelf: "center" }}>
            {updatedTailor?.image ? (
              <Image
                source={{ uri: updatedTailor.image }}
                style={EditUserStyle.profileImage}
              />
            ) : null}
            <TouchableOpacity style={EditUserStyle.cameraIcon} onPress={pickImage}>
              <Ionicons name="camera" size={22} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={EditUserStyle.modalHeading}>Edit User</Text>

          <ScrollView>
            <TextInput
              style={EditUserStyle.input}
              placeholder="Name"
              value={updatedTailor?.name}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              style={EditUserStyle.input}
              placeholder="Phone"
              value={updatedTailor?.phone}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, phone: text }))
              }
            />
            <TextInput
              style={EditUserStyle.input}
              placeholder="CNIC"
              value={updatedTailor?.cnic}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, cnic: text }))
              }
            />
            <TextInput
              style={EditUserStyle.input}
              placeholder="Address"
              value={updatedTailor?.address}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, address: text }))
              }
            />
            <TextInput
              style={EditUserStyle.input}
              placeholder="Email"
              keyboardType="email-address"
              value={updatedTailor?.email}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, email: text }))
              }
            />

          {currentUser?.role === "Admin" && (
  <View style={EditUserStyle.pickerWrapper}>
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
              style={EditUserStyle.input}
              placeholder="Password"
              secureTextEntry
              value={updatedTailor?.password || ""}
              onChangeText={(text) =>
                setUpdatedTailor((prev) => ({ ...prev, password: text }))
              }
            />
          </ScrollView>

          {/* Buttons */}
          <View style={EditUserStyle.modalActions}>
            <TouchableOpacity
              style={[EditUserStyle.btn, { backgroundColor: "black", flex: 1 }]}
              onPress={handleUpdateTailor}
              disabled={loading}
            >
              <Text style={EditUserStyle.btnText}>
                {loading ? "Updating..." : "Update"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[EditUserStyle.btn, { backgroundColor: "gray", flex: 1 }]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={EditUserStyle.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

