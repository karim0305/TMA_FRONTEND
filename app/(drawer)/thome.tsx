import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function TailorDashboard() {
  const { currentUser } = useSelector((state: RootState) => state.users);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👔 Tailor Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {currentUser?.name || "Tailor"}</Text>

      {/* Stats Section */}
      <View style={styles.cardGrid}>
        {[
          { title: "Total Bookings", value: "54", color: "#2563eb" },
          { title: "Completed Orders", value: "35", color: "#16a34a" },
          { title: "Pending Orders", value: "19", color: "#f97316" },
          { title: "Active Customers", value: "22", color: "#7c3aed" },
          { title: "Measurements Taken", value: "68", color: "#4f46e5" },
          { title: "Upcoming Deliveries", value: "7", color: "#dc2626" },
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

      {/* Quick Actions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickGrid}>
          {[
            { label: "Add Customer", desc: "Register a new customer", color: "#2563eb" },
            { label: "Add Measurement", desc: "Record new measurements", color: "#16a34a" },
            { label: "Add Booking", desc: "Create a new suit booking", color: "#f97316" },
            { label: "View Bookings", desc: "Check all your orders", color: "#4f46e5" },
            { label: "Pending Orders", desc: "View all pending suits", color: "#7c3aed" },
            { label: "Completed Orders", desc: "Review finished orders", color: "#dc2626" },
          ].map((action, index) => (
            <TouchableOpacity key={index} style={styles.quickItem}>
              <View style={[styles.quickIcon, { backgroundColor: action.color }]} />
              <Text style={styles.quickLabel}>{action.label}</Text>
              <Text style={styles.quickDesc}>{action.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
