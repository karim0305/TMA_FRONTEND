import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
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
                source={{ uri: "https://i.pravatar.cc/100" }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
                John Doe
              </Text>
            </View>

            {/* Drawer Items */}
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
              label="View Admins"
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
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
        })}
      >
        <Drawer.Screen name="home" options={{ title: "Dashboard" }} />
        <Drawer.Screen name="profile" options={{ title: "My Profile" }} />
        <Drawer.Screen name="viewtailor" options={{ title: "All Tailors" }} />
        <Drawer.Screen name="viewcustomer" options={{ title: "All Customers" }} />
        <Drawer.Screen name="admins" options={{ title: "All Admins" }} />
        <Drawer.Screen name="Bookings" options={{ title: "All Bookings" }} />

        {/* Hidden Screens */}
        <Drawer.Screen
          name="Measurements"
          options={{ title: "Measurements", drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="suitbooking"
          options={{ title: "Suit Booking", drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
