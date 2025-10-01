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
import Add from "../Models/add"; // 👈 Add Admin modal
import Edit from "../Models/Edit"; // 👈 Edit Admin modal
import PackageModal from "../Models/package"; // 👈 Package modal

export default function ViewAdmins() {
  const [admins, setAdmins] = useState<any[]>([
    {
      id: "1",
      Name: "Momin Karim",
      Phone: "03001234567",
      CNIC: "35202-1234567-1",
      Email: "momin@example.com",
      Address: "Lahore",
      Role: "Super Admin",
      Image: "https://via.placeholder.com/100",
    },
    {
      id: "2",
      Name: "Sara Ahmed",
      Phone: "03007654321",
      CNIC: "35201-7654321-9",
      Email: "sara@example.com",
      Address: "Karachi",
      Role: "Admin",
      Image: "https://via.placeholder.com/100",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [packageVisible, setPackageVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);

  const [search, setSearch] = useState("");

  const handleAddAdmin = (newAdmin: any) => {
    setAdmins((prev) => [
      ...prev,
      { ...newAdmin, id: (prev.length + 1).toString() },
    ]);
  };

  const handleUpdateAdmin = (updatedAdmin: any) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a))
    );
    Alert.alert("Updated", "Admin updated successfully!");
  };

  const handleDelete = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    Alert.alert("Deleted", "Admin deleted successfully!");
  };

  // ✅ Filtered list based on search input
  const filteredAdmins = admins.filter(
    (a) =>
      a.Name.toLowerCase().includes(search.toLowerCase()) ||
      a.Email.toLowerCase().includes(search.toLowerCase()) ||
      a.Phone.includes(search)
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>All Admins</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add Admin</Text>
        </TouchableOpacity>
      </View>

      {/* 🔍 Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, email, or phone..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List */}
      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item.id}
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
                <Text style={styles.detail}>🪪 {item.CNIC}</Text>
                <Text style={styles.detail}>✉️ {item.Email}</Text>
                <Text style={styles.detail}>🏠 {item.Address}</Text>
                <Text style={[styles.badge, { backgroundColor: "#2563eb" }]}>
                  {item.Role}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "black" }]}
                onPress={() => {
                  setSelectedAdmin(item);
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
            </View>
          </View>
        )}
      />

      {/* Modals */}
      <Add
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddAdmin}
      />

      {selectedAdmin && (
        <Edit
          visible={editModalVisible}
          tailor={selectedAdmin} // 👈 still generic
          onClose={() => setEditModalVisible(false)}
          onUpdate={handleUpdateAdmin}
        />
      )}

      {selectedAdmin && (
        <PackageModal
          visible={packageVisible}
          tailor={selectedAdmin}
          onClose={() => setPackageVisible(false)}
          onSave={handleUpdateAdmin}
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
    marginBottom: 14,
  },
  heading: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  addBtn: {
    backgroundColor: "black",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: "white", fontWeight: "600", fontSize: 14 },

  // ✅ Search bar style
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
  badge: {
    color: "white",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
    alignSelf: "flex-start",
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
