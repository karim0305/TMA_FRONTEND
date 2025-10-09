import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function CustomerDashboard() {
  const { currentUser } = useSelector((state: RootState) => state.users);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>🧍‍♂️ Customer Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {currentUser?.name || "Customer"}</Text>

      {/* Stats Section */}
      <View style={styles.cardGrid}>
        {[
          { title: "Total Orders", value: "12", color: "#2563eb" },
          { title: "Completed Orders", value: "8", color: "#16a34a" },
          { title: "Pending Orders", value: "4", color: "#f97316" },
          { title: "Measurements Saved", value: "5", color: "#7c3aed" },
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

      {/* Recent Orders / Activities */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🧾 Recent Orders</Text>
        {[
          { title: "3-piece Suit (Blue)", time: "Ordered 2 days ago", color: "#2563eb" },
          { title: "Kurta Pajama", time: "Delivered 1 week ago", color: "#16a34a" },
          { title: "Wedding Sherwani", time: "Pending delivery", color: "#f97316" },
        ].map((order, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[styles.smallDot, { backgroundColor: order.color }]} />
            <View>
              <Text style={styles.activityText}>{order.title}</Text>
              <Text style={styles.activityTime}>{order.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickGrid}>
          {[
            { label: "New Booking", desc: "Book a new suit", color: "#2563eb" },
            { label: "My Measurements", desc: "View or update measurements", color: "#7c3aed" },
            { label: "Order History", desc: "See your past orders", color: "#16a34a" },
            { label: "Feedback", desc: "Share your experience", color: "#f97316" },
          ].map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickItem}>
              <View style={[styles.quickIcon, { backgroundColor: action.color }]} />
              <Text style={styles.quickLabel}>{action.label}</Text>
              <Text style={styles.quickDesc}>{action.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notifications / Messages */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        {[
          { message: "Your order #104 is ready for pickup!", time: "1 hour ago" },
          { message: "Tailor updated your measurement details.", time: "3 days ago" },
          { message: "Order #103 has been marked completed.", time: "5 days ago" },
        ].map((note, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={[styles.smallDot, { backgroundColor: "#4f46e5" }]} />
            <View>
              <Text style={styles.activityText}>{note.message}</Text>
              <Text style={styles.activityTime}>{note.time}</Text>
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
  quickGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  quickItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 12,
  },
  quickIcon: { width: 24, height: 24, borderRadius: 4, marginBottom: 8 },
  quickLabel: { fontWeight: "600", color: "#111827" },
  quickDesc: { fontSize: 12, color: "#6b7280" },
});
