import { MeasurementApi } from "@/api/apis";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { addMeasurement } from "../redux/slices/measureSlice";
import { RootState } from "../redux/store";
import { MeasurementStyle } from "../styles/Measurement";

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

  const { currentUser } = useSelector((state: RootState) => state.users);
  const UserId = currentUser?.id;

  const [localMeasurement, setLocalMeasurement] = useState<Measurement>(measurement);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setLocalMeasurement({ ...localMeasurement, date: formatDate(selectedDate) });
    }
  };

  useEffect(() => {
    if (customerId) {
      setLocalMeasurement((prev) => ({
        ...prev,
        customerId,
      }));
    }
  }, [customerId]);

  useEffect(() => {
    setLocalMeasurement((prev) => ({
      ...prev,
      date: prev.date?.trim() ? prev.date : formatDate(new Date()),
    }));
  }, []);

  const handleSave = async () => {
    if (!UserId) {
      alert("⚠️ No logged-in user found!");
      return;
    }

    const ensuredDate = localMeasurement.date?.trim()
      ? localMeasurement.date
      : formatDate(new Date());

    const dataToSend = {
      ...localMeasurement,
      date: ensuredDate,
      UserId,
      customerId: localMeasurement.customerId,
    };

    try {
      const res = await axios.post(MeasurementApi.addMeasurement, dataToSend);

      if (res?.data) {
        Toast.show({
          type: "success",
          text1: "Measurement added successfully 🎉",
          position: "top",
          visibilityTime: 3000,
        });

        dispatch(addMeasurement(res.data.data));

        setLocalMeasurement({
          date: formatDate(new Date()),
          Chest: "",
          Waist: "",
          Length: "",
          Hips: "",
          Shoulder: "",
          Sleeve: "",
          Bicep: "",
          Wrist: "",
          Neck: "",
          Armhole: "",
          TrouserWaist: "",
          TrouserLength: "",
          Thigh: "",
          Knee: "",
          Bottom: "",
          Inseam: "",
          Rise: "",
          WaistcoatLength: "",
          customerId: localMeasurement.customerId,
        });

        onClose();
      }
    } catch (error) {
      console.error("❌ Failed to save measurement:", error);
    }
  };

  const renderField = (label: string, key: keyof Measurement, placeholder: string) => (
    <View style={MeasurementStyle.row}>
      <Text style={MeasurementStyle.label}>{label}:</Text>
      <TextInput
        placeholder={placeholder}
        style={MeasurementStyle.inputField}
        keyboardType="numeric"
        value={localMeasurement[key]}
        onChangeText={(text) => setLocalMeasurement({ ...localMeasurement, [key]: text })}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={MeasurementStyle.modalOverlay}>
        <ScrollView style={MeasurementStyle.modalContainer}>
          <Text style={MeasurementStyle.modalTitle}>پیمائش کا فارم</Text>

          {/* Date */}
          <View style={MeasurementStyle.row}>
            <Text style={MeasurementStyle.label}>تاریخ:</Text>
            {Platform.OS === "web" ? (
              <TextInput
                placeholder="YYYY-MM-DD"
                style={MeasurementStyle.inputField}
                value={localMeasurement.date}
                onChangeText={(text) =>
                  setLocalMeasurement({ ...localMeasurement, date: text })
                }
              />
            ) : (
              <>
                <TouchableOpacity
                  style={MeasurementStyle.inputField}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{localMeasurement.date || "تاریخ منتخب کریں"}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={
                      localMeasurement.date
                        ? new Date(localMeasurement.date)
                        : new Date()
                    }
                    mode="date"
                    display="calendar"
                    onChange={onChangeDate}
                  />
                )}
              </>
            )}
          </View>

          {/* Urdu Fields */}
          {renderField("سینہ", "Chest", "سینہ")}
          {renderField("کمر", "Waist", "کمر")}
          {renderField("لمبائی", "Length", "لمبائی")}
          {renderField("کولہے", "Hips", "کولہے")}
          {renderField("کندھا", "Shoulder", "کندھا")}
          {renderField("آستین", "Sleeve", "آستین")}
          {renderField("بازو", "Bicep", "بازو")}
          {renderField("کلائی", "Wrist", "کلائی")}
          {renderField("گردن", "Neck", "گردن")}
          {renderField("آرم ہول", "Armhole", "آرم ہول")}
          {renderField("پاجامہ کمر", "TrouserWaist", "پاجامہ کمر")}
          {renderField("پاجامہ لمبائی", "TrouserLength", "پاجامہ لمبائی")}
          {renderField("ران", "Thigh", "ران")}
          {renderField("گھٹنا", "Knee", "گھٹنا")}
          {renderField("باٹم", "Bottom", "باٹم")}
          {renderField("انسیم", "Inseam", "انسیم")}
          {renderField("رائز", "Rise", "رائز")}
          {renderField("ویسٹ کوٹ لمبائی", "WaistcoatLength", "ویسٹ کوٹ لمبائی")}

          {/* Buttons */}
          <View style={MeasurementStyle.buttonRow}>
            <TouchableOpacity
              style={[MeasurementStyle.btn, { backgroundColor: "#000" }]}
              onPress={handleSave}
            >
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
