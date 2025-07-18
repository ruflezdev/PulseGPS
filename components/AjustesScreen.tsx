import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, FlatList, StyleSheet } from "react-native"; // FlatList y StyleSheet añadidos
import { MaterialIcons } from "@expo/vector-icons";
import originalStyles from "../styles/ajustesScreenStyles"; // Renombrado para evitar conflicto con los nuevos estilos
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase/config";
import { ref, set, remove, onValue, off } from "firebase/database"; // onValue y off añadidos

// Definimos una interfaz para los datos de la pulsera que esperamos de Firebase
interface PulseraData {
  id: string; // El ID será la clave del objeto en Firebase
  latitud?: number;
  longitud?: number;
  bateria?: number;
  timestamp?: number;
  // Puedes añadir un campo 'nombre' si lo gestionas al agregar la pulsera
  nombre?: string;
}

export default function AjustesScreen({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const auth = getAuth();
  const user = auth.currentUser;

  // Estados para el formulario de nueva pulsera (tu código original)
  const [id, setId] = useState("");
  const [nombrePulseraNueva, setNombrePulseraNueva] = useState(""); // Nuevo campo para el nombre
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [bateria, setBateria] = useState("");
  const [idEliminar, setIdEliminar] = useState("");

  // Estados para la lista de pulseras
  const [listaDePulseras, setListaDePulseras] = useState<PulseraData[]>([]);
  const [pulseraSeleccionadaId, setPulseraSeleccionadaId] = useState<string | null>(null);
  const [cargandoPulseras, setCargandoPulseras] = useState(true);

  // Cargar pulseras desde Firebase Realtime Database
  useEffect(() => {
    const pulserasRef = ref(db, 'pulseras/');
    // Activar el listener para cambios en tiempo real
    const unsubscribe = onValue(pulserasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertir el objeto de Firebase a un array de pulseras
        const pulserasArray: PulseraData[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          nombre: data[key].nombre || `Pulsera ${key}` // Usar nombre guardado o un placeholder
        }));
        setListaDePulseras(pulserasArray);
      } else {
        setListaDePulseras([]);
      }
      setCargandoPulseras(false);
    }, (error) => {
      console.error("Error al cargar pulseras:", error);
      Alert.alert("Error", "No se pudieron cargar las pulseras.");
      setCargandoPulseras(false);
    });

    // Limpiar el listener al desmontar el componente
    return () => off(pulserasRef, 'value', unsubscribe);
  }, []);


  const agregarPulsera = () => {
    if (!id || !nombrePulseraNueva) { // Validar ID y nombre
      Alert.alert("Error", "El ID y el Nombre de la pulsera son obligatorios.");
      return;
    }
    // Validaciones opcionales para latitud, longitud, bateria
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
    const datosPulsera: Partial<PulseraData> & { timestamp: number, nombre: string } = { // Partial porque lat, lon, bat son opcionales aquí
      timestamp: Date.now(),
      nombre: nombrePulseraNueva, // Guardar el nombre
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
          setPulseraSeleccionadaId(null); // Deseleccionar si se elimina la seleccionada
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
    // Aquí podrías guardar el ID en AsyncStorage si quisieras persistir la selección
    // entre sesiones, independientemente de Firebase.
    // O podrías tener un nodo en Firebase bajo el usuario para 'pulseraActiva'.
    console.log("Pulsera seleccionada:", pulseraId);
  };

  const renderItemPulsera = ({ item }: { item: PulseraData }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer, // Usar los nuevos estilos definidos abajo
        item.id === pulseraSeleccionadaId && styles.selectedItem,
      ]}
      onPress={() => handleSeleccionarPulsera(item.id)}
    >
      <MaterialIcons name="watch" size={24} color={item.id === pulseraSeleccionadaId ? "green" : "#555"} style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.nombre || `Pulsera ID: ${item.id}`}</Text>
        <Text style={styles.itemIdText}>ID: {item.id}</Text>
        {/* Podrías mostrar más info si la tienes, como item.bateria o un timestamp formateado */}
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

        {/* Sección para Listar Pulseras */}
        <View style={[originalStyles.form, { marginTop: 24 }]}>
          <Text style={originalStyles.textBold}>Mis Pulseras Registradas</Text>
          {cargandoPulseras ? (
            <Text style={originalStyles.text}>Cargando pulseras...</Text>
          ) : listaDePulseras.length === 0 ? (
            <Text style={originalStyles.text}>No tienes pulseras registradas.</Text>
          ) : (
            <FlatList
              data={listaDePulseras}
              renderItem={renderItemPulsera}
              keyExtractor={(item) => item.id}
              extraData={pulseraSeleccionadaId}
              style={{ maxHeight: 250 }} // Para evitar que la lista ocupe toda la pantalla si es muy larga
            />
          )}
        </View>


        {/* Formulario para nueva pulsera (tu código original, con campo nombre añadido) */}
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
            placeholder="Nombre para la pulsera (ej: Mi Pulsera Principal)"
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

        {/* Eliminar pulsera (tu código original) */}
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

// Nuevos estilos para la lista de pulseras (puedes ajustarlos o integrarlos en tu ajustesScreenStyles.js)
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedItem: {
    borderColor: 'green',
    borderWidth: 2,
    backgroundColor: '#e6ffed',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemIdText: {
    fontSize: 12,
    color: '#777',
  },
});
