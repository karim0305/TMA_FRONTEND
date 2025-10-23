import { UserApi } from "@/api/apis";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/slices/userSlice"; // 👈 slice se import
import { RootState } from "../redux/store";

interface AddProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (user: any) => void; // Parent state update
}

export default function Add({ visible, onClose, onAdd }: AddProps) {
     const { currentUser } = useSelector((state: RootState) => state.users);
  const [loading, setLoading] = useState(false);
useEffect(() => {
  if (!currentUser) {
    setNewUser((prev) => ({ ...prev, role: "Tailor" })); // 👈 Default Tailor
  }
}, [currentUser]);

  const [newUser, setNewUser] = useState({
    UserId: "",
    name: "",
    phone: "",
    cnic: "",
    address: "",
    role: "",
    status:"Inactive",
    email: "",
    password: "",
    image: "", // local uri before upload
  });

  // Cloudinary config
  const CLOUD_NAME = "dzfqgziwl";
  const UPLOAD_PRESET = "tailorImages";

const handleUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const selectedImageUri = result.assets[0].uri;
  
      const formData = new FormData();
      formData.append("file", { uri: selectedImageUri, type: "image/jpeg", name: "profile.jpg" } as any);
      formData.append("upload_preset", UPLOAD_PRESET);
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dzfqgziwl/image/upload",
          {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          const imageUrl = data.secure_url;
          // set imag uri at use state setNewUser
           setNewUser((prev) => ({
      ...prev,
      image: imageUrl, // directly save Cloudinary URL
    }));
         Toast.show({
                type: "success",
                text1: "Image Uploaded successful! 🎉",
                position: "top",
                visibilityTime: 3000,
              });;
        } else {
          Toast.show({
                type: "error",
                text1: "Image Uploaded failed! 🎉",
                position: "top",
                visibilityTime: 3000,
              });
        }
      } catch (err) {
        Toast.show({
                type: "error",
                text1: "Failed to Upload Image .....",
                position: "top",
                visibilityTime: 3000,
              });
      } finally {
       
      }
    }
  };



  // 👇 Add User (with Cloudinary URL)
const dispatch = useDispatch();
const handleAddUser = async () => {
  try {
    
    setLoading(true);

    const userPayload = {
      ...newUser,
      // newUser.image already has the Cloudinary URL
      image: newUser.image,
      UserId:currentUser?.id,
       status: currentUser ? "Active" : "Inactive",  
    };

    const res = await axios.post(UserApi.addUser, userPayload);
       dispatch(addUser(res.data));
      Toast.show({
                type: "success",
                text1: "User Added successful! 🎉",
                position: "top",
                visibilityTime: 3000,
              });
    console.log("✅ User Added Successfully:", res.data);
    onClose();

    // Reset form
    // setNewUser({
    //   name: "",
    //   phone: "",
    //   cnic: "",
    //   address: "",
    //   role: "",
    //   email: "",
    //   password: "",
    //   image: "",
    // });
  } catch (err: any) {
    console.error("❌ Error:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.modalHeading}>رجسٹر کریں</Text>

          <ScrollView>
  <TextInput
    style={styles.input}
    placeholder="نام"
    placeholderTextColor="#9CA3AF"
    value={newUser.name}
    onChangeText={(text) =>
      setNewUser((prev) => ({ ...prev, name: text }))
    }
  />

  <TextInput
    style={styles.input}
    placeholder="فون نمبر"
    placeholderTextColor="#9CA3AF"
    value={newUser.phone}
    onChangeText={(text) =>
      setNewUser((prev) => ({ ...prev, phone: text }))
    }
  />

  <TextInput
    style={styles.input}
    placeholder="شناختی کارڈ نمبر"
    placeholderTextColor="#9CA3AF"
    value={newUser.cnic}
    onChangeText={(text) =>
      setNewUser((prev) => ({ ...prev, cnic: text }))
    }
  />

  <TextInput
    style={styles.input}
    placeholder="پتہ"
    placeholderTextColor="#9CA3AF"
    value={newUser.address}
    onChangeText={(text) =>
      setNewUser((prev) => ({ ...prev, address: text }))
    }
  />

  <TextInput
    style={styles.input}
    placeholder="ای میل"
    keyboardType="email-address"
    autoCapitalize="none"
    placeholderTextColor="#9CA3AF"
    value={newUser.email}
    onChangeText={(text) =>
      setNewUser((prev) => ({ ...prev, email: text }))
    }
  />

  {/* Show Role Dropdown only if current user is Admin */}

  {currentUser?.role === "Admin" ? (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        marginBottom: 10,
        backgroundColor: "#fff",
      }}
    >
      <TextInput
        style={styles.input}
        placeholder="پاس ورڈ"
        secureTextEntry
        placeholderTextColor="#9CA3AF"
        value={newUser.password}
        onChangeText={(text) =>
          setNewUser((prev) => ({ ...prev, password: text }))
        }
      />

      <Picker
        selectedValue={newUser.role}
        onValueChange={(value) =>
          setNewUser((prev) => ({ ...prev, role: value }))
        }
      >
        <Picker.Item label="رول منتخب کریں" value="" />
        <Picker.Item label="ایڈمن" value="Admin" />
        <Picker.Item label="درزی" value="Tailor" />
        {/* <Picker.Item label="کسٹمر" value="Customer" /> */}
      </Picker>
    </View>
  ) : currentUser?.role === "Tailor" ? null : (
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={newUser.role}
        onValueChange={(value) =>
          setNewUser((prev) => ({ ...prev, role: value }))
        }
      >
        <Picker.Item label="درزی" value="Tailor" />
      </Picker>
    </View>
  )}

  <TouchableOpacity
    style={[styles.btn, { backgroundColor: "#3b82f6", marginBottom: 10 }]}
    onPress={handleUploadImage}
  >
    <Text style={styles.btnText}>تصویر منتخب کریں</Text>
  </TouchableOpacity>

  {/* Preview Selected Image */}
  {newUser.image ? (
    <View style={{ alignItems: "center", marginBottom: 10 }}>
      <Image
        source={{ uri: newUser.image }}
        style={{ width: 80, height: 80, borderRadius: 8 }}
      />
    </View>
  ) : null}
</ScrollView>


          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "black", flex: 1 }]}
              onPress={handleAddUser}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? "Saving..." : "Save"}
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
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 14 },
});
