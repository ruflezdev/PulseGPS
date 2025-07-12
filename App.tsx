import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase/config";
import { MaterialIcons } from "@expo/vector-icons";
import { UsuarioGPS, UsuariosData } from "./types/gpsTypes";
import styles from "./styles/appStyles";
export default function App() {
  const [usuarios, setUsuarios] = useState<UsuariosData | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Obtener y monitorear datos de Firebase
  useEffect(() => {
    const usuariosRef = ref(db, "pulseras");

    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as UsuariosData;
        setUsuarios(data);

        // Seleccionar primer usuario si no hay selección
        if (!usuarioSeleccionado && Object.keys(data).length > 0) {
          setUsuarioSeleccionado(Object.keys(data)[0]);
        }
      } else {
        setUsuarios(null);
        setUsuarioSeleccionado(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Verificar batería baja
  useEffect(() => {
    const bateria =
      usuarioSeleccionado && usuarios
        ? usuarios[usuarioSeleccionado]?.bateria
        : undefined;

    if (usuarioSeleccionado && typeof bateria === "number" && bateria < 20) {
      Alert.alert(
        "Batería Baja",
        `La pulsera ${usuarioSeleccionado} tiene batería baja (${bateria}%)`,
        [{ text: "OK" }]
      );
    }
  }, [usuarioSeleccionado, usuarios]);

  const cambiarUsuario = () => {
    if (!usuarios) return;
    const usuariosLista = Object.keys(usuarios);
    const indiceActual = usuarioSeleccionado
      ? usuariosLista.indexOf(usuarioSeleccionado)
      : -1;
    const siguienteIndice = (indiceActual + 1) % usuariosLista.length;
    setUsuarioSeleccionado(usuariosLista[siguienteIndice]);
  };

  const datosUsuario =
    usuarioSeleccionado && usuarios ? usuarios[usuarioSeleccionado] : null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Conectando con Firebase...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PulseGPS Monitor</Text>
        <MaterialIcons name="gps-fixed" size={24} color="#3498db" />
      </View>

      {usuarios && usuarioSeleccionado ? (
        <>
          {/* Selector de usuario */}
          <TouchableOpacity
            style={styles.userSelector}
            onPress={cambiarUsuario}
          >
            <MaterialIcons name="watch" size={20} color="#fff" />
            <Text style={styles.userSelectorText}>{usuarioSeleccionado} ▼</Text>
          </TouchableOpacity>

          {/* Mapa */}
          <View style={styles.mapContainer}>
            {datosUsuario?.latitud && datosUsuario.longitud ? (
              <MapView
                style={styles.map}
                region={{
                  latitude: datosUsuario.latitud,
                  longitude: datosUsuario.longitud,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                loadingEnabled={true}
              >
                <Marker
                  coordinate={{
                    latitude: datosUsuario.latitud,
                    longitude: datosUsuario.longitud,
                  }}
                  title={`Pulsera ${usuarioSeleccionado}`}
                  description={`Batería: ${datosUsuario.bateria}%`}
                >
                  <View style={styles.marker}>
                    <MaterialIcons
                      name="location-on"
                      size={30}
                      color={datosUsuario.bateria < 20 ? "#e74c3c" : "#2ecc71"}
                    />
                  </View>
                </Marker>
              </MapView>
            ) : (
              <View style={styles.noLocation}>
                <MaterialIcons name="location-off" size={50} color="#95a5a6" />
                <Text style={styles.noLocationText}>Sin señal GPS</Text>
              </View>
            )}
          </View>

          {/* Panel de información */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MaterialIcons
                name="battery-charging-full"
                size={24}
                color="#3498db"
              />
              <Text style={styles.infoText}>
                Batería:{" "}
                {typeof datosUsuario?.bateria === "number"
                  ? datosUsuario.bateria
                  : "--"}
                %
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="access-time" size={24} color="#3498db" />
              <Text style={styles.infoText}>
                Actualizado:{" "}
                {datosUsuario?.timestamp
                  ? new Date(datosUsuario.timestamp).toLocaleTimeString()
                  : "--:--"}
              </Text>
            </View>
          </View>

          {/* Coordenadas */}
          <View style={styles.coordsContainer}>
            <Text style={styles.coordsText}>
              Latitud: {datosUsuario?.latitud?.toFixed(6) || "--.------"}
            </Text>
            <Text style={styles.coordsText}>
              Longitud: {datosUsuario?.longitud?.toFixed(6) || "--.------"}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.noDevicesCentered}>
          <MaterialIcons name="devices-off" size={50} color="#95a5a6" />
          <Text style={styles.noDevicesText}>
            No hay dispositivos conectados
          </Text>
        </View>
      )}
    </View>
  );
}
