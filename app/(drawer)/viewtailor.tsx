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
import Add from "../Models/add";
import Edit from "../Models/Edit";
import PackageModal from "../Models/package";

export default function ViewTailoers() {
  const [tailors, setTailors] = useState<any[]>([
    {
      id: "1",
      Name: "Ali Khan",
      Phone: "03001234567",
      CNIC: "35202-1234567-1",
      Address: "Lahore",
      Role: "Admin",
      Image: "https://via.placeholder.com/100",
      PackageType: "Premium",
      Fee: "2000 PKR",
      TillDate: "31-Dec-2025",
    },
    {
      id: "2",
      Name: "Ahmed Raza",
      Phone: "03007654321",
      CNIC: "35201-7654321-9",
      Address: "Karachi",
      Role: "Tailor",
      Image: "https://via.placeholder.com/100",
      PackageType: "Basic",
      Fee: "1000 PKR",
      TillDate: "15-Jan-2026",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [packageVisible, setPackageVisible] = useState(false);
  const [selectedTailor, setSelectedTailor] = useState<any | null>(null);

  // 🔎 Search state
  const [search, setSearch] = useState("");

  // ✅ Filter by Name, Phone, or CNIC
  const filteredTailors = tailors.filter(
    (t) =>
      t.Name.toLowerCase().includes(search.toLowerCase()) ||
      t.Phone.includes(search) ||
      t.CNIC.includes(search)
  );

  const handleAddTailor = (newTailor: any) => {
    setTailors((prev) => [...prev, { ...newTailor, id: (prev.length + 1).toString() }]);
  };

  const handleUpdateTailor = (updatedTailor: any) => {
    setTailors((prev) =>
      prev.map((t) => (t.id === updatedTailor.id ? updatedTailor : t))
    );
    Alert.alert("Updated", "Tailor updated successfully!");
  };

  const handleDelete = (id: string) => {
    setTailors((prev) => prev.filter((t) => t.id !== id));
    Alert.alert("Deleted", "Tailor deleted successfully!");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>All Tailors</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      {/* 🔎 Search Bar */}
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
              {/* Image */}
              <Image source={{ uri: item.Image }} style={styles.avatar} />

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.name}>
                  {index + 1}. {item.Name}
                </Text>
                <Text style={styles.detail}>📞 {item.Phone}</Text>
                <Text style={styles.detail}>🪪 {item.CNIC}</Text>
                <Text style={styles.detail}>🏠 {item.Address}</Text>

                {/* Badges */}
                <View style={styles.badgeRow}>
                  <Text style={[styles.badge, { backgroundColor: "#2563eb" }]}>
                    {item.PackageType}
                  </Text>
                </View>

                <Text style={styles.detail}>💰 {item.Fee}</Text>
                <Text style={styles.detail}>⏳ {item.TillDate}</Text>
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
      <Add
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTailor}
      />

      {selectedTailor && (
        <Edit
          visible={editModalVisible}
          tailor={selectedTailor}
          onClose={() => setEditModalVisible(false)}
          onUpdate={handleUpdateTailor}
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
  badgeRow: { flexDirection: "row", gap: 8, marginVertical: 4 },
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
