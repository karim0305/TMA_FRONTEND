import { MeasurementApi } from "@/api/apis";
import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MeasurementModal from "../Models/addmeasurement";
import {
  deleteMeasurement,
  Measurement,
  setMeasurements,
} from "../redux/slices/measureSlice";
import { RootState } from "../redux/store";

export default function ViewMeasurements() {
  const { currentUser } = useSelector((state: RootState) => state.users);
 const params = useLocalSearchParams();
 // console.log("Params:", params); // Should log { customerId: "..." }
  const customerId = params.customerId;
   const customername = params.customername;


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<any | null>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { list: measurements, loading } = useSelector(
    (state: RootState) => state.measurements
  );

  // ✅ Setup header with Add button
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Measurements",
      headerRight: () => (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "black" }]}
          onPress={openAddModal}
        >
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const res = await axios.get(MeasurementApi.getMeasurements);
      dispatch(setMeasurements(res.data.data));
    } catch (error) {
      console.error("❌ Error fetching measurements:", error);
      Alert.alert("Error", "Failed to fetch measurements from server.");
    }
  };

  // ✅ Open modal for adding new measurement
  const openAddModal = () => {
    setSelectedMeasurement({
      date: "",
      customerId: customerId || "",
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

  // ✅ Delete measurement handler
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(MeasurementApi.deleteMeasurement(id));
      dispatch(deleteMeasurement(id));
      console.log("✅ Measurement deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete measurement:", error);
    }
  };

  // ✅ Filter by current user's ID
const filteredMeasurements = measurements.filter((m) => {
  // Normalize customerId to string
  const mCustomerId =
    typeof m.customerId === "object" ? m.customerId?._id : m.customerId;

  const userId = typeof m.UserId === "object" ? m.UserId?._id : m.UserId;

  return (
    userId?.toString() === currentUser?.id?.toString() &&
    mCustomerId?.toString() === customerId?.toString()
  );
});

  // ✅ Loading state
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 🟢 Show message when no data */}
      {!filteredMeasurements.length ? (
        <View style={styles.centered}>
          <Text style={{ fontSize: 16, color: "#555" }}>
            No measurements found for your account.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{customername} Measurements</Text>

          {filteredMeasurements.map((item: Measurement, index: number) => (
            <View key={item._id || index} style={styles.card}>
              <Text style={styles.cardDate}>📅 {item.date}</Text>

              <View style={styles.badgeRow}>
                {[
                  { label: "Chest", value: item.Chest, color: "#16a34a" },
                  { label: "Waist", value: item.Waist, color: "#2563eb" },
                  { label: "Length", value: item.Length, color: "#9333ea" },
                  { label: "Hips", value: item.Hips, color: "#f59e0b" },
                  { label: "Shoulder", value: item.Shoulder, color: "#dc2626" },
                  { label: "Sleeve", value: item.Sleeve, color: "#0891b2" },
                  { label: "Bicep", value: item.Bicep, color: "#65a30d" },
                  { label: "Wrist", value: item.Wrist, color: "#7c3aed" },
                  { label: "Neck", value: item.Neck, color: "#d946ef" },
                  { label: "Armhole", value: item.Armhole, color: "#ea580c" },
                  { label: "Trouser Waist", value: item.TrouserWaist, color: "#0d9488" },
                  { label: "Trouser Length", value: item.TrouserLength, color: "#4f46e5" },
                  { label: "Thigh", value: item.Thigh, color: "#15803d" },
                  { label: "Knee", value: item.Knee, color: "#c026d3" },
                  { label: "Bottom", value: item.Bottom, color: "#ca8a04" },
                  { label: "Inseam", value: item.Inseam, color: "#2563eb" },
                  { label: "Rise", value: item.Rise, color: "#dc2626" },
                  { label: "Waistcoat Length", value: item.WaistcoatLength, color: "#16a34a" },
                ].map((field, i) => (
                  <Text key={i} style={styles.badge}>
                    {field.label}:{" "}
                    <Text
                      style={[styles.valueBox, { backgroundColor: field.color }]}
                    >
                      {field.value}"
                    </Text>
                  </Text>
                ))}
              </View>
  {/* onPress={() => router.push(`/suitbooking?measureId=${item._id}`)} */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#22c55e" }]}
                  onPress={() => router.push(`/suitbooking?measureId=${item._id}&customerId=${typeof item.customerId === "object" ? item.customerId._id : item.customerId}&customername=${params.customername}`)}
                >
                  <Text style={styles.actionText}>Suit Booking</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "#f87171" }]}
                  onPress={() => handleDelete(item._id!)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ✅ Modal should always exist in render tree */}
      {selectedMeasurement && (
        <MeasurementModal
          visible={modalVisible}
          measurement={selectedMeasurement}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f3f4f6", flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardDate: { fontWeight: "bold", marginBottom: 10, fontSize: 16 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 5 },
  badge: {
    padding: 5,
    borderRadius: 8,
    color: "black",
    marginRight: 5,
    marginBottom: 5,
    fontWeight: "600",
  },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  actionBtn: { padding: 8, borderRadius: 8, marginLeft: 5 },
  actionText: { color: "#fff", fontWeight: "bold" },
  btn: {
    backgroundColor: "black",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginEnd: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  valueBox: {
    backgroundColor: "#ddd",
    color: "#000",
    fontWeight: "700",
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: "hidden",
  },
});
