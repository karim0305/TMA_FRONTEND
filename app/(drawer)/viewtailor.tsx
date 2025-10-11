import { UserApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import Add from "../Models/add";
import Edit from "../Models/Edit";
import PackageModal from "../Models/package";
import { addUser, deleteUser, setError, setLoading, setUsers, updateUser, User } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

export default function ViewTailors() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [packageVisible, setPackageVisible] = useState(false);
  const [selectedTailor, setSelectedTailor] = useState<any | null>(null);

  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.list);

  // 🔥 Fetch Tailors from API
  useEffect(() => {
    GetTailors();
  }, [dispatch]);

  const GetTailors = async () => {
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
        packageType: u.packageType || "N/A",
        fee: u.fee || "0",
        tillDate: u.tillDate || "-",
          status: u.status || "Inactive", 
      }));
      dispatch(setUsers(mapped));
      console.log("Mapped Tailors:", mapped);
    } catch (err) {
      console.error("Error fetching tailors:", err);
    }
  };


  

  // ✅ Filter only Tailors
  const filteredTailors = users.filter((t) => {
    const query = search?.toLowerCase() || "";
    return (
      t.role?.toLowerCase() === "tailor" &&
      ((t.name?.toLowerCase() || "").includes(query) ||
        (t.phone || "").includes(search || "") ||
        (t.cnic || "").includes(search || ""))
    );
  });

  // CRUD Handlers
  const handleAddTailor = (newTailor: User) => {
    dispatch(
      addUser({
        ...newTailor,
        id: Date.now().toString(),
        role: "tailor", // ensure role
      })
    );
  };

  const handleUpdateTailor = (updatedTailor: User) => {
    dispatch(updateUser(updatedTailor));
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(UserApi.deleteUser(id));
      dispatch(deleteUser(id));
      console.log("Tailor deleted successfully!");
    } catch (error) {
      console.error("Error deleting tailor:", error);
    }
  };




  const handleToggleStatus = async (tailor: User) => {
    const newStatus = tailor.status === "Active" ? "Inactive" : "Active";
    const userId = tailor._id || tailor.id;

    try {
       setLoadingId(userId);
      dispatch(setLoading(true));

      const response = await axios.patch(UserApi.updateUser(userId), {
        status: newStatus,
      });

      console.log("✅ Status updated:", response.data);

      dispatch(updateUser({ ...tailor, status: newStatus }));
    } catch (error) {
      console.error("❌ Failed to update status:", error);
      dispatch(setError("Failed to update status"));
    } finally {
       setLoadingId(null);
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, phone, or CNIC..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List */}
      <FlatList
        data={filteredTailors}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
            No tailor found
          </Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {index + 1}. {item.name}
                </Text>
                <View style={styles.rowDetail}>
                  <Ionicons name="call-outline" size={16} color="#374151" style={styles.icon} />
                  <Text style={styles.detail}>{item.phone}</Text>
                </View>
                <View style={styles.rowDetail}>
                  <Ionicons name="id-card-outline" size={16} color="#374151" style={styles.icon} />
                  <Text style={styles.detail}>{item.cnic}</Text>
                </View>
                <View style={styles.rowDetail}>
                  <Ionicons name="home-outline" size={16} color="#374151" style={styles.icon} />
                  <Text style={styles.detail}>{item.address}</Text>
                </View>
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  }}
>
  {/* 🟢 Clickable Dot */}
  <TouchableOpacity
    onPress={() => handleToggleStatus(item)}
    activeOpacity={0.7}
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: item.status === "Active" ? "#22c55e" : "#ef4444",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    }}
  >
    {loadingId === item.id && (
      <ActivityIndicator color="#fff" size="small" />
    )}
  </TouchableOpacity>

  {/* 📄 Status Text (not clickable) */}
  <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }}>
    {item.status === "Active" ? "Active" : "Inactive"}
  </Text>
</View>

                {/* Package Info */}
                {/* <Text style={styles.detail}>📦 {item.packageType}</Text>
                <Text style={styles.detail}>💰 {item.fee}</Text>
                <Text style={styles.detail}>⏳ {item.tillDate}</Text> */}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "black" }]}
                onPress={() => {
                  setSelectedTailor(item);
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
                  setSelectedTailor(item);
                  setPackageVisible(true);
                }}
              >
                <Text style={styles.btnText}>📦 Package</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modals */}
      <Add visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={handleAddTailor} />

      {selectedTailor && (
        <Edit
          visible={editModalVisible}
          tailor={selectedTailor}
          onClose={() => setEditModalVisible(false)}
        />
      )}

      {selectedTailor && (
        <PackageModal
          visible={packageVisible}
          tailor={selectedTailor}
          onClose={() => setPackageVisible(false)}
          onSave={handleUpdateTailor}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "white",
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
