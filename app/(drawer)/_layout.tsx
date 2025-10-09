import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";

export default function Layout() {
  const { currentUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    // await AsyncStorage.removeItem("token");
    // await AsyncStorage.removeItem("user");
    dispatch(logoutUser());
    router.replace("/Login"); // Go back to login
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (



          <DrawerContentScrollView {...props}>
            {/* Header with profile info */}
            <View
              style={{
                padding: 20,
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Image
                source={{ uri: currentUser?.image }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
                {currentUser?.name}
              </Text>
            </View>

              {/* Admin Screens */}
            {currentUser?.role === "Admin" && (
              <>
                <DrawerItem
                  label="Home"
                  icon={({ color, size }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("home")}
                />
                <DrawerItem
                  label="Profile"
                  icon={({ color, size }) => (
                    <Ionicons name="person-circle-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("profile")}
                />
                <DrawerItem
                  label="View Tailors"
                  icon={({ color, size }) => (
                    <Ionicons name="shirt-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("viewtailor")}
                />
                <DrawerItem
                  label="View Customers"
                  icon={({ color, size }) => (
                    <Ionicons name="people-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("viewcustomer")}
                />
                <DrawerItem
                  label="Users"
                  icon={({ color, size }) => (
                    <Ionicons name="shield-checkmark-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("admins")}
                />
                <DrawerItem
                  label="Bookings"
                  icon={({ color, size }) => (
                    <Ionicons name="calendar-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("Bookings")}
                />
              </>
            )}

            {/* Tailor Screens */}
            {currentUser?.role === "Tailor" && (
              <>
                <DrawerItem
                  label="Tailor Home"
                  icon={({ color, size }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("thome")}
                />
                <DrawerItem
                  label="Profile"
                  icon={({ color, size }) => (
                    <Ionicons name="person-circle-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("profile")}
                />
                <DrawerItem
                  label="View Customers"
                  icon={({ color, size }) => (
                    <Ionicons name="people-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("viewcustomer")}
                />
                <DrawerItem
                  label="Bookings"
                  icon={({ color, size }) => (
                    <Ionicons name="calendar-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("Bookings")}
                />
              </>
            )}

            {/* Customer Screens */}
            {currentUser?.role === "Customer" && (
              <>
                <DrawerItem
                  label="Customer Home"
                  icon={({ color, size }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("chome")}
                />
                <DrawerItem
                  label="Profile"
                  icon={({ color, size }) => (
                    <Ionicons name="person-circle-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("profile")}
                />
              </>
            )}

            {/* Common Logout (for all roles) */}
            <DrawerItem
              label="Logout"
              icon={({ color, size }) => (
                <Ionicons name="log-out-outline" size={size} color="red" />
              )}
              labelStyle={{ color: "red" }}
              onPress={handleLogout}
            />
          </DrawerContentScrollView>
        )}





        screenOptions={({ navigation, route }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: "#f4f4f4" },
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
          drawerLabelStyle: { fontSize: 16 },
          drawerStyle: { width: 240 },
          // ✅ Show Hamburger on "home", Back on others
          headerLeft: () =>
            route.name === "home" ? (
              <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 10 }}>
                <Ionicons name="menu" size={26} color="black" />
              </TouchableOpacity>
            ) : (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
  <Ionicons name="arrow-back" size={24} color="black" />
</TouchableOpacity>
            ),
        })}
      >
        <Drawer.Screen name="home" options={{ title: "Dashboard" }} />
        <Drawer.Screen name="profile" options={{ title: "My Profile" }} />
        <Drawer.Screen name="viewtailor" options={{ title: "All Tailors" }} />
        <Drawer.Screen name="viewcustomer" options={{ title: "All Customers" }} />
        <Drawer.Screen name="admins" options={{ title: "All Users" }} />
        <Drawer.Screen name="Bookings" options={{ title: "All Bookings" }} />






        {/* Hidden Screens */}
        <Drawer.Screen
          name="Measurements"
          options={{
            title: "Measurements",
            drawerItemStyle: { display: "none" } // ✅ hide from sidebar
          }}
        />

        <Drawer.Screen
          name="suitbooking"
          options={{ title: "Suit Booking", drawerItemStyle: { display: "none" } }}
        />
      </Drawer>

    </GestureHandlerRootView>
  );
}
