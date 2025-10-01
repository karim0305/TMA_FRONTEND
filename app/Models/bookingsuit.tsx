import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Dropdown ke liye picker import
import { Picker } from "@react-native-picker/picker";

interface Booking {
  bookingDate: string;
  measurementDate: string;
  completionDate: string;
  stitchingFee: string;
  image?: string;
  customerId?: string;
  measurementId?: string;
}

interface Props {
  visible: boolean;
  booking: Booking;
  onClose: () => void;
  onSave: (booking: Booking) => void;
  customers?: { id: string; name: string }[]; // 👈 dropdown ke liye
  measurements?: Record<string, { id: string; date: string }[]>; // 👈 { customerId: [measurements] }
}

export default function BookingModal({
  visible,
  booking,
  onClose,
  onSave,
  customers = [],
  measurements = {},
}: Props) {
  const [localBooking, setLocalBooking] = useState<Booking>(booking);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(
    booking.customerId || null
  );
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(
    booking.measurementId || null
  );

  useEffect(() => {
    setLocalBooking(booking);
    setSelectedCustomer(booking.customerId || null);
    setSelectedMeasurement(booking.measurementId || null);
  }, [booking]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setLocalBooking({ ...localBooking, image: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (
      !localBooking.bookingDate ||
      !localBooking.completionDate ||
      !localBooking.stitchingFee
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    onSave({
      ...localBooking,
      customerId: selectedCustomer || undefined,
      measurementId: selectedMeasurement || undefined,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Booking Details</Text>

          {/* ✅ Agar customerId na ho to dropdown dikhai do */}
          {!booking.customerId && (
            <>
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
                          label={`Measurement: ${m.date}`}
                          value={m.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </>
              )}
            </>
          )}

          {/* Dates */}
          <TextInput
            placeholder="Booking Date (YYYY-MM-DD)"
            style={styles.input}
            value={localBooking.bookingDate}
            onChangeText={(text) =>
              setLocalBooking({ ...localBooking, bookingDate: text })
            }
          />

          <TextInput
            placeholder="Completion Date (YYYY-MM-DD)"
            style={styles.input}
            value={localBooking.completionDate}
            onChangeText={(text) =>
              setLocalBooking({ ...localBooking, completionDate: text })
            }
          />

          <TextInput
            placeholder="Stitching Fee"
            style={styles.input}
            keyboardType="numeric"
            value={localBooking.stitchingFee}
            onChangeText={(text) =>
              setLocalBooking({ ...localBooking, stitchingFee: text })
            }
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#2563eb" }]}
            onPress={pickImage}
          >
            <Text style={styles.btnText}>
              {localBooking.image ? "Change Image" : "Upload Image"}
            </Text>
          </TouchableOpacity>

          {localBooking.image && (
            <Image source={{ uri: localBooking.image }} style={styles.image} />
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              style={[styles.btn, { flex: 1, marginRight: 5 }]}
              onPress={handleSave}
            >
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                { flex: 1, backgroundColor: "#9ca3af", marginLeft: 5 },
              ]}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  btn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "black",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  label: { fontWeight: "bold", marginBottom: 4 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginBottom: 10,
  },
});
