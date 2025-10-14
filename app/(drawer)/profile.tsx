import { UserApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Edit from "../Models/Edit";
import { RootState } from "../redux/store";
import { ProifleStyle } from "../styles/ProfileStyle";

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
      <ScrollView contentContainerStyle={ProifleStyle.container}>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: formData.image }} style={ProifleStyle.profileImage} />
          <TouchableOpacity
            style={ProifleStyle.cameraIcon}
           onPress={() => setVisible(true)}
          >
            <Ionicons name="camera" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={ProifleStyle.name}>{formData.name}</Text>
        <Text style={ProifleStyle.role}>{formData.role}</Text>

        <View style={ProifleStyle.infoBox}>
          <Info label="CNIC" value={formData.cnic} />
          <Info label="Phone" value={formData.phone} />
          <Info label="Email" value={formData.email} />
          <Info label="Address" value={formData.address} />
        </View>
      </ScrollView>

      <TouchableOpacity style={ProifleStyle.fab} onPress={() => setVisible(true)}>
        <Ionicons name="pencil" size={28} color="white" />
      </TouchableOpacity>

      {/* ✏️ Edit Modal */}
      {/* <Modal visible={visible} animationType="slide" transparent>
        <View style={ProifleStyle.modalOverlay}>
          <View style={ProifleStyle.modalContainer}>
            <View style={{ position: "relative", alignSelf: "center" }}>
              <Image
                source={{ uri: formData.image }}
                style={ProifleStyle.profileImage}
              />
              <TouchableOpacity
                style={ProifleStyle.cameraIcon}
                onPress={() => alert("Change profile image clicked!")}
              >
                <Ionicons name="camera" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={ProifleStyle.modalTitle}>Edit Profile</Text>

            <TextInput
              style={ProifleStyle.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
            <TextInput
              style={ProifleStyle.input}
              placeholder="Phone"
              value={formData.phone}
              onChangeText={(text) => handleChange("phone", text)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={ProifleStyle.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
            />
            <TextInput
              style={ProifleStyle.input}
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
              style={ProifleStyle.button}
              onPress={() => setVisible(false)}
            >
              <Text style={ProifleStyle.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ProifleStyle.button, { backgroundColor: "#999" }]}
              onPress={() => setVisible(false)}
            >
              <Text style={ProifleStyle.buttonText}>Cancel</Text>
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
    <View style={ProifleStyle.infoRow}>
      <Text style={ProifleStyle.infoLabel}>{label}:</Text>
      <Text style={ProifleStyle.infoValue}>{value || "N/A"}</Text>
    </View>
  );
}
