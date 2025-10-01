import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BookingModal from "../Models/bookingsuit"; // 👈 make sure path sahi ho

export default function Bookings() {
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([
    {
      id: "1",
      customerName: "Muhammad Ali",
      bookingDate: "2025-10-01",
      completionDate: "2025-11-15",
      stitchingFee: "5000",
      pictures: [
        "https://picsum.photos/100/100?random=1",
        "https://picsum.photos/120/100?random=2",
      ],
      status: "pending",
    },
  ]);

  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const statusCycle = ["pending", "progress", "completed", "cancelled"];

  const toggleStatus = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: statusCycle[(statusCycle.indexOf(b.status) + 1) % statusCycle.length] }
          : b
      )
    );
  };

  const handleDelete = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    Alert.alert("Deleted", "Booking deleted successfully!");
  };

  // ✅ Save new or updated booking
  const saveBooking = (newBooking: any) => {
    if (newBooking.id) {
      // Update existing
      setBookings((prev) =>
        prev.map((b) => (b.id === newBooking.id ? newBooking : b))
      );
    } else {
      // Add new
      setBookings((prev) => [
        ...prev,
        { ...newBooking, id: Date.now().toString() },
      ]);
    }
    setModalVisible(false);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingDate.includes(search) ||
      b.completionDate.includes(search)
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>📑 Suit Bookings</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setSelectedBooking(null); // 👈 for new booking
            setModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {item.pictures?.map((pic: any, i: any) => (
                <Image key={i} source={{ uri: pic }} style={styles.avatar} />
              ))}
            </ScrollView>

            {/* Info */}
            <Text style={styles.name}>{index + 1}. {item.customerName}</Text>
            <Text style={styles.detail}>📅 Booking: {item.bookingDate}</Text>
            <Text style={styles.detail}>✅ Completion: {item.completionDate}</Text>
            <Text style={styles.detail}>💵 Fee: Rs {item.stitchingFee}</Text>

            {/* Status */}
            <TouchableOpacity
              style={[styles.statusBtn, statusStyles[item.status]]}
              onPress={() => toggleStatus(item.id)}
            >
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </TouchableOpacity>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#3b82f6" }]}
                onPress={() => {
                  setSelectedBooking(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#ef4444" }]}
                onPress={() => handleDelete(item.id)}
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
  booking={{ bookingDate: "",  measurementDate: "",  completionDate: "", stitchingFee: "" }}
  customers={[{ id: "c1", name: "Ali" }, { id: "c2", name: "Ahmed" }]}
  measurements={{
    c1: [{ id: "m1", date: "2025-09-01" }, { id: "m2", date: "2025-09-15" }],
    c2: [{ id: "m3", date: "2025-09-20" }],
  }}
  onClose={() => setModalVisible(false)}
  onSave={saveBooking}
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
