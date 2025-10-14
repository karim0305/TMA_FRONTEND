import { UserApi } from "@/api/apis";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Add from "../Models/add"; // 👈 Add Admin modal
import Edit from "../Models/Edit"; // 👈 Edit Admin modal
import PackageModal from "../Models/package"; // 👈 Package modal
import { addUser, deleteUser, setUsers, updateUser, User } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import { UserStyle } from "../styles/UserStyle";


export type Admin = {
  id: string;
  Name: string;
  Email: string;
  Phone: string;
  CNIC: string;
  Address: string;
  Role: string;
  Image: string;
};

export default function ViewAdmins() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [packageVisible, setPackageVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const navigation = useNavigation();

  

const dispatch = useDispatch();
const admins = useSelector((state: RootState) => state.users.list);

   useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={UserStyle.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={UserStyle.addBtnText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

    useEffect(() => {
      GetUser();
  
    },[dispatch])
   const GetUser = async () => {
  try {
    const res = await axios.get(UserApi.getUsers);
    const mapped = res.data.map((u: any, index: number) => ({
      id: u._id || index.toString(),
     name: u.name,      // ✅ camelCase
  email: u.email,
  phone: u.phone,
  cnic: u.cnic,
  address: u.address,
  role: u.role,
  image: u.image,
    }));
     dispatch(setUsers(mapped));
    console.log("Mapped Users:", mapped);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

  


  // 

  const [search, setSearch] = useState("");

  const handleAddAdmin = (newAdmin: User) => {
  dispatch(
    addUser({
      ...newAdmin,
      id: Date.now().toString(), // ya UUID generate karo
    })
  );
};

const handleUpdateAdmin = (updatedAdmin: User) => {
  dispatch(updateUser(updatedAdmin));
  // Alert.alert("Updated", "Admin updated successfully!");
};

const handleDelete = async (id: string) => {
  try {
    // 🔥 pehle API call
    await axios.delete(UserApi.deleteUser(id));

    // ✅ agar success to Redux state update
    dispatch(deleteUser(id));

    console.log("User deleted successfully!");
    // Alert.alert("Deleted", "Admin deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
    // Alert.alert("Error", "Failed to delete user");
  }
};


  // ✅ Filtered list based on search input
const filteredAdmins = admins.filter((a) => {
  const query = search?.toLowerCase() || "";
  return (
    a.role?.toLowerCase() === "admin" && (   // ✅ sirf Admins allow
      (a.name?.toLowerCase() || "").includes(query) ||
      (a.email?.toLowerCase() || "").includes(query) ||
      (a.phone || "").includes(search || "")
    )
  );
});



const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "#2563eb"; // blue
    case "tailor":
      return "#16a34a"; // green
    case "customer":
      return "#f59e0b"; // amber/yellow
    default:
      return "#6b7280"; // gray (fallback)
  }
};

  return (
    <View style={UserStyle.container}>
      {/* Header */}
      {/* <View style={UserStyle.headerRow}>
        <Text style={UserStyle.heading}>All Admins</Text>
        <TouchableOpacity
          style={UserStyle.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={UserStyle.addBtnText}>+ Add New</Text>
        </TouchableOpacity>
      </View> */}

      {/* 🔍 Search Bar */}
      <TextInput
        style={UserStyle.searchInput}
        placeholder="Search by name, email, or phone..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List */}
      <FlatList
        data={filteredAdmins}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={UserStyle.card}>
            <View style={UserStyle.row}>
              {/* Image */}
              <Image source={{ uri: item.image }} style={UserStyle.avatar} />

              {/* Info */}
             <View style={UserStyle.info}>
  <Text style={UserStyle.name}>
    {index + 1}. {item.name}
  </Text>

  <View style={UserStyle.rowDetail}>
    <Ionicons name="call-outline" size={16} color="#374151" style={UserStyle.icon} />
    <Text style={UserStyle.detail}>{item.phone}</Text>
  </View>

  <View style={UserStyle.rowDetail}>
    <Ionicons name="id-card-outline" size={16} color="#374151" style={UserStyle.icon} />
    <Text style={UserStyle.detail}>{item.cnic}</Text>
  </View>

  <View style={UserStyle.rowDetail}>
    <Ionicons name="mail-outline" size={16} color="#374151" style={UserStyle.icon} />
    <Text style={UserStyle.detail}>{item.email}</Text>
  </View>

  <View style={UserStyle.rowDetail}>
    <Ionicons name="home-outline" size={16} color="#374151" style={UserStyle.icon} />
    <Text style={UserStyle.detail}>{item.address}</Text>
  </View>

 <View style={[UserStyle.badge, { backgroundColor: getRoleColor(item.role) }]}>
  <Text style={{ color: "white", fontSize: 12 }}>{item.role}</Text>
</View>
</View>
            </View>

            {/* Actions */}
            <View style={UserStyle.actions}>
              <TouchableOpacity
                style={[UserStyle.btn, { backgroundColor: "black" }]}
                onPress={() => {
                  setSelectedAdmin(item);
                  setEditModalVisible(true);
                }}
              >
                <Text style={UserStyle.btnText}>✏️ Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[UserStyle.btn, { backgroundColor: "#ef4444" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={UserStyle.btnText}>🗑 Delete</Text>
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
