import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#7f8c8d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  userSelector: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  userSelectorText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  mapContainer: {
    height: Dimensions.get("window").height * 0.4,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ecf0f1",
  },
  map: {
    flex: 1,
  },
  noLocation: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noLocationText: {
    marginTop: 10,
    color: "#7f8c8d",
    fontSize: 16,
  },
  marker: {
    alignItems: "center",
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#2c3e50",
  },
  coordsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  coordsText: {
    fontSize: 16,
    color: "#34495e",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  noDevices: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDevicesCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
  },
  noDevicesText: {
    marginTop: 16,
    fontSize: 18,
    color: "#7f8c8d",
  },
});

export default styles;