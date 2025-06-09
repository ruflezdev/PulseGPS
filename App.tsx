import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ref, get, child } from "firebase/database";
import { db } from "./firebase";

export default function App() {
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<string[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [bateria, setBateria] = useState<number | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>("Cargando...");
  const [loading, setLoading] = useState<boolean>(true);

  const cargarUsuarios = async () => {
    try {
      const pulserasRef = ref(db, "pulseras");
      const snapshot = await get(pulserasRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        setUsuariosDisponibles(keys);
        setUsuarioSeleccionado(keys[0] || null);
      } else {
        setUsuariosDisponibles([]);
        setUsuarioSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const cargarDatos = async () => {
    if (!usuarioSeleccionado) return;
    setLoading(true);
    try {
      const coordsRef = ref(db, `pulseras/${usuarioSeleccionado}`);
      const snapshot = await get(coordsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setLatitud(data.latitud);
        setLongitud(data.longitud);
        setBateria(data.bateria);
        setUltimaActualizacion(new Date(data.timestamp).toLocaleString());
      } else {
        setLatitud(null);
        setLongitud(null);
        setBateria(null);
        setUltimaActualizacion("No hay datos disponibles");
      }
    } catch (error) {
      console.error("Error al leer datos de Firebase:", error);
      setUltimaActualizacion("Error al cargar datos");
    }
    setLoading(false);
  };

  const cambiarUsuario = () => {
    if (!usuarioSeleccionado || usuariosDisponibles.length === 0) return;
    const indexActual = usuariosDisponibles.indexOf(usuarioSeleccionado);
    const siguienteIndex = (indexActual + 1) % usuariosDisponibles.length;
    setUsuarioSeleccionado(usuariosDisponibles[siguienteIndex]);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (usuarioSeleccionado) {
      cargarDatos();
    }
  }, [usuarioSeleccionado]);

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.title}>PulseGPS</Text>
          <View style={styles.userBadge}>
            <Text>👤</Text>
          </View>
        </View>

        {usuariosDisponibles.length > 0 && usuarioSeleccionado ? (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={cambiarUsuario}>
              <Text style={styles.buttonText}>Pulsera: ({usuarioSeleccionado}) — cambiar</Text>
            </TouchableOpacity>

            <View style={styles.mapPlaceholder}>
              {latitud && longitud ? (
                <MapView
                  style={styles.map}
                  region={{
                    latitude: latitud,
                    longitude: longitud,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: latitud, longitude: longitud }}
                    title="Pulsera GPS"
                    description={`Lat: ${latitud.toFixed(5)}, Lon: ${longitud.toFixed(5)}`}
                  />
                </MapView>
              ) : (
                <Text style={styles.mapText}>🗺️ Sin ubicación válida</Text>
              )}
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.cardTitle}>Estado de la Pulsera</Text>

              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusIndicator,
                    bateria !== null && bateria > 20
                      ? { backgroundColor: "#2ECC71" }
                      : { backgroundColor: "#E74C3C" },
                  ]}
                />
                <Text style={styles.statusText}>
                  {bateria !== null && bateria > 20 ? "Conectado" : "Batería baja"}
                </Text>
              </View>

              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Batería</Text>
                  <Text style={styles.detailValue}>{bateria !== null ? `${bateria}%` : "-"}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Última actualización</Text>
                  <Text style={styles.detailValue}>{ultimaActualizacion}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={cargarDatos}>
              <Text style={styles.buttonText}>Actualizar ubicación</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 40, fontSize: 16 }}>
            {loading ? <ActivityIndicator size="large" /> : "No se encontraron pulseras"}
          </Text>
        )}
      </View>

      <View>
        <Text style={{ textAlign: "center", marginTop: 5, padding: 50, color: "#7F8C8D" }}>
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
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  mapText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    paddingTop: 100,
  },
  map: {
    flex: 1,
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
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
