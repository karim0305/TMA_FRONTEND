import { MeasurementApi } from "@/api/apis";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addMeasurement } from "../redux/slices/measureSlice";
import { RootState } from "../redux/store";
import { MeasurementStyle } from "../styles/Measurement";
import Toast from "react-native-toast-message";

interface Measurement {
  date: string;
  UserId?: string;
  customerId?: string;
  Chest: string;
  Waist: string;
  Length: string;
  Hips: string;
  Shoulder: string;
  Sleeve: string;
  Bicep: string;
  Wrist: string;
  Neck: string;
  Armhole: string;
  TrouserWaist: string;
  TrouserLength: string;
  Thigh: string;
  Knee: string;
  Bottom: string;
  Inseam: string;
  Rise: string;
  WaistcoatLength: string;
}

interface Props {
  visible: boolean;
  measurement: Measurement;
  onClose: () => void;

}

export default function MeasurementModal({ visible, measurement, onClose }: Props) {
  const params = useLocalSearchParams();
 const customerId = Array.isArray(params.customerId)
  ? params.customerId[0]
  : params.customerId;
  const dispatch = useDispatch();

  // ✅ Get current user from Redux
  const { currentUser } = useSelector((state: RootState) => state.users);
  const UserId = currentUser?.id;
  // console.log("User Ids......"+UserId);
  //  console.log("Customerid... "+customerId)
  // ✅ Local state for measurement form
  const [localMeasurement, setLocalMeasurement] = useState<Measurement>(measurement);

  // ✅ Keep measurement updated when modal opens
useEffect(() => {
  if (customerId) {
    setLocalMeasurement((prev) => ({
      ...prev,
      customerId,
    }));
  }
}, [customerId]);

  // ✅ Save handler
  const handleSave = async () => {
    try {
      if (!UserId) {
        alert("⚠️ No logged-in user found!");
        return;
      }

      const dataToSend = {
        ...localMeasurement,
        UserId,
        customerId: localMeasurement.customerId,
      };

      const res = await axios.post(MeasurementApi.addMeasurement, dataToSend);

      if (res?.data) {
          Toast.show({
                    type: "success",
                    text1: "Measurement added successful! 🎉",
                    position: "top",
                    visibilityTime: 3000,
                  });
        console.log("✅ Measurement saved successfully:", res.data);
        dispatch(addMeasurement(res.data.data));
         // 🔹 Clear all measurement fields
  setLocalMeasurement({
    date:"",
    Chest: "",
    Waist: "",
    Length: "",
  Hips:"",
  Shoulder: "",
  Sleeve: "",
  Bicep: "",
  Wrist: "",
  Neck: "",
  Armhole: "",
  TrouserWaist:"",
  TrouserLength: "",
  Thigh: "",
  Knee: "",
  Bottom:"",
  Inseam: "",
  Rise: "",
  WaistcoatLength: "",
    // UserId: "",
  customerId:  localMeasurement.customerId, 
  });
        onClose();
      }
    } catch (error) {
      console.error("❌ Failed to save measurement:", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={MeasurementStyle.modalOverlay}>
        <ScrollView style={MeasurementStyle.modalContainer}>
          <Text style={MeasurementStyle.modalTitle}>Measurement</Text>

          {/* Date */}
          <View style={MeasurementStyle.row}>
            <Text style={MeasurementStyle.label}>Date:</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              style={MeasurementStyle.inputField}
              value={localMeasurement.date}
              onChangeText={(text) =>
                setLocalMeasurement({ ...localMeasurement, date: text })
              }
            />
          </View>

          {/* Other fields */}
          {Object.keys(localMeasurement)
            .filter((key) => !["date", "UserId", "customerId"].includes(key))
            .map((key) => (
              <View style={MeasurementStyle.row} key={key}>
                <Text style={MeasurementStyle.label}>{key}:</Text>
                <TextInput
                  placeholder={key}
                  style={MeasurementStyle.inputField}
                  keyboardType="numeric"
                  value={(localMeasurement as any)[key]}
                  onChangeText={(text) =>
                    setLocalMeasurement({ ...localMeasurement, [key]: text })
                  }
                />
              </View>
            ))}

          {/* Buttons */}
          <View style={MeasurementStyle.buttonRow}>
            <TouchableOpacity style={[MeasurementStyle.btn, { backgroundColor: "#000" }]} onPress={handleSave}>
              <Text style={MeasurementStyle.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[MeasurementStyle.btn, { backgroundColor: "#9ca3af" }]}
              onPress={onClose}
            >
              <Text style={MeasurementStyle.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
