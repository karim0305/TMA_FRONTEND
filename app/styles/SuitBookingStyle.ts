import { StyleSheet } from "react-native";
export const SuitBookingStyle = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f3f4f6", flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardText: { fontSize: 16, marginBottom: 5 },
  image: {
    width: "100%",
    height: 150,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionBtn: { padding: 10, borderRadius: 8, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "bold" },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontWeight: "bold" },
  btn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#3b82f6",
    marginEnd: 10,
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 14 },
});

export default function StylesPlaceholder() {
  return null;
}
