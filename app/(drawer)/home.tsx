import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TailorDashboard() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tailor Dashboard</Text>
      <Text style={styles.subtitle}>Overview of your tailoring management system</Text>

      {/* Stats Cards */}
      <View style={styles.cardGrid}>
        {[
          { title: 'Total Tailors', value: '42', color: '#2563eb' },
          { title: 'Total Customers', value: '1,120', color: '#16a34a' },
          { title: 'Total Products', value: '320', color: '#7c3aed' },
          { title: 'Total Orders', value: '980', color: '#f97316' },
          { title: 'Total Sales', value: '$25,430', color: '#dc2626' },
          { title: 'Active Tailors', value: '35', color: '#4f46e5' },
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

      {/* Sections */}
      <View style={styles.sectionGrid}>
        {/* Recent Activities */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {[
            { title: 'New customer registered', time: '2 hours ago', color: '#2563eb' },
            { title: 'Order #123 delivered', time: '4 hours ago', color: '#16a34a' },
            { title: 'Tailor Ali joined', time: '1 day ago', color: '#7c3aed' },
            { title: 'Customer left a comment', time: '2 days ago', color: '#f97316' },
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
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {[
              { label: 'Add Customer', desc: 'Register new customer', color: '#2563eb' },
              { label: 'Add Tailor', desc: 'Register new tailor', color: '#16a34a' },
              { label: 'Add Product', desc: 'Create new product', color: '#7c3aed' },
              { label: 'Add Order', desc: 'Create new order', color: '#f97316' },
              { label: 'Add Admin', desc: 'Create new admin', color: '#dc2626' },
              { label: 'Add Sale', desc: 'Record new sale', color: '#4f46e5' },
            ].map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickItem}>
                <View style={[styles.quickIcon, { backgroundColor: action.color }]} />
                <Text style={styles.quickLabel}>{action.label}</Text>
                <Text style={styles.quickDesc}>{action.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Customer Comments & Messages */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Feedback</Text>
          {[
            { customer: 'Ahmed Khan', comment: 'Great fitting suit!', time: '1 hour ago' },
            { customer: 'Sara Ali', comment: 'Loved the stitching quality.', time: '3 hours ago' },
            { customer: 'John Doe', comment: 'Delivery was quick and smooth.', time: '1 day ago' },
          ].map((feedback, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={[styles.smallDot, { backgroundColor: '#2563eb' }]} />
              <View>
                <Text style={styles.activityText}>{feedback.customer}</Text>
                <Text style={styles.activityTime}>{feedback.comment} - {feedback.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#6b7280', marginBottom: 16 },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 12, fontWeight: '500' },
  dot: { width: 16, height: 16, borderRadius: 8 },
  cardValue: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  sectionGrid: { marginTop: 16 },
  sectionCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  smallDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  activityText: { fontSize: 14, fontWeight: '500' },
  activityTime: { fontSize: 12, color: '#6b7280' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 12,
  },
  quickIcon: { width: 24, height: 24, borderRadius: 4, marginBottom: 8 },
  quickLabel: { fontWeight: '600' },
  quickDesc: { fontSize: 12, color: '#6b7280' },
});
