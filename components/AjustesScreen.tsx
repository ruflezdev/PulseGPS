import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import originalStyles from "../styles/ajustesScreenStyles";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase/config";
import { ref, set, remove, onValue, off } from "firebase/database";

interface PulseraData {
  id: string;
  latitud?: number;
  longitud?: number;
  bateria?: number;
  timestamp?: number;
  nombre?: string;
}

export default function AjustesScreen({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const auth = getAuth();
  const user = auth.currentUser;

  const [id, setId] = useState("");
  const [nombrePulseraNueva, setNombrePulseraNueva] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [bateria, setBateria] = useState("");
  const [idEliminar, setIdEliminar] = useState("");
  const [listaDePulseras, setListaDePulseras] = useState<PulseraData[]>([]);
  const [pulseraSeleccionadaId, setPulseraSeleccionadaId] = useState<string | null>(null);
  const [cargandoPulseras, setCargandoPulseras] = useState(true);

  useEffect(() => {
    const pulserasRef = ref(db, "pulseras/");
    const unsubscribe = onValue(
      pulserasRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const pulserasArray: PulseraData[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            nombre: data[key].nombre || `Pulsera ${key}`,
          }));
          setListaDePulseras(pulserasArray);
        } else {
          setListaDePulseras([]);
        }
        setCargandoPulseras(false);
      },
      (error) => {
        console.error("Error al cargar pulseras:", error);
        Alert.alert("Error", "No se pudieron cargar las pulseras.");
        setCargandoPulseras(false);
      }
    );

    return () => off(pulserasRef, "value", unsubscribe);
  }, []);

  const agregarPulsera = () => {
    if (!id || !nombrePulseraNueva) {
      Alert.alert("Error", "El ID y el Nombre de la pulsera son obligatorios.");
      return;
    }
    if (latitud && isNaN(parseFloat(latitud))) {
      Alert.alert("Error", "La latitud debe ser un número.");
      return;
    }
    if (longitud && isNaN(parseFloat(longitud))) {
      Alert.alert("Error", "La longitud debe ser un número.");
      return;
    }
    if (bateria && isNaN(parseInt(bateria))) {
      Alert.alert("Error", "La batería debe ser un número entero.");
      return;
    }

    const pulseraRef = ref(db, `pulseras/${id}`);
    const datosPulsera: Partial<PulseraData> & { timestamp: number; nombre: string } = {
      timestamp: Date.now(),
      nombre: nombrePulseraNueva,
    };

    if (latitud) datosPulsera.latitud = parseFloat(latitud);
    if (longitud) datosPulsera.longitud = parseFloat(longitud);
    if (bateria) datosPulsera.bateria = parseInt(bateria);

    set(pulseraRef, datosPulsera)
      .then(() => {
        Alert.alert("Éxito", "Pulsera configurada correctamente");
        setId("");
        setNombrePulseraNueva("");
        setLatitud("");
        setLongitud("");
        setBateria("");
      })
      .catch((error) => {
        console.error("Error al agregar pulsera:", error);
        Alert.alert("Error", "No se pudo configurar la pulsera");
      });
  };

  const eliminarPulsera = () => {
    if (!idEliminar) {
      Alert.alert("Error", "Ingresa el ID de la pulsera a eliminar");
      return;
    }
    const pulseraRef = ref(db, `pulseras/${idEliminar}`);
    remove(pulseraRef)
      .then(() => {
        Alert.alert("Éxito", "Pulsera eliminada correctamente");
        setIdEliminar("");
        if (pulseraSeleccionadaId === idEliminar) {
          setPulseraSeleccionadaId(null);
        }
      })
      .catch((error) => {
        console.error("Error al eliminar pulsera:", error);
        Alert.alert("Error", "No se pudo eliminar la pulsera");
      });
  };

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
        Alert.alert("Error", "No se pudo cerrar la sesión.");
      });
  };

  const handleSeleccionarPulsera = (pulseraId: string) => {
    setPulseraSeleccionadaId(pulseraId);
    console.log("Pulsera seleccionada:", pulseraId);
  };

  const renderItemPulsera = ({ item }: { item: PulseraData }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        item.id === pulseraSeleccionadaId && styles.selectedItem,
      ]}
      onPress={() => handleSeleccionarPulsera(item.id)}
    >
      <MaterialIcons
        name="watch"
        size={24}
        color={item.id === pulseraSeleccionadaId ? "green" : "#555"}
        style={styles.itemIcon}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.nombre || `Pulsera ID: ${item.id}`}</Text>
        <Text style={styles.itemIdText}>ID: {item.id}</Text>
      </View>
      {item.id === pulseraSeleccionadaId && (
        <MaterialIcons name="check-circle" size={24} color="green" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1, backgroundColor: originalStyles.container.backgroundColor }}>
      <View style={originalStyles.container}>
        {user ? (
          <View style={originalStyles.form}>
            <Text style={originalStyles.text}>Usuario: {user.email}</Text>
            <TouchableOpacity style={originalStyles.button} onPress={cerrarSesion}>
              <Text style={originalStyles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={originalStyles.textBold}>No has iniciado sesión</Text>
        )}

        {pulseraSeleccionadaId && (
          <View style={styles.card}>
            <Text style={styles.textBold}>Pulsera activa:</Text>
            <Text style={styles.text}>{pulseraSeleccionadaId}</Text>
          </View>
        )}

        <View style={[originalStyles.form, { marginTop: 24 }]}>
          <Text style={originalStyles.textBold}>Configurar / Añadir Nueva Pulsera:</Text>
          <Text style={originalStyles.text}>
            (El ID debe ser único. Los demás campos son para pruebas de mapa)
          </Text>
          <TextInput
            style={originalStyles.input}
            placeholder="ID de pulsera (ej: PULS001)"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
          />
          <TextInput
            style={originalStyles.input}
            placeholder="Nombre para la pulsera"
            value={nombrePulseraNueva}
            onChangeText={setNombrePulseraNueva}
          />
          <TextInput
            style={originalStyles.input}
            placeholder="Latitud (opcional)"
            value={latitud}
            onChangeText={setLatitud}
            keyboardType="numeric"
          />
          <TextInput
            style={originalStyles.input}
            placeholder="Longitud (opcional)"
            value={longitud}
            onChangeText={setLongitud}
            keyboardType="numeric"
          />
          <TextInput
            style={originalStyles.input}
            placeholder="Batería (%) (opcional)"
            value={bateria}
            onChangeText={setBateria}
            keyboardType="numeric"
          />
          <TouchableOpacity style={originalStyles.button} onPress={agregarPulsera}>
            <Text style={originalStyles.buttonText}>Guardar Pulsera</Text>
          </TouchableOpacity>
        </View>

        <View style={[originalStyles.form, { marginTop: 24, marginBottom: 20 }]}>
          <Text style={originalStyles.textBold}>Eliminar pulsera por ID:</Text>
          <TextInput
            style={originalStyles.input}
            placeholder="ID de pulsera a eliminar"
            value={idEliminar}
            onChangeText={setIdEliminar}
            autoCapitalize="none"
          />
          <TouchableOpacity style={originalStyles.button} onPress={eliminarPulsera}>
            <Text style={originalStyles.buttonText}>Eliminar Pulsera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: "#d0f0c0",
  },
  itemIcon: {
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemIdText: {
    color: "#555",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  textBold: {
    fontWeight: "bold",
  },
  text: {
    color: "#333",
  },
});
