import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import styles from "../styles/loginStyles";
import LogoPulseGPS from "./LogoPulseGPS";

export default function LoginScreen({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (error: any) {
      Alert.alert("Error", "Usuario o contraseña incorrectos. Solo usuarios creados por el administrador pueden acceder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PulseGPS</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Ingresando..." : "Ingresar"}</Text>
        </TouchableOpacity>

        <Text>{"\n"}NOTA: Para poder registrarte contacta con tu proveedor</Text>
      </View>
    </View>
  );
}
