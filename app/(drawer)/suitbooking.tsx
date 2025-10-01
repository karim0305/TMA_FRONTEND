import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BookingModal from "../Models/bookingsuit";

interface Booking {
  bookingDate: string;
  measurementDate: string;
  completionDate: string;
  stitchingFee: string;
  image?: string;
}

export default function ViewBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Dummy data with online images for testing
    setBookings([
      {
        bookingDate: "2025-09-28",
        measurementDate: "2025-09-30",
        completionDate: "2025-10-05",
        stitchingFee: "5000",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkmj1Fl1LfTnanx8tetmWML107FUYSnvDVnQ&s",
      },
      {
        bookingDate: "2025-10-01",
        measurementDate: "2025-10-03",
        completionDate: "2025-10-10",
        stitchingFee: "6500",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkmj1Fl1LfTnanx8tetmWML107FUYSnvDVnQ&s",
      },
    ]);
  }, []);

  const openAddModal = () => {
    setEditIndex(null);
    setSelectedBooking({ bookingDate: "", measurementDate: "", completionDate: "", stitchingFee: "" });
    setModalVisible(true);
  };

  const openEditModal = (index: number) => {
    setEditIndex(index);
    setSelectedBooking(bookings[index]);
    setModalVisible(true);
  };

  const saveBooking = (booking: Booking) => {
    const updatedBookings = [...bookings];
    if (editIndex !== null) {
      updatedBookings[editIndex] = booking;
    } else {
      updatedBookings.push(booking);
    }
    setBookings(updatedBookings);
    setModalVisible(false);
  };

  const deleteBooking = (index: number) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedBookings = [...bookings];
          updatedBookings.splice(index, 1);
          setBookings(updatedBookings);
        },
      },
    ]);
  };

  return (
   <ScrollView style={styles.container}>
  <Text style={styles.title}>Suit Bookings</Text>

  {bookings.map((b, index) => (
    <View key={index} style={styles.card}>
        {/* Display image */}
      {b.image ? (
        <Image source={{ uri: b.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={{ fontStyle: "italic", color: "#6b7280", marginTop: 5 }}>No image available</Text>
      )}
      {/* Booking Details */}
      <Text style={styles.cardText}>Booking Date: {b.bookingDate}</Text>
      <Text style={styles.cardText}>Measurement Date: {b.measurementDate}</Text>
      <Text style={styles.cardText}>Completion Date: {b.completionDate}</Text>
      <Text style={styles.cardText}>Stitching Fee: {b.stitchingFee}</Text>

    

      {/* Buttons below content */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "black", flex: 1, marginRight: 5 }]}
          onPress={() => openEditModal(index)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "gray", flex: 1, marginRight: 5 }]}
          onPress={() => openEditModal(index)}
        >
          <Text style={styles.actionText}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#f87171", flex: 1, marginLeft: 5 }]}
          onPress={() => deleteBooking(index)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))}

  {/* Add Booking button at the bottom */}
  <TouchableOpacity style={[styles.btn, { backgroundColor: "black", marginTop: 20 }]} onPress={openAddModal}>
    <Text style={styles.btnText}>Add New Booking</Text>
  </TouchableOpacity>

  {selectedBooking && (
   <BookingModal
  visible={modalVisible}
  booking={{
    bookingDate: "2025-10-01",
    measurementDate: "2025-10-03",
    completionDate: "2025-11-01",
    stitchingFee: "5000",
    customerId: "123",
    measurementId: "m1"
  }}
  onClose={() => setModalVisible(false)}
  onSave={saveBooking}
/>
  )}
</ScrollView>

  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f3f4f6", flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#111827" },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 15, borderRadius: 10, elevation: 3 },
  cardText: { fontSize: 16, marginBottom: 5 },
  image: { width: "100%", height: 150, marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionBtn: { padding: 10, borderRadius: 8, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "bold" },
  btn: { padding: 12, borderRadius: 10, alignItems: "center", marginVertical: 10, backgroundColor: "#3b82f6" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
