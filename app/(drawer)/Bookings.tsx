import { SuitBookingApi } from "@/api/apis";
import axios from "axios";
import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BookingModal from "../Models/bookingsuit";
import {
  BookingStatus,
  setBookings,
  setSuitBookingError,
  updateSuitBooking,
} from "../redux/slices/suitBookingSlice";
import { RootState } from "../redux/store";

export default function Bookings() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { currentUser } = useSelector((state: RootState) => state.users);
  console.log(currentUser?.id)
  const Bookings = useSelector((state: RootState) => state.booking.list);

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // ✅ Header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setSelectedBooking(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // ✅ Fetch bookings from API (with user/customer/measurement populated)
  const GetBookingsWithName = async () => {
    try {
      const res = await axios.get(SuitBookingApi.getBookingswithname);

      if (res.data.success) {
     const mapped = res.data.data.map((b: any, index: number) => ({
  id: b._id || index.toString(),
  userId: b.userId?._id || null,
  userName: b.userId?.name || "",
  customerId: b.customerId?._id || null,
  customerName: b.customerId?.name || "",
  measurementId: b.measurementId?._id || null,
  measurementDate:
    b.measurementId?.measurementDate || b.measurementDate || "",
  bookingDate: b.bookingDate || "",
  completionDate: b.completionDate || "",
  stitchingFee: b.stitchingFee || 0,
  status:
    ["Pending", "In Progress", "Completed", "Cancelled"].includes(b.status)
      ? (b.status as "Pending" | "In Progress" | "Completed" | "Cancelled")
      : "Pending",
  image: Array.isArray(b.image) ? b.image : [],
  createdAt: b.createdAt || "",
  updatedAt: b.updatedAt || "",
}));


        dispatch(setBookings(mapped));
        console.log("✅ Bookings fetched:", mapped);
      } else {
        console.log("⚠️ Failed to fetch:", res.data.message);
        dispatch(setSuitBookingError(res.data.message));
      }
    } catch (err: any) {
      console.error("❌ Error fetching bookings:", err.message);
      dispatch(setSuitBookingError("Failed to fetch bookings"));
    }
  };

  // ✅ Run once on mount
  useEffect(() => {
    GetBookingsWithName();
  }, [dispatch]);

  // ✅ Handle status update
const handleStatus = async (id: string) => {
  const statusOptions: BookingStatus[] = [
    "Pending",
    "In Progress",
    "Completed",
    "Cancelled",
  ];

  const booking = Bookings.find((b) => b.id === id);
  if (!booking) return;

  const currentStatus = booking.status || "Pending";
  const nextStatus =
    statusOptions[(statusOptions.indexOf(currentStatus) + 1) % statusOptions.length];

  // ✅ Update Redux instantly (with type-safe status)
dispatch(updateSuitBooking({ ...booking, status: nextStatus as BookingStatus }));

  try {
    await axios.patch(SuitBookingApi.updateBooking(id), { status: nextStatus });
    console.log(`✅ Status updated to: ${nextStatus}`);
  } catch (err) {
    console.error("❌ Error updating booking status:", err);
    // rollback if failed
    dispatch(updateSuitBooking({ ...booking, status: currentStatus }));
  }
};


  // ✅ Delete booking
  const deleteBooking = async (id: string) => {
    try {
      await axios.delete(SuitBookingApi.deleteBooking(id));
      const updated = Bookings.filter((b) => b.id !== id);
      dispatch(setBookings(updated));
      console.log("✅ Booking deleted");
    } catch (err) {
      console.error("❌ Error deleting booking:", err);
    }
  };

  // ✅ Search filter
const filteredBookings = Bookings.filter(
  (b) =>
    b.status !== "Completed" && // 🚫 exclude completed bookings
    b.userId === currentUser?.id && // ✅ show only current user's bookings
    (
      (b.customerName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (b.bookingDate ?? "").includes(search) ||
      (b.completionDate ?? "").includes(search)
    )
);
  // ✅ Color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#facc15";
      case "In Progress":
        return "#3b82f6";
      case "Completed":
        return "#16a34a";
      case "Cancelled":
        return "#ef4444";
      default:
        return "gray";
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by customer or date..."
        value={search}
        onChangeText={setSearch}
      />

      {/* 📋 Booking List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            {/* 🖼 Images */}
            {item.image && item.image.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 10 }}
              >
               {item.image && item.image.length > 0 && (
  <Image
    source={{ uri: item.image[0] }} // ✅ Show only the first image
    style={styles.avatar}
    resizeMode="cover"
  />
)}
              </ScrollView>
            ) : (
              <Text
                style={{
                  color: "#6b7280",
                  fontStyle: "italic",
                  marginBottom: 10,
                }}
              >
                No images available
              </Text>
            )}

            {/* ℹ️ Info */}
            <Text style={styles.name}>
              {index + 1}. {item.customerName || "Unknown"}
            </Text>
        
            <Text style={styles.detail}>📅 Booking: {item.bookingDate}</Text>
            <Text style={styles.detail}>
              ✅ Completion: {item.completionDate}
            </Text>
            <Text style={styles.detail}>💵 Fee: Rs {item.stitchingFee}</Text>

            {/* 🔘 Status */}
            <TouchableOpacity
              style={[
                styles.statusBtn,
                { backgroundColor: getStatusColor(item.status) },
              ]}
              onPress={() => handleStatus(item.id)}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </TouchableOpacity>

            {/* 🗑 Delete */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#ef4444" }]}
                onPress={() => deleteBooking(item.id)}
              >
                <Text style={styles.actionText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* ➕ Modal */}
      {modalVisible && (
        <BookingModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          userId={currentUser?.id || ""}
          customers={[{ id: "c1", name: "Ali" }]}
          measurements={{ c1: [{ id: "m1", date: "2025-09-01" }] }}
        />
      )}
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f3f4f6" },
  addBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 6, color: "#111827" },
  detail: { fontSize: 14, color: "#374151", marginBottom: 2 },
  statusBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: { color: "white", fontWeight: "600", fontSize: 13 },
  actions: { flexDirection: "row", marginTop: 12, justifyContent: "flex-end" },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  actionText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
