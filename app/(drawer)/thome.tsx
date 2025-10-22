import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SuitBookingApi, UserApi } from "@/api/apis";
import { setBookings, setSuitBookingError, setSuitBookingLoading, SuitBooking } from "../redux/slices/suitBookingSlice";
import { setUsers, User } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

export default function TailorDashboard() {
  const dispatch = useDispatch();
  const currentUser = useSelector<RootState, User | null>((state) => state.users.currentUser);
  const allUsers = useSelector<RootState, User[]>((state) => state.users.list);
  const allBookings = useSelector<RootState, SuitBooking[]>((state) => state.booking.list);

  const [stats, setStats] = useState({
    totalBookings: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
  });

  // Fetch Bookings
  const GetBookingsWithName = async () => {
    try {
      dispatch(setSuitBookingLoading(true));
      const res = await axios.get(SuitBookingApi.getBookingswithname);

      if (res.data.success) {
        const mapped = res.data.data.map((b: any, index: number) => ({
          id: b._id || index.toString(),
          userId: b.userId?._id || null,
          customerId: b.customerId?._id || null,
          customerName: b.customerId?.name || "",
          measurementId: b.measurementId?._id || null,
          measurementDate: b.measurementId?.measurementDate || b.measurementDate || "",
          bookingDate: b.bookingDate || "",
          completionDate: b.completionDate || "",
          stitchingFee: b.stitchingFee || 0,
          status: ["Pending", "In Progress", "Completed", "Cancelled"].includes(b.status)
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
    } finally {
      dispatch(setSuitBookingLoading(false));
    }
  };

  // Fetch Users
  const GetUser = async () => {
    try {
      const res = await axios.get(UserApi.getUsers);
      const mapped = res.data.map((u: any, index: number) => ({
        id: u._id || index.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone,
        cnic: u.cnic,
        address: u.address,
        role: u.role,
        image: u.image,
      }));
      dispatch(setUsers(mapped));
      console.log("Mapped Users:", mapped);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    GetBookingsWithName();
    GetUser();
  }, []);

  useEffect(() => {
    const totalBookings = allBookings.length;
    const completedOrders = allBookings.filter(b => b.status === "Completed").length;
    const pendingOrders = allBookings.filter(b => b.status === "Pending").length;
    const totalCustomers = allUsers.filter(u => u.role === "Customer").length;

    setStats({
      totalBookings,
      completedOrders,
      pendingOrders,
      totalCustomers,
    });
  }, [allBookings, allUsers]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👔 Tailor Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {currentUser?.name || "Tailor"}</Text>

      {/* Stats Section */}
      <View style={styles.cardGrid}>
        {[
          { title: "Total Bookings", value: String(stats.totalBookings), color: "#2563eb" },
          { title: "Completed Orders", value: String(stats.completedOrders), color: "#16a34a" },
          { title: "Pending Orders", value: String(stats.pendingOrders), color: "#f97316" },
          { title: "Total Customers", value: String(stats.totalCustomers), color: "#7c3aed" },
        ].map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
            </View>
            <Text style={styles.cardValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Recent Activities */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🧵 Recent Tailor Activities</Text>
        {[
          { title: "New Booking from Ahmed Khan", time: "2 hours ago", color: "#2563eb" },
          { title: "Measurement saved for Sara Ali", time: "4 hours ago", color: "#16a34a" },
          { title: "Order #102 marked as completed", time: "1 day ago", color: "#f97316" },
          { title: "Follow-up with John Doe scheduled", time: "2 days ago", color: "#7c3aed" },
        ].map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[styles.smallDot, { backgroundColor: activity.color }]} />
            <View>
              <Text style={styles.activityText}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Customer Feedback */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>💬 Customer Feedback</Text>
        {[
          { customer: "Ahmed Khan", comment: "Great fitting suit!", time: "1 hour ago" },
          { customer: "Sara Ali", comment: "Loved the stitching!", time: "3 hours ago" },
          { customer: "John Doe", comment: "Delivery was smooth!", time: "1 day ago" },
        ].map((feedback, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[styles.smallDot, { backgroundColor: "#2563eb" }]} />
            <View>
              <Text style={styles.activityText}>{feedback.customer}</Text>
              <Text style={styles.activityTime}>
                {feedback.comment} — {feedback.time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4, color: "#111827" },
  subtitle: { color: "#6b7280", marginBottom: 16 },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 12, fontWeight: "500", color: "#374151" },
  dot: { width: 16, height: 16, borderRadius: 8 },
  cardValue: { fontSize: 22, fontWeight: "bold", marginTop: 6, color: "#111827" },
  sectionCard: {
    marginBottom: 18,
    padding: 14,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12, color: "#111827" },
  activityItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  smallDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  activityText: { fontSize: 14, fontWeight: "500" },
  activityTime: { fontSize: 12, color: "#6b7280" },
});
