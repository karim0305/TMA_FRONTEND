import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Add from "../Models/add"; // Customer add form
import Edit from "../Models/Edit"; // Customer edit form

export default function ViewCustomers() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([
    {
      id: "1",
      Name: "Muhammad Ali",
      Phone: "03001234567",
      Email: "ali@example.com",
      Address: "Lahore",
      Role: "Customer",
      Image: "https://via.placeholder.com/100",
      Chest: "38",
      Waist: "34",
      Length: "40",
    },
    {
      id: "2",
      Name: "Sara Ahmed",
      Phone: "03123456789",
      Email: "sara@example.com",
      Address: "Karachi",
      Role: "Customer",
      Image: "https://via.placeholder.com/100",
      Chest: "36",
      Waist: "32",
      Length: "38",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // 🔎 Search state
  const [search, setSearch] = useState("");

  // ✅ Filter customers by name, email, or phone
  const filteredCustomers = customers.filter(
    (c) =>
      c.Name.toLowerCase().includes(search.toLowerCase()) ||
      c.Email.toLowerCase().includes(search.toLowerCase()) ||
      c.Phone.includes(search)
  );

  // Add
  const handleAddCustomer = (newCustomer: any) => {
    setCustomers((prev) => [
      ...prev,
      { ...newCustomer, id: (prev.length + 1).toString() },
    ]);
  };

  // Update
  const handleUpdateCustomer = (updatedCustomer: any) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    Alert.alert("Updated", "Customer updated successfully!");
  };

  // Delete
  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    Alert.alert("Deleted", "Customer deleted successfully!");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>All Customers</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* 🔎 Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, email, or phone..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List */}
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
              <Image source={{ uri: item.Image }} style={styles.avatar} />

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.name}>
                  {index + 1}. {item.Name}
                </Text>
                <Text style={styles.detail}>📞 {item.Phone}</Text>
                <Text style={styles.detail}>📧 {item.Email}</Text>
                <Text style={styles.detail}>🏠 {item.Address}</Text>

                {/* Measurements Badges */}
                <View style={styles.badgeRow}>
                  <Text style={[styles.badge, { backgroundColor: "#16a34a" }]}>
                    Chest: {item.Chest}"
                  </Text>
                  <Text style={[styles.badge, { backgroundColor: "#2563eb" }]}>
                    Waist: {item.Waist}"
                  </Text>
                  <Text style={[styles.badge, { backgroundColor: "#9333ea" }]}>
                    Length: {item.Length}"
                  </Text>
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
                  router.push(`/viewmeasurments?id=${item.id}`);
                }}
              >
                <Text style={styles.btnText}>📏 Measure</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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
          onUpdate={handleUpdateCustomer}
        />
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  addBtn: {
    backgroundColor: "black",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 14 },

  // 🔎 Search Input
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
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 4 },
  badge: {
    color: "white",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 6,
  },
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
});
