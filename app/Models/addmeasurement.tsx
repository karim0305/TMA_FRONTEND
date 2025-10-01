import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Measurement {
  date: string;
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
  onSave: (measurement: Measurement) => void;
}

export default function MeasurementModal({ visible, measurement, onClose, onSave }: Props) {
  const [localMeasurement, setLocalMeasurement] = useState<Measurement>(measurement);

  useEffect(() => {
    setLocalMeasurement(measurement);
  }, [measurement]);

  const handleSave = () => {
    if (!localMeasurement.date) {
      Alert.alert("Error", "Date is required");
      return;
    }
    onSave(localMeasurement);
  };

  return (
   <Modal visible={visible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <ScrollView style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Measurement</Text>

      {/* Date Input */}
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={styles.inputField}
          value={localMeasurement.date}
          onChangeText={(text) => setLocalMeasurement({ ...localMeasurement, date: text })}
        />
      </View>

      {/* Other Measurements */}
      {Object.keys(localMeasurement)
        .filter((key) => key !== "date")
        .map((key) => (
          <View style={styles.row} key={key}>
            <Text style={styles.label}>{key}:</Text>
            <TextInput
              placeholder={key}
              style={styles.inputField}
              keyboardType="numeric"
              value={(localMeasurement as any)[key]}
              onChangeText={(text) => setLocalMeasurement({ ...localMeasurement, [key]: text })}
            />
          </View>
        ))}

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <TouchableOpacity style={[styles.btn, { flex: 1, marginRight: 5 }]} onPress={handleSave}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { flex: 1, backgroundColor: "#9ca3af", marginLeft: 5 }]} onPress={onClose}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
</Modal>

  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    flex: 1, // takes 1/3 width
    fontSize: 16,
    fontWeight: "500",
  },
  inputField: {
    flex: 2, // takes 2/3 width
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btn: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

