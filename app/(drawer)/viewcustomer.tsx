import { UserApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Add from "../Models/add"; // Customer add modal
import Edit from "../Models/Edit"; // Customer edit modal
import {
  addUser,
  deleteUser,
  setUsers,
  updateUser,
  User,
} from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

export default function ViewCustomers() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.users.list);
  const { currentUser } = useSelector((state: RootState) => state.users);

  // ✅ Add "+" button to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  

  // ✅ Fetch customers when current user is available
  useEffect(() => {
    if (currentUser?.id) {
      console.log("✅ Current user ID:", currentUser.id);
      GetCustomers();
    } else {
      console.log("⚠️ currentUser not found yet");
    }
  }, [currentUser]);

  // ✅ Fetch customers function
  const GetCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(UserApi.getUsers);
      const mapped = res.data.map((u: any, index: number) => ({
        _id: u._id,          // ✅ keep MongoDB _id
        id: u._id,           // optional – keeps compatibility with older code
        UserId: u.UserId,
        name: u.name,
        email: u.email,
        phone: u.phone,
        cnic: u.cnic,
        address: u.address,
        role: u.role,
        image: u.image,
        chest: u.chest,
        waist: u.waist,
        length: u.length,
      }));
      dispatch(setUsers(mapped));
      console.log("✅ Customers fetched:", mapped.length);
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add customer
  const handleAddCustomer = (newCustomer: User) => {
    dispatch(
      addUser({
        ...newCustomer,
        id: Date.now().toString(),
      })
    );
  };

  // ✅ Update customer
  const handleUpdateCustomer = (updatedCustomer: User) => {
    dispatch(updateUser(updatedCustomer));
  };

  // ✅ Delete customer
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(UserApi.deleteUser(id));
      dispatch(deleteUser(id));
      console.log("Customer deleted successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // ✅ Filter customers
const filteredCustomers = Array.isArray(users)
  ? users.filter((c) => {
      const query = search?.toLowerCase() || "";
      const isAdmin = currentUser?.role?.toLowerCase() === "admin";

      return (
        c.role?.toLowerCase() === "customer" &&
        (isAdmin || c.UserId === currentUser?._id || c.UserId === currentUser?.id) &&
        (
          (c.name?.toLowerCase() || "").includes(query) ||
          (c.email?.toLowerCase() || "").includes(query) ||
          (c.phone || "").includes(search || "")
        )
      );
    })
  : [];


  // ✅ UI
  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, email, or phone..."
        value={search}
        onChangeText={setSearch}
      />

      {/* ✅ Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="black" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
              No customer found
            </Text>
          }
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                {/* Image */}
                <Image source={{ uri: item.image }} style={styles.avatar} />

                {/* Info */}
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {index + 1}. {item.name}
                  </Text>

                  <View style={styles.rowDetail}>
                    <Ionicons
                      name="call-outline"
                      size={16}
                      color="#374151"
                      style={styles.icon}
                    />
                    <Text style={styles.detail}>{item.phone}</Text>
                  </View>

                  <View style={styles.rowDetail}>
                    <Ionicons
                      name="mail-outline"
                      size={16}
                      color="#374151"
                      style={styles.icon}
                    />
                    <Text style={styles.detail}>{item.email}</Text>
                  </View>

                  <View style={styles.rowDetail}>
                    <Ionicons
                      name="home-outline"
                      size={16}
                      color="#374151"
                      style={styles.icon}
                    />
                    <Text style={styles.detail}>{item.address}</Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "black" }]}
                  onPress={() => {
                    setSelectedCustomer(item);
                    setEditModalVisible(true);
                  }}
                >
                  <Text style={styles.btnText}>✏️ Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#ef4444" }]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.btnText}>🗑 Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#3b82f6" }]}
                  onPress={() => {
                    console.log("🧾 item:", item);
                    console.log("🧾 item._id:", item._id);
                    router.push(`/viewmeasurments?customerId=${item._id}`);
                  }}
                >

                  <Text style={styles.btnText}>📏 Measure</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}


      {/* Modals */}
      <Add
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddCustomer}
      />

      {selectedCustomer && (
        <Edit
          visible={editModalVisible}
          tailor={selectedCustomer}
          onClose={() => setEditModalVisible(false)}
        />
      )}

    </View>

  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  searchInput: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: { flexDirection: "row", marginBottom: 8 },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    backgroundColor: "#e5e7eb",
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 2, color: "#111827" },
  detail: { fontSize: 14, color: "#374151", marginBottom: 2 },
  addBtn: {
    backgroundColor: "black",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginEnd: 10,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 14 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 13 },
  rowDetail: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  icon: { marginRight: 6 },
});
