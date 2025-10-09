import { SuitBookingApi } from "@/api/apis";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BookingModal from "../Models/bookingsuit";
import { setBookings, setSuitBookingError, updateSuitBooking } from "../redux/slices/suitBookingSlice";
import { RootState } from "../redux/store";

interface Booking {
  id: string;
  bookingDate: string;
  measurementDate: string;
  completionDate: string;
  stitchingFee: string | number;
 status: BookingStatus;
  image?: string;
}
type BookingStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

export default function ViewBookings() {


   const { currentUser } = useSelector((state: RootState) => state.users);

      const params = useLocalSearchParams();
      // const measureId = params.measureId;
      //   const customerId = params.customerId;
      // console.log("Measure id -----:", measureId); // Should log { customerId: "..." }
      // console.log("Customer id -----:", customerId); // Should log { customerId: "..." }
      console.log("current  id -----:", currentUser?.id); 
  
      
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const dispatch = useDispatch();
  const Bookings = useSelector((state: RootState) => state.booking.list);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "black", marginTop: 20 }]}
          onPress={openAddModal}
        >
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [customerId, setCustomerId] = useState<string | null>(null);
const [measureId, setMeasureId] = useState<string | null>(null);

useEffect(() => {
  if (params?.measureId) setMeasureId(params.measureId.toString());
  if (params?.customerId) setCustomerId(params.customerId.toString());

  console.log("🧾 measureId---:", params.measureId);
  console.log("👤 customerId------", params.customerId);
}, [params]);

useEffect(() => {
  if (customerId && measureId) {
          dispatch(setBookings([]));
    GetBooking();
  }
}, [customerId, measureId]);

const GetBooking = async () => {
  try {
    const res = await axios.get(SuitBookingApi.getBookings);
    console.log("📦 Full API Response:", res.data);

    const dataArray = Array.isArray(res.data) ? res.data : res.data.data || [];

    // ✅ Filter by converting everything to string (safe comparison)
   // ✅ Filter by converting everything to string and checking both possible key names
const filtered = dataArray.filter((b: any) => {
  const bookingCustomerId =
    b.customerId?._id?.toString() ||
    b.CustomerId?._id?.toString() ||
    b.customerId?.toString() ||
    b.CustomerId?.toString();

  const bookingMeasureId =
    b.measurementId?._id?.toString() ||
    b.MeasureId?._id?.toString() ||
    b.measurementId?.toString() ||
    b.MeasureId?.toString();

  const bookingUserId =
    b.userId?._id?.toString() ||
    b.UserId?._id?.toString() ||
    b.userId?.toString() ||
    b.UserId?.toString();

  // console.log("🧩 Comparing IDs →", {
  //   bookingUserId,
  //   bookingCustomerId,
  //   bookingMeasureId,
  //   paramUserId: currentUser?.id,
  //   paramCustomerId: customerId,
  //   paramMeasureId: measureId,
  // });

  return (
    bookingUserId === currentUser?.id &&
    bookingCustomerId === customerId &&
    bookingMeasureId === measureId
  );
});

const mapped = filtered.map((b: any, index: number) => ({
  id: b._id || index.toString(),
  userId: b.userId || null,
  customerId: b.customerId || null,
  customerName: b.customerName || "",
  measurementId: b.measurementId || null,
  bookingDate: b.bookingDate || "",
  measurementDate: b.measurementDate || "",
  completionDate: b.completionDate || "",
  stitchingFee: b.stitchingFee || 0,
  status: b.status || "Pending",
  image: b.image?.[0] || null,
  createdAt: b.createdAt || "",
  updatedAt: b.updatedAt || "",
}));


    dispatch(setBookings(mapped));
    console.log("✅ Filtered Bookings:", mapped);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    dispatch(setSuitBookingError("Failed to fetch bookings"));
  }
};

  const openAddModal = () => {
    setEditIndex(null);
    setSelectedBooking({
      id: "",
      bookingDate: "",
      measurementDate: "",
      completionDate: "",
      stitchingFee: "",
      status: "Pending",
    });
    setModalVisible(true);
  };



  const deleteBooking = async (id: string) => {
    try {
      await axios.delete(`${SuitBookingApi.deleteBooking(id)}`);
      const updatedBookings = Bookings.filter((b) => b.id !== id);
      dispatch(setBookings(updatedBookings));
      console.log("✅ Booking deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting booking:", err);
    }
  };

  // 🔄 Toggle booking status


type BookingStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

const handleStatus = async (id: string) => {
  const statusOptions: BookingStatus[] = ["Pending", "In Progress", "Completed", "Cancelled"];

  // Find current booking
  const booking = Bookings.find((b) => b.id === id);
  if (!booking) return;

  const currentStatus = booking.status || "Pending";
  const nextStatus =
    statusOptions[(statusOptions.indexOf(currentStatus) + 1) % statusOptions.length];

  // ✅ Update Redux instantly (optimistic UI)
  dispatch(updateSuitBooking({ ...booking, status: nextStatus }));

  try {
    // ✅ Update backend
    await axios.patch(SuitBookingApi.updateBooking(id), { status: nextStatus });
    console.log(`✅ Status updated to: ${nextStatus}`);
  } catch (err) {
    console.error("❌ Error updating booking status:", err);
    // Optional rollback if API fails
    dispatch(updateSuitBooking({ ...booking, status: currentStatus }));
  }
};


  // 🎨 Dynamic colors for status button
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#facc15"; // yellow
      case "In Progress":
        return "#3b82f6"; // blue
      case "Completed":
        return "#16a34a"; // green
      case "Cancelled":
        return "#ef4444"; // red
      default:
        return "gray";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Customer Name Bookings</Text>

      {Bookings.map((b: any, index: any) => (
        <View key={b.id} style={styles.card}>
          {b.image && b.image.length > 0 ? (
  <Image
    source={{ uri: b.image[0] }} // 👈 use first image
    style={styles.image}
    resizeMode="cover"
  />
) : (
  <Text style={{ fontStyle: "italic", color: "#6b7280", marginTop: 5 }}>
    No image available
  </Text>
)}

          <Text style={styles.cardText}>Booking Date: {b.bookingDate}</Text>
          <Text style={styles.cardText}>Measurement Date: {b.measurementDate}</Text>
          <Text style={styles.cardText}>Completion Date: {b.completionDate}</Text>
          <Text style={styles.cardText}>Stitching Fee: {b.stitchingFee}</Text>
          <Text style={styles.cardText}>Status: {b.status}</Text>

          <View style={styles.buttonRow}>
            

            {/* 🔄 Status toggle button */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: getStatusColor(b.status), flex: 1, marginRight: 5 },
              ]}
              onPress={() => handleStatus(b.id)}
            >
              <Text style={styles.actionText}>{b.status}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#f87171", flex: 1, marginLeft: 5 }]}
              onPress={() => deleteBooking(b.id)}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {selectedBooking && (
        <BookingModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          userId="u123"
          customers={[]}
          measurements={{ m1: [{ id: "m1", date: "2024-01-01" }] }}
        />
      )}
    </ScrollView>
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
  cardText: { fontSize: 16, marginBottom: 5 },
  image: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionBtn: { padding: 10, borderRadius: 8, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "bold" },
  btn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#3b82f6",
    marginEnd: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
