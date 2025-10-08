import { SuitBookingApi } from "@/api/apis";
import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BookingModal from "../Models/bookingsuit"; // 👈 make sure path sahi ho
import { setBookings, setSuitBookingError, updateSuitBooking } from "../redux/slices/suitBookingSlice";
import { RootState } from "../redux/store";

export default function Bookings() {

  const { currentUser } = useSelector((state: RootState) => state.users);
    const params = useLocalSearchParams();
    const measureId = params.measureId;
  



  const router = useRouter();
   const navigation = useNavigation();
    const dispatch = useDispatch();
  const Bookings = useSelector((state: RootState) => state.booking.list);
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setSelectedBooking(null); // 👈 for new booking
            setModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
        ),
      });
    }, [navigation]);
  

      useEffect(() => {
      //      console.log("Measure id -----:", measureId); // Should log { customerId: "..." }
      //  console.log("current  id -----:", currentUser?.id); 
    GetBooking();
  }, [dispatch]);

  const GetBooking = async () => {
    try {
      const res = await axios.get(SuitBookingApi.getBookings);

      const mapped = res.data.data.map((b: any, index: number) => ({
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
      console.log("✅ Mapped Bookings:", mapped);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      dispatch(setSuitBookingError("Failed to fetch bookings"));
    }
  };

  

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);


type BookingStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";
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

  // ✅ Save new or updated booking


const filteredBookings = Bookings.filter(
  (b) =>
    (b.customerName ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (b.bookingDate ?? "").includes(search) ||
    (b.completionDate ?? "").includes(search)
);

  return (
    <View style={styles.container}>
      {/* Header */}

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or date..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            {/* Pictures */}
           {Array.isArray(item.image) && item.image.length > 0 ? (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginBottom: 10 }}
  >
    {item.image.map((pic, i) => (
      <Image
        key={i.toString()}
        source={{ uri: pic }}
        style={styles.avatar}
        resizeMode="cover"
      />
    ))}
  </ScrollView>
) : (
  <Text style={{ color: "#6b7280", fontStyle: "italic", marginBottom: 10 }}>
    No images available
  </Text>
)}


            {/* Info */}
            <Text style={styles.name}>{index + 1}. {item.customerName}</Text>
            <Text style={styles.detail}>📅 Booking: {item.bookingDate}</Text>
            <Text style={styles.detail}>✅ Completion: {item.completionDate}</Text>
            <Text style={styles.detail}>💵 Fee: Rs {item.stitchingFee}</Text>

            {/* Status */}
            <TouchableOpacity
                         style={[
                           styles.actionBtn,
                           { backgroundColor: getStatusColor(item.status), flex: 1, marginRight: 5 },
                         ]}
                         onPress={() => handleStatus(item.id)}
                       >
                         <Text style={styles.actionText}>{item.status}</Text>
                       </TouchableOpacity>

            {/* Actions */}
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

      {/* ✅ Modal */}
      {modalVisible && (
        <BookingModal
  visible={modalVisible}
  customers={[{ id: "c1", name: "Ali" }, { id: "c2", name: "Ahmed" }]}
  measurements={{
    c1: [{ id: "m1", date: "2025-09-01" }, { id: "m2", date: "2025-09-15" }],
    c2: [{ id: "m3", date: "2025-09-20" }],
  }}
  onClose={() => setModalVisible(false)}
  userId="u123"
/>
      )}
    </View>
  );
}

const statusStyles: Record<string, any> = {
  pending: { backgroundColor: "#f59e0b" },
  progress: { backgroundColor: "#3b82f6" },
  completed: { backgroundColor: "#10b981" },
  cancelled: { backgroundColor: "#ef4444" },
};

// Styles (same as before)...
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f3f4f6" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  addBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 14 },
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
