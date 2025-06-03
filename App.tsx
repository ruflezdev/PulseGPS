import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";

export default function App() {
  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PulseGPS</Text>
          <View style={styles.userBadge}>
            <Text>👤</Text>
          </View>
        </View>
        
        {/* Mapa Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Mapa aparecerá aquí</Text>
          <View style={styles.markerPin}>
            <Text style={styles.markerText}>📍</Text>
          </View>
        </View>

        {/* Tarjeta de Estado */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Estado de la Pulsera</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Conectado</Text>
          </View>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Batería</Text>
              <Text style={styles.detailValue}>85%</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Última actualización</Text>
              <Text style={styles.detailValue}>
                Hace 2 min
              </Text>
            </View>
          </View>
        </View>

        {/* Botón de acción */}
        <View style={styles.actionButton}>
          <Text style={styles.buttonText}>Actualizar ubicación</Text>
        </View>
      </View>
      <View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 5,
            padding: 50,
            color: "#7F8C8D",
          }}
        >
          © 2025 PulseGPS. Todos los derechos reservados.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  userBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAECEE",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: "#D6DBDF",
    margin: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mapText: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  markerPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  markerText: {
    fontSize: 24,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2ECC71",
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C3E50",
  },
  actionButton: {
    backgroundColor: "#3498DB",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
