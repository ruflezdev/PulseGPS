import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const COLORS = {
  primary: "#0979B0",
  accent: "#3498db",
  background: "#f0f4f8",
  white: "#fff",
  text: "#222",
  textLight: "#444",
  border: "#e0e0e0",
  error: "#e74c3c",
  success: "#2ecc71",
  disabled: "#888",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
  },
  logo: {
    marginTop: height * 0.04,
    marginBottom: 8,
    alignSelf: "center",
    width: 48,
    height: 96,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginBottom: 12,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 8,
    alignSelf: "center",
  },
  textBold: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 8,
    alignSelf: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    width: "100%",
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
