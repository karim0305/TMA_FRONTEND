import { SuitBookingApi } from "@/api/apis";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BookingModal from "../Models/bookingsuit";
import { setBookings, setSuitBookingError, updateSuitBooking } from "../redux/slices/suitBookingSlice";
import { RootState } from "../redux/store";
import { SuitBookingStyle } from "../styles/SuitBookingStyle";

interface Booking {
  id: string;
  bookingDate: string;
  measurementDate: string;
  completionDate: string;
  stitchingFee: string | number;
 status: BookingStatus;
  image?: string[];
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
          style={[SuitBookingStyle.btn, { backgroundColor: "black", marginTop: 20 }]}
          onPress={openAddModal}
        >
          <Text style={SuitBookingStyle.btnText}>+</Text> 
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const [customerId, setCustomerId] = useState<string | null>(null);
const [measureId, setMeasureId] = useState<string | null>(null);
const [cusName, setCustomername]  = useState<string | null>(null);

useEffect(() => {
   if (params?.customername) setCustomername(params.customername.toString());
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
  image: Array.isArray(b.image) ? b.image : b.image ? [b.image] : [],
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
    <ScrollView style={SuitBookingStyle.container}>
     <Text style={SuitBookingStyle.title}>{cusName ? cusName : "Customer"} Bookings</Text>

      {Bookings.map((b: any, index: any) => (
        <View key={b.id} style={SuitBookingStyle.card}>
          {Array.isArray(b.image) && b.image.length > 0 ? (
            <Image
              source={{ uri: b.image[0] }}
              style={SuitBookingStyle.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ fontStyle: "italic", color: "#6b7280", marginTop: 5 }}>
              No image available
            </Text>
          )}

          <Text style={SuitBookingStyle.cardText}>Booking Date: {b.bookingDate}</Text>
          <Text style={SuitBookingStyle.cardText}>Measurement Date: {b.measurementDate}</Text>
          <Text style={SuitBookingStyle.cardText}>Completion Date: {b.completionDate}</Text>
          <Text style={SuitBookingStyle.cardText}>Stitching Fee: {b.stitchingFee}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Text style={SuitBookingStyle.cardText}>Status: </Text>
            <View style={[SuitBookingStyle.badge, { backgroundColor: getStatusColor(b.status) }]}>
              <Text style={SuitBookingStyle.badgeText}>{b.status}</Text>
            </View>
          </View>

          <View style={SuitBookingStyle.buttonRow}>
            

            {/* 🔄 Status toggle button */}
            
            <TouchableOpacity
              style={[SuitBookingStyle.actionBtn, { backgroundColor: "#f87171", flex: 1, marginLeft: 5 }]}
              onPress={() => deleteBooking(b.id)}
            >
              <Text style={SuitBookingStyle.actionText}>Delete</Text>
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
