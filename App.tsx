import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ref, get } from "firebase/database";
import { db } from "./firebase";

const usuariosDisponibles = ["usuario1", "usuario2", "usuario3", "usuario4"];

export default function App() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(usuariosDisponibles[0]);
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [bateria, setBateria] = useState<number | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>("Cargando...");

  // Función para cargar datos desde Firebase según el usuario seleccionado
  const cargarDatos = () => {
    const coordsRef = ref(db, `pulseras/${usuarioSeleccionado}`);

    get(coordsRef)
      .then((snapshot) => {
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
      })
      .catch((error) => {
        console.error("Error al leer datos de Firebase:", error);
        setUltimaActualizacion("Error al cargar datos");
      });
  };

  useEffect(() => {
    cargarDatos();
  }, [usuarioSeleccionado]);

  // Cambiar usuario seleccionado al pulsar botón
  const cambiarUsuario = () => {
    const indexActual = usuariosDisponibles.indexOf(usuarioSeleccionado);
    const siguienteIndex = (indexActual + 1) % usuariosDisponibles.length;
    setUsuarioSeleccionado(usuariosDisponibles[siguienteIndex]);
  };

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

        {/* Botón para seleccionar pulsera */}
        <TouchableOpacity style={styles.actionButton} onPress={cambiarUsuario}>
          <Text style={styles.buttonText}>Preciona para la siguiente: r({usuarioSeleccionado})</Text>
        </TouchableOpacity>

        {/* Mapa */}
        <View style={styles.mapPlaceholder}>
          {latitud && longitud ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: latitud,
                longitude: longitud,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
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
            <Text style={styles.mapText}>🗺️ Mapa aparecerá aquí</Text>
          )}
        </View>

        {/* Tarjeta de Estado */}
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

        {/* Botón para actualizar datos manualmente */}
        <TouchableOpacity style={styles.actionButton} onPress={cargarDatos}>
          <Text style={styles.buttonText}>Actualizar ubicación</Text>
        </TouchableOpacity>
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
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
