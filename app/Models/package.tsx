import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function PackageModal({ visible, onClose, tailor, onSave }: any) {
  const [packageType, setPackageType] = useState("");
  const [fee, setFee] = useState("");
  const [tillDate, setTillDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (tailor) {
      setPackageType(tailor.PackageType || "");
      setFee(tailor.Fee || "");
      setTillDate(tailor.TillDate ? new Date(tailor.TillDate) : new Date());
    }
  }, [tailor]);

  const handleSave = () => {
    if (!packageType || !fee || !tillDate) {
      alert("Please fill all fields!");
      return;
    }

    onSave({
      ...tailor,
      PackageType: packageType,
      Fee: fee,
      TillDate: tillDate.toDateString(),
    });
    onClose();
  };

  if (!tailor) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.heading}>Assign Package</Text>

          {/* 🔹 Package Type Dropdown */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={packageType}
              onValueChange={(value) => setPackageType(value)}
            >
              <Picker.Item label="Select Package" value="" />
              <Picker.Item label="Basic" value="Basic" />
              <Picker.Item label="Premium" value="Premium" />
              <Picker.Item label="Gold" value="Gold" />
            </Picker>
          </View>

          {/* 🔹 Fee Input */}
          <TextInput
            style={styles.input}
            placeholder="Fee (e.g. 2000)"
            keyboardType="numeric"
            value={fee}
            onChangeText={setFee}
          />

          {/* 🔹 Date Picker */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateBtnText}>
              {tillDate ? tillDate.toDateString() : "Select Till Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
  <DateTimePicker
    value={tillDate}
    mode="date"
    display="calendar"   // ✅ Always show calendar (iOS + Android both)
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) setTillDate(selectedDate);
    }}
  />
)}

          {/* 🔹 Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "black" }]}
              onPress={handleSave}
            >
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "gray" }]}
              onPress={onClose}
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "85%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  dateBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  dateBtnText: { fontSize: 14, color: "gray" },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 14 },
});
