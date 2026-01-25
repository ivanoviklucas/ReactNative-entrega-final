 import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, database } from "../assets/service/firebaseconfig";

export default function Registrarse({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [zona, setZona] = useState("");

  const handleRegister = async () => {
    if (!nombre || !usuario || !email || !password || !telefono || !vehiculo || !zona) {
      Alert.alert("Error", "Completá todos los campos");
      return;
    }

    try {
      // 1️⃣ Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2️⃣ Traer usuarios existentes para calcular ID corto
      const snapshot = await get(ref(database, "repartidores"));
      const usuariosData = snapshot.val() || {};
      const idsExistentes = Object.values(usuariosData).map(u => u.id);

      // 3️⃣ Buscar primer ID libre del 1 al 1000
      let nuevoId = 1;
      while (idsExistentes.includes(nuevoId) && nuevoId <= 1000) {
        nuevoId++;
      }
      if (nuevoId > 1000) throw new Error("Máximo de usuarios alcanzado");

      // 4️⃣ Guardar datos en RTDB
      await set(ref(database, `repartidores/${uid}`), {
        uid,
        id: nuevoId,
        nombre,
        usuario,
        email,
        activo: true,
        telefono,
        vehiculo,
        zona
      });

      Alert.alert("OK", `Usuario registrado con ID ${nuevoId}`);
      navigation.goBack();

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput placeholder="Nombre" style={styles.input} onChangeText={setNombre} />
      <TextInput placeholder="Usuario" style={styles.input} onChangeText={setUsuario} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Contraseña" style={styles.input} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Teléfono" style={styles.input} onChangeText={setTelefono} />
      <TextInput placeholder="Vehículo" style={styles.input} onChangeText={setVehiculo} />
      <TextInput placeholder="Zona" style={styles.input} onChangeText={setZona} />

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 }
});

