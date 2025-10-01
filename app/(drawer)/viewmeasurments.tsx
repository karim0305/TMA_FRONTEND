import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MeasurementModal from "../Models/addmeasurement";

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

interface Customer {
  id: string;
  name: string;
  measurements: Measurement[];
}
 
export default function ViewMeasurements() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    const dummyCustomer: Customer = {
      id: "1",
      name: "Ali Raza",
      measurements: [
        {
          date: "2025-09-28",
          Chest: "38",
          Waist: "32",
          Length: "30",
          Hips: "40",
          Shoulder: "16",
          Sleeve: "24",
          Bicep: "14",
          Wrist: "7",
          Neck: "15",
          Armhole: "18",
          TrouserWaist: "32",
          TrouserLength: "40",
          Thigh: "22",
          Knee: "16",
          Bottom: "15",
          Inseam: "28",
          Rise: "10",
          WaistcoatLength: "25",
        },
      ],
    };
    setCustomer(dummyCustomer);
  }, []);

  const openAddModal = () => {
    setEditIndex(null);
    setSelectedMeasurement({
      date: "",
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
    });
    setModalVisible(true);
  };

  const openEditModal = (index: number) => {
    setEditIndex(index);
    setSelectedMeasurement(customer!.measurements[index]);
    setModalVisible(true);
  };

  const saveMeasurement = (measurement: Measurement) => {
    const updatedCustomer = { ...customer! };
    if (editIndex !== null) {
      updatedCustomer.measurements[editIndex] = measurement;
    } else {
      updatedCustomer.measurements.push(measurement);
    }
    setCustomer(updatedCustomer);
    setModalVisible(false);
  };

  const deleteMeasurement = (index: number) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedCustomer = { ...customer! };
          updatedCustomer.measurements.splice(index, 1);
          setCustomer(updatedCustomer);
        },
      },
    ]);
  };

  if (!customer) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.title}>{customer.name}'s Measurements</Text>

     

      {customer.measurements.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardDate}>Date: {item.date}</Text>
          <View style={styles.badgeRow}>
            <Text style={[styles.badge, { backgroundColor: "#16a34a" }]}>Chest: {item.Chest}"</Text>
            <Text style={[styles.badge, { backgroundColor: "#2563eb" }]}>Waist: {item.Waist}"</Text>
            <Text style={[styles.badge, { backgroundColor: "#9333ea" }]}>Length: {item.Length}"</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "black" }]} onPress={() => openEditModal(index)}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "gray" }]}  onPress={() => {
                             router.push(`/suitbooking`); // 👈 Navigate to measurements page with customer ID
                           }}>
              <Text style={styles.actionText}>Suit Booking</Text>
            </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#f87171" }]} onPress={() => deleteMeasurement(index)}>
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {selectedMeasurement && (
        <MeasurementModal
          visible={modalVisible}
          measurement={selectedMeasurement}
          onClose={() => setModalVisible(false)}
          onSave={saveMeasurement}
        />
      )}
       <TouchableOpacity style={[styles.btn, { backgroundColor: "black" }]} onPress={openAddModal}>
        <Text style={styles.btnText}>Add Measurement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f3f4f6", flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#111827" },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 15, borderRadius: 10, elevation: 3 },
  cardDate: { fontWeight: "bold", marginBottom: 10 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 5 },
  badge: { padding: 5, borderRadius: 8, color: "#fff", marginRight: 5, marginBottom: 5 },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  actionBtn: { padding: 8, borderRadius: 8, marginLeft: 5 },
  actionText: { color: "#fff", fontWeight: "bold" },
  btn: { padding: 12, borderRadius: 10, alignItems: "center", marginVertical: 10, backgroundColor: "#3b82f6" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loading: { marginTop: 50, textAlign: "center", fontSize: 18, color: "#6b7280" },
});
