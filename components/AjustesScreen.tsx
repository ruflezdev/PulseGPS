import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/ajustesScreenStyles";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase/config";
import { ref, set, remove } from "firebase/database";

export default function AjustesScreen({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const auth = getAuth();
  const user = auth.currentUser;

  // Formulario para nueva pulsera
  const [id, setId] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [bateria, setBateria] = useState("");
  const [idEliminar, setIdEliminar] = useState("");

  const agregarPulsera = () => {
    if (!id || !latitud || !longitud || !bateria) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    const pulseraRef = ref(db, `pulseras/${id}`);
    set(pulseraRef, {
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      bateria: parseInt(bateria),
      timestamp: Date.now(),
    })
      .then(() => {
        Alert.alert("Éxito", "Pulsera configurada correctamente");
        setId("");
        setLatitud("");
        setLongitud("");
        setBateria("");
      })
      .catch(() => {
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
      })
      .catch(() => {
        Alert.alert("Error", "No se pudo eliminar la pulsera");
      });
  };

  const cerrarSesion = () => {
    signOut(auth);
    setIsLoggedIn(false);
    Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}>
      <View style={styles.container}>
        {user ? (
          <View style={styles.form}>
            <Text style={styles.text}>Usuario: {user.email}</Text>
            <TouchableOpacity style={styles.button} onPress={cerrarSesion}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.textBold}>No has iniciado sesión</Text>
        )}
        <View style={[styles.form, { marginTop: 24 }]}>
          <Text style={styles.text}>Configurar nueva pulsera:</Text>
          <Text style={styles.text}>Esta area es mero desarrollo, la uso para las pruebas en ventana de mapas</Text>
          <TextInput
            style={styles.input}
            placeholder="ID de pulsera"
            value={id}
            onChangeText={setId}
          />
          <TextInput
            style={styles.input}
            placeholder="Latitud"
            value={latitud}
            onChangeText={setLatitud}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Longitud"
            value={longitud}
            onChangeText={setLongitud}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Batería (%)"
            value={bateria}
            onChangeText={setBateria}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={agregarPulsera}>
            <Text style={styles.buttonText}>Configurar Pulsera</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.form, { marginTop: 24 }]}>
          <Text style={styles.text}>Eliminar pulsera por ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="ID de pulsera a eliminar"
            value={idEliminar}
            onChangeText={setIdEliminar}
          />
          <TouchableOpacity style={styles.button} onPress={eliminarPulsera}>
            <Text style={styles.buttonText}>Eliminar Pulsera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
