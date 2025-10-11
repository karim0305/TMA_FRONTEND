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

  // Pick image from gallery
 
  // 👇 Pick Image
 const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 0.8,
    base64: true, // 👈 enable base64
  });

  if (!result.canceled && result.assets.length > 0) {
    const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
    const imageUrl = await uploadToCloudinary(base64Img);

    setNewUser((prev) => ({
      ...prev,
      image: imageUrl, // directly save Cloudinary URL
    }));
  }
};

const uploadToCloudinary = async (file: string) => {
  const formData = new FormData();
  formData.append("file", file); // 👈 base64 string
  formData.append("upload_preset", "tailorImages");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dzfqgziwl/image/upload",
      formData
    );
    return res.data.secure_url;
  } catch (err) {
    //console.error("❌ Cloudinary Upload Error:", err.response?.data || err.message);
    throw new Error("Image upload failed");
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
          <Text style={styles.modalHeading}>Add New User</Text>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newUser.name}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newUser.phone}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, phone: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="CNIC"
              value={newUser.cnic}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, cnic: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newUser.address}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, address: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={newUser.email}
              onChangeText={(text) =>
                setNewUser((prev) => ({ ...prev, email: text }))
              }
            />

         

           {/* Show Role Dropdown only if current user is Admin */}

{currentUser?.role === "Admin" ? (
  // 👑 Admin: Show Password + Full Role Picker
  <View style={styles.pickerWrapper}>
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry
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
      <Picker.Item label="Select Role" value="" />
      <Picker.Item label="Admin" value="Admin" />
      <Picker.Item label="Tailor" value="Tailor" />
      <Picker.Item label="Customer" value="Customer" />
    </Picker>
  </View>
) : currentUser?.role === "Tailor" ? (
  // ✂️ Tailor logged in → Hide both password and role picker
  null
) : (
  // 🆕 No currentUser (Sign-up)
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={newUser.role}
      onValueChange={(value) =>
        setNewUser((prev) => ({ ...prev, role: value }))
      }
    >
      <Picker.Item label="Tailor" value="Tailor" />
    
    </Picker>
  </View>
)}

            <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#3b82f6", marginBottom: 10 }]}
        onPress={pickImage}
      >
        <Text style={styles.btnText}>Pick Image</Text>
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
                {loading ? "Adding..." : "Add"}
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
