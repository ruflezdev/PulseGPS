import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { MaterialIcons } from "@expo/vector-icons";
import { UsuarioGPS, UsuariosData } from "../types/gpsTypes";
import styles from "../styles/mapaScreenStyles";
import LogoPulseGPS from "./LogoPulseGPS";

export default function MapaScreen() {
  const [usuarios, setUsuarios] = useState<UsuariosData | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuariosRef = ref(db, "pulseras");
    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as UsuariosData;
        setUsuarios(data);
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

  useEffect(() => {
    const bateria = usuarioSeleccionado && usuarios ? usuarios[usuarioSeleccionado]?.bateria : undefined;
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
    const indiceActual = usuarioSeleccionado ? usuariosLista.indexOf(usuarioSeleccionado) : -1;
    const siguienteIndice = (indiceActual + 1) % usuariosLista.length;
    setUsuarioSeleccionado(usuariosLista[siguienteIndice]);
  };

  const datosUsuario = usuarioSeleccionado && usuarios ? usuarios[usuarioSeleccionado] : null;

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
      {usuarios && usuarioSeleccionado ? (
        <>
          <View style={{ flex: 1 }}>
            {datosUsuario?.latitud && datosUsuario.longitud ? (
              <MapView
                style={{ flex: 1 }}
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
            <View style={{ width: "100%", alignItems: "center", position: "absolute", bottom: 70, left: 0, right: 0, zIndex: 10 }}>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <MaterialIcons name="battery-charging-full" size={24} color="#3498db" />
                  <Text style={styles.infoText}>
                    Batería: {typeof datosUsuario?.bateria === "number" ? datosUsuario.bateria : "--"}%
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialIcons name="access-time" size={24} color="#3498db" />
                  <Text style={styles.infoText}>
                    Actualizado: {datosUsuario?.timestamp ? new Date(datosUsuario.timestamp).toLocaleTimeString() : "--:--"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.coordsText}>
                    Latitud: {datosUsuario?.latitud?.toFixed(6) || "--.------"}
                  </Text>
                  <Text style={styles.coordsText}>
                    Longitud: {datosUsuario?.longitud?.toFixed(6) || "--.------"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.userSelector} onPress={cambiarUsuario}>
            <MaterialIcons name="watch" size={20} color="#fff" />
            <Text style={styles.userSelectorText}>{usuarioSeleccionado} ▼</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.noDevicesCentered}>
          <MaterialIcons name="devices" size={50} color="#888" />
          <Text style={styles.noDevicesText}>No hay dispositivos conectados</Text>
        </View>
      )}
    </View>
  );
}
