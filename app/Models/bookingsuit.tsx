import { SuitBookingApi } from "@/api/apis";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
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
      // Normalize route params (handle string | string[])
      const rawParams = useLocalSearchParams<{
        customerId?: string | string[];
        measureId?: string | string[];
      }>();
  
  const dispatch = useDispatch<AppDispatch>();
  const [bookingDate, setBookingDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [stitchingFee, setStitchingFee] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showBookingPicker, setShowBookingPicker] = useState(false);
  const [showCompletionPicker, setShowCompletionPicker] = useState(false);
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const onChangeBookingDate = (_: any, selectedDate?: Date) => {
    setShowBookingPicker(false);
    if (selectedDate) setBookingDate(formatDate(selectedDate));
  };
  const onChangeCompletionDate = (_: any, selectedDate?: Date) => {
    setShowCompletionPicker(false);
    if (selectedDate) setCompletionDate(formatDate(selectedDate));
  };

  useEffect(() => {
    setBookingDate((prev) => (prev && prev.trim() ? prev : formatDate(new Date())));
    setCompletionDate((prev) => (prev && prev.trim() ? prev : formatDate(new Date())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure dates are set when modal opens (component may stay mounted between opens)
  useEffect(() => {
    if (visible) {
      setBookingDate((prev) => (prev && prev.trim() ? prev : formatDate(new Date())));
      setCompletionDate((prev) => (prev && prev.trim() ? prev : formatDate(new Date())));
    }
  }, [visible]);


// ✅ Watch for changes in route params (robust to string[] and undefined)
const [measureId, setMeasureId] = useState<string | null>(null);
const [customerId, setCustomerId] = useState<string | null>(null);

const coerceParam = (p?: string | string[]): string | null => {
  if (Array.isArray(p)) return p[0] ?? null;
  return p ?? null;
};

useEffect(() => {
  const nextMeasureId = coerceParam(rawParams.measureId);
  const nextCustomerId = coerceParam(rawParams.customerId);
  setMeasureId(nextMeasureId);
  setCustomerId(nextCustomerId);
  console.log("🧾 measureId:", nextMeasureId);
  console.log("👤 customerId:", nextCustomerId);
}, [rawParams.measureId, rawParams.customerId]);
  
const CLOUD_NAME = "dzfqgziwl";
const UPLOAD_PRESET = "tailorImages";

// ✅ Cloudinary Upload
// const uploadToCloudinary = async (file: string) => {
//   try {
//     const res = await axios.post(
//       "https://api.cloudinary.com/v1_1/dzfqgziwl/image/upload",
//       {
//         file, // ✅ base64 string directly — no FormData needed
//         upload_preset: "tailorImages",
//       }
//     );
//     return res.data.secure_url;
//   } catch (err) {
//     console.error("❌ Cloudinary Upload Error:", err);
//     throw new Error("Image upload failed");
//   }
// };
// // ✅ Pick Image
// const pickImage = async () => {
//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     base64: true,
//     quality: 0.8,
//   });

//   if (!result.canceled && result.assets.length > 0) {
//     try {
//       setLoading(true);
//       const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
//       const url = await uploadToCloudinary(base64Img);
//       setImage(url);
    
//     } catch (error) {
//       console.error("❌ Upload Failed", "Unable to upload image");
//     } finally {
//       setLoading(false);
//     }
//   }
// };
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
           setImage(imageUrl);
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
// ✅ Save Booking
const handleSaveBooking = async () => {
  // Fallback to raw params in case state hasn't updated yet
  const effectiveCustomerId = customerId ?? coerceParam(rawParams.customerId);
  const effectiveMeasureId = measureId ?? coerceParam(rawParams.measureId);

  if (!currentUser?.id || !effectiveCustomerId || !effectiveMeasureId) {
    Toast.show({
      type: "error",
      text1: "Missing data",
      text2: !currentUser?.id
        ? "User not found"
        : !effectiveCustomerId
        ? "Customer is missing"
        : "Measurement is missing",
      position: "top",
    });
    return;
  }
  const newBooking = {
    userId: currentUser?.id,
    customerId: effectiveCustomerId,
    measurementId: effectiveMeasureId,
    bookingDate: bookingDate?.trim() ? bookingDate : formatDate(new Date()),
    measurementDate: (bookingDate?.trim() ? bookingDate : formatDate(new Date())),
    completionDate: completionDate?.trim() ? completionDate : formatDate(new Date()),
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
        Toast.show({
                  type: "success",
                  text1: "Booking successful! 🎉",
                
                  position: "top",
                  visibilityTime: 3000,
                });
  
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

          Customer Dropdown
          <Text style={styles.label}>Select Customer</Text>
          {/* <View style={styles.dropdown}>
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
          </View> */}

          {/* Measurement Dropdown */}
          {/* {selectedCustomer && (
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
          )} */}

          {/* Input Fields */}
          {Platform.OS === "web" ? (
            <TextInput
              placeholder="YYYY-MM-DD"
              value={bookingDate}
              onChangeText={setBookingDate}
              style={styles.input}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowBookingPicker(true)}
              >
                <Text>{bookingDate || formatDate(new Date())}</Text>
              </TouchableOpacity>
              {showBookingPicker && (
                <DateTimePicker
                  value={bookingDate ? new Date(bookingDate) : new Date()}
                  mode="date"
                  display="calendar"
                  onChange={onChangeBookingDate}
                />
              )}
            </>
          )}

          {Platform.OS === "web" ? (
            <TextInput
              placeholder="YYYY-MM-DD"
              value={completionDate}
              onChangeText={setCompletionDate}
              style={styles.input}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCompletionPicker(true)}
              >
                <Text>{completionDate || formatDate(new Date())}</Text>
              </TouchableOpacity>
              {showCompletionPicker && (
                <DateTimePicker
                  value={completionDate ? new Date(completionDate) : new Date()}
                  mode="date"
                  display="calendar"
                  onChange={onChangeCompletionDate}
                />
              )}
            </>
          )}
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
            onPress={handleUploadImage}
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
