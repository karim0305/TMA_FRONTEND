import { SuitBookingApi } from "@/api/apis";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
import { addSuitBooking } from "../redux/slices/suitBookingSlice";
import { AppDispatch, RootState } from "../redux/store";

 // ⚠️ Change to your actual API URL

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  customers?: { id: string; name: string }[];
  measurements?: Record<string, { id: string; date: string }[]>;
  userId: string;
}

export default function BookingModal({
  visible,
  onClose,
  customers = [],
  measurements = {},
  userId,
}: BookingModalProps) {


      const { currentUser } = useSelector((state: RootState) => state.users);
      const params = useLocalSearchParams();
      const measureId = params.measureId;
        const customerId = params.customerId;
      // console.log("Measure id -----:", measureId); // Should log { customerId: "..." }
      // console.log("Customer id -----:", customerId); // Should log { customerId: "..." }
      // console.log("current  id -----:", currentUser?.id); 
  
  const dispatch = useDispatch<AppDispatch>();
  const [bookingDate, setBookingDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [stitchingFee, setStitchingFee] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(
    null
  );
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  
const CLOUD_NAME = "dzfqgziwl";
const UPLOAD_PRESET = "tailorImages";

// ✅ Cloudinary Upload
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


// ✅ Pick Image
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    base64: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets.length > 0) {
    try {
      setLoading(true);
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const url = await uploadToCloudinary(base64Img);
      setImage(url);
    
    } catch (error) {
      console.error("❌ Upload Failed", "Unable to upload image");
    } finally {
      setLoading(false);
    }
  }
};

// ✅ Save Booking
const handleSaveBooking = async () => {
  const newBooking = {
    userId: currentUser?.id,
    customerId: customerId,
    measurementId: measureId,
    bookingDate,
    measurementDate: bookingDate,
    completionDate,
    stitchingFee: Number(stitchingFee),
    status: "Pending",
    image: image ? [image] : [], // 👈 match schema
  };

  try {
    setLoading(true);
    const response = await axios.post(SuitBookingApi.addBooking, newBooking);

    if (response.data.success) {
      dispatch(addSuitBooking(response.data.data));
      console.log("✅ Booking Added Successfully");
       setSelectedUser("");
      setSelectedCustomer("");
      setSelectedMeasurement("");
      setBookingDate("");
      setCompletionDate("");
      setStitchingFee("");
      setImage(null);
      onClose();
    } else {
      console.error("❌ Failed", response.data.message || "Error adding booking");
    }
  } catch (err: any) {
    console.error("Add Booking Error:", err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Add New Booking</Text>

          {/* Customer Dropdown */}
          <Text style={styles.label}>Select Customer</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={selectedCustomer}
              onValueChange={(val) => {
                setSelectedCustomer(val);
                setSelectedMeasurement(null);
              }}
            >
              <Picker.Item label="-- Select Customer --" value={null} />
              {customers.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>

          {/* Measurement Dropdown */}
          {selectedCustomer && (
            <>
              <Text style={styles.label}>Select Measurement</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={selectedMeasurement}
                  onValueChange={(val) => setSelectedMeasurement(val)}
                >
                  <Picker.Item label="-- Select Measurement --" value={null} />
                  {(measurements[selectedCustomer] || []).map((m) => (
                    <Picker.Item
                      key={m.id}
                      label={`Measurement (${m.date})`}
                      value={m.id}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          {/* Input Fields */}
          <TextInput
            placeholder="Booking Date (YYYY-MM-DD)"
            value={bookingDate}
            onChangeText={setBookingDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Completion Date (YYYY-MM-DD)"
            value={completionDate}
            onChangeText={setCompletionDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Stitching Fee"
            value={stitchingFee}
            onChangeText={setStitchingFee}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Image Upload */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#2563eb" }]}
            onPress={pickImage}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading
                ? "Uploading..."
                : image
                ? "Change Image"
                : "Upload Image"}
            </Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.image} />}

          {/* Buttons */}
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              style={[styles.btn, { flex: 1, marginRight: 5 }]}
              onPress={handleSaveBooking}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? "Saving..." : "Save Booking"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { flex: 1, backgroundColor: "#9ca3af" }]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginBottom: 10,
  },
  btn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "black",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
});
