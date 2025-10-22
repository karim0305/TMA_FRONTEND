import { UserApi } from '@/api/apis';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, User } from '../redux/slices/userSlice';
import { RootState } from '../redux/store';



const { width } = Dimensions.get('window');

export default function TailorDashboard() {
   const [recentUsers, setRecentUsers] = useState<User[]>([]);

  const { currentUser } = useSelector((state: RootState) => state.users);
    const navigation = useNavigation();
    const dispatch = useDispatch();
  const [counts, setCounts] = useState({
    totalTailors: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    totalActiveTailors: 0,
    totalInactiveTailors: 0,
  });
  useEffect(() => {
      GetUser();
  
    },[dispatch])




const GetUser = async () => {
  try {
    const res = await axios.get(UserApi.getUsers);
    const mapped: User[] = res.data.map((u: any, index: number): User => ({
      id: u._id || index.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone,
      cnic: u.cnic,
      address: u.address,
      role: u.role,
      image: u.image,
      createdAt: u.createdAt,
      status: u.status === 'Active' ? 'Active' : u.status === 'Inactive' ? 'Inactive' : undefined,
    }));

    // Count total users by role
    const totalCustomers = mapped.filter(user => user.role === "Customer").length;
    const totalTailors = mapped.filter(user => user.role === "Tailor").length;
    const totalAdmins = mapped.filter(user => user.role === "Admin").length;

    // Count active users based on status
    const totalActiveTailors = mapped.filter(user => user.role === "Tailor" && user.status === 'Active').length;
        const totalInactiveTailors = mapped.filter(user => user.role === "Tailor" && user.status === 'Inactive').length;

    // Optionally, dispatch these counts to the store or use them as needed
    dispatch(setUsers(mapped));

    setCounts({
      totalTailors,
      totalCustomers,
      totalAdmins,
      totalActiveTailors,
      totalInactiveTailors,
    });

    console.log("Mapped Users:", mapped);
      // Sort by createdAt (descending), take top 4
const recent = [...mapped]
  .filter(u => u.createdAt)
  .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
  .slice(0, 4);

setRecentUsers(recent);


  } catch (err) {
    console.error("Error fetching users:", err);            
  }
};

  const chartData = [
    { label: 'Tailors', value: counts.totalTailors, color: '#2563eb' },
    { label: 'Customers', value: counts.totalCustomers, color: '#16a34a' },
    { label: 'Admins', value: counts.totalAdmins, color: '#dc2626' },
    { label: 'Active', value: counts.totalActiveTailors, color: '#4f46e5' },
    { label: 'Inactive', value: counts.totalInactiveTailors, color: '#6b7280' },
  ];
  const chartWidth = width - 40;
  const chartHeight = 200;
  const barWidth = 32;
  const maxVal = Math.max(1, ...chartData.map(d => d.value));
  const gap = (chartWidth - barWidth * chartData.length) / (chartData.length + 1);



  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tailor Dashboard</Text>
      <Text style={styles.subtitle}>Overview of your tailoring management system</Text>

      {/* Stats Cards */}
      <View style={styles.cardGrid}>
        {[
          { title: 'Total Tailors', value: String(counts.totalTailors), color: '#2563eb' },
          { title: 'Total Customers', value: String(counts.totalCustomers), color: '#16a34a' },
          { title: 'Active Tailors', value: String(counts.totalActiveTailors), color: '#4f46e5' },
          { title: 'Inactive Tailors', value: String(counts.totalInactiveTailors), color: '#4f46e5' },
          // { title: 'Total Products', value: '320', color: '#7c3aed' },
          // { title: 'Total Orders', value: '980', color: '#f97316' },
          // { title: 'Total Sales', value: '$25,430', color: '#dc2626' },

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
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Overview Chart</Text>
          <Svg width={chartWidth} height={chartHeight}>
            <Line x1={10} y1={chartHeight - 20} x2={chartWidth - 10} y2={chartHeight - 20} stroke="#d1d5db" strokeWidth={2} />
            <G>
              {chartData.map((d, i) => {
                const h = Math.round((d.value / maxVal) * (chartHeight - 60));
                const x = Math.round(gap * (i + 1) + barWidth * i);
                const y = chartHeight - 20 - h;
                const labelX = x + barWidth / 2;
                return (
                  <G key={d.label}>
                    <Rect x={x} y={y} width={barWidth} height={h} fill={d.color} rx={6} />
                    <SvgText x={labelX} y={y - 6} fontSize={12} fill="#374151" textAnchor="middle">{String(d.value)}</SvgText>
                    <SvgText x={labelX} y={chartHeight - 4} fontSize={12} fill="#6b7280" textAnchor="middle">{d.label}</SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </View>



        {/* Recent Activities */}
        <View style={styles.sectionCard}>
  <Text style={styles.sectionTitle}>Recent Registrations</Text>

  {recentUsers.map((user, idx) => (
    <View key={idx} style={styles.activityItem}>
      <View style={[styles.smallDot, { backgroundColor: '#2563eb' }]} />
      <View>
        <Text style={styles.activityText}>{user.name}</Text>
       <Text style={styles.activityTime}>
  {formatDistanceToNow(new Date(user.createdAt!), { addSuffix: true })}
</Text>

      </View>
    </View>
  ))}
</View>


        {/* Customer Feedback */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Feedback</Text>
          {[
            { customer: 'Ahmed Khan', comment: 'Great fitting suit!', time: '1 hour ago' },
            { customer: 'Sara Ali', comment: 'Loved the stitching quality.', time: '3 hours ago' },
            { customer: 'John Doe', comment: 'Delivery was quick and smooth.', time: '1 day ago' },
          ].map((feedback, idx) => (
            <View key={idx} style={styles.activityItem}>
              <View style={[styles.smallDot, { backgroundColor: '#2563eb' }]} />
              <View>
                <Text style={styles.activityText}>{feedback.customer}</Text>
                <Text style={styles.activityTime}>
                  {`${feedback.comment} - ${feedback.time}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width / 2) - 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#111827',
  },
  sectionGrid: {
    marginTop: 24,
  },
  sectionCard: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  smallDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280',
  },
});
