import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f2",
  },

  card: {
    width: "90%",              // responsive width
    maxWidth: 400,             // good for web
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,              // Android shadow
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },

  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    color: "#000",
  },

  button: {
    width: "100%",
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  linkText: {
    color: "black",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "90%",
    padding: 20,
    borderRadius: 12,
  },

  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
