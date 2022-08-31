import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    paddingBottom: 24,
    margin: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  actionButton: {
    height: 42,
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#3828e0",
  },
  actionButtonText: {
    color: "#3828e0",
    fontSize: 16,
  },
  headerButton: {},
  headerButtonText: {
    color: "blue",
  },
});
