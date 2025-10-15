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

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace("/Login");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <DrawerContentScrollView {...props}>
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
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {currentUser?.name}
              </Text>
            </View>

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
                    <Ionicons
                      name="person-circle-outline"
                      size={size}
                      color={color}
                    />
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
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={size}
                      color={color}
                    />
                  )}
                  onPress={() => props.navigation.navigate("admins")}
                />
              </>
            )}

            {currentUser?.role === "Tailor" && (
              <>
                <DrawerItem
                  label="Home"
                  icon={({ color, size }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("thome")}
                />
                <DrawerItem
                  label="Profile"
                  icon={({ color, size }) => (
                    <Ionicons
                      name="person-circle-outline"
                      size={size}
                      color={color}
                    />
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
                    <Ionicons
                      name="calendar-outline"
                      size={size}
                      color={color}
                    />
                  )}
                  onPress={() => props.navigation.navigate("Bookings")}
                />
              </>
            )}

            {currentUser?.role === "Customer" && (
              <>
                <DrawerItem
                  label="Home"
                  icon={({ color, size }) => (
                    <Ionicons name="home-outline" size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate("chome")}
                />
                <DrawerItem
                  label="Profile"
                  icon={({ color, size }) => (
                    <Ionicons
                      name="person-circle-outline"
                      size={size}
                      color={color}
                    />
                  )}
                  onPress={() => props.navigation.navigate("profile")}
                />
              </>
            )}

            <View style={{ borderTopWidth: 1, borderTopColor: "#ccc" }}>
              <DrawerItem
                label="Logout"
                icon={({ size }) => (
                  <Ionicons name="log-out-outline" size={size} color="red" />
                )}
                labelStyle={{ color: "red" }}
                onPress={handleLogout}
              />
            </View>
          </DrawerContentScrollView>
        )}
        screenOptions={({ navigation, route }) => {
          console.log("Route name:", route.name); // Debug route name
          return {
            headerShown: true,
            headerStyle: { backgroundColor: "#f4f4f4" },
            headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
            drawerLabelStyle: { fontSize: 16 },
            drawerStyle: { width: 240 },
            headerTitle:
              route.name === "home"
                ? "Admin Dashboard"
                : route.name === "thome"
                ? "Tailor Dashboard"
                : route.name === "chome"
                ? "Customer Dashboard"
                : route.name === "profile"
                ? "My Profile"
                : route.name === "viewtailor"
                ? "All Tailors"
                : route.name === "viewcustomer"
                ? "All Customers"
                : route.name === "admins"
                ? "All Users"
                : route.name === "Bookings"
                ? "All Bookings"
                : "Tailor Management",
            headerLeft: () =>
              ["home", "thome", "chome"].includes(route.name) ? (
                <TouchableOpacity
                  onPress={() => navigation.openDrawer()}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="menu" size={26} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              ),
          };
        }}
      >
        <Drawer.Screen name="home" />
        <Drawer.Screen name="thome" />
        <Drawer.Screen name="chome" />
        <Drawer.Screen name="profile" />
        <Drawer.Screen name="viewtailor" />
        <Drawer.Screen name="viewcustomer" />
        <Drawer.Screen name="admins" />
        <Drawer.Screen name="Bookings" />
        <Drawer.Screen
          name="Measurements"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="suitbooking"
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}