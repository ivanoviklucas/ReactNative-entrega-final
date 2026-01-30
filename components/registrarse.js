import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, database } from "../assets/service/firebaseconfig";

import Button from "./Button";
import colors from "./stylos/colors";
import espaciado from "./stylos/espaciado";
import tipografia from "./stylos/tipografia";

export default function Registrarse({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [zona, setZona] = useState("");
  const handleRegister = async () => {
    if (
      !nombre ||
      !usuario ||
      !email ||
      !password ||
      !telefono ||
      !vehiculo ||
      !zona
    ) {
      Alert.alert("Error", "Completá todos los campos");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const uid = userCredential.user.uid;

      const snapshot = await get(ref(database, "repartidores"));
      const usuariosData = snapshot.val() || {};
      const idsExistentes = Object.values(usuariosData).map((u) => u.id);

      let nuevoId = 1;
      while (idsExistentes.includes(nuevoId) && nuevoId <= 1000) {
        nuevoId++;
      }
      if (nuevoId > 1000) throw new Error("Máximo de usuarios alcanzado");

      await set(ref(database, `repartidores/${uid}`), {
        uid,
        id: nuevoId,
        nombre,
        usuario,
        email,
        activo: true,
        telefono,
        vehiculo,
        zona,
      });

      Alert.alert("OK", `Usuario registrado con ID ${nuevoId}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const manejarNombre = (text) => {
    const limpio = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
    setNombre(limpio);
  };
  const manejarUsuario = (text) => {
    const limpio = text.replace(/[^a-zA-Z0-9]/g, "");
    setUsuario(limpio);
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validarContraseña = (Contraseña) => {
    setPassword(Contraseña);

    const regex = /^(?=.*[0-9]).{8,}$/;

    if (regex.test(Contraseña)) {
      setErrorPassword("");
    } else {
      setErrorPassword("Mínimo 8 caracteres y un número");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        placeholder="Nombre"
        style={styles.input}
        onChangeText={manejarNombre}
        value={nombre}
      />
      <TextInput
        placeholder="Usuario"
        style={styles.input}
        onChangeText={manejarUsuario}
        returnKeyType="next"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={validarEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        onChangeText={validarContraseña}
        secureTextEntry
      />
      {errorPassword !== "" && (
        <Text style={styles.errorText}>{errorPassword}</Text>
      )}
      <TextInput
        placeholder="Teléfono"
        style={styles.input}
        onChangeText={setTelefono}
      />
      <TextInput
        placeholder="Vehículo"
        style={styles.input}
        onChangeText={setVehiculo}
      />
      <TextInput
        placeholder="Zona"
        style={styles.input}
        onChangeText={setZona}
      />

      <Button
        texto="Registrarse"
        onPress={handleRegister}
        style={styles.botonRegistro}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espaciado?.lg || 20,
    backgroundColor: colors?.primarios?.verdeMuyClaro || "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: tipografia?.tamanios?.titulo || 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors?.terciarios?.verdeOscuro || "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: colors?.primarios?.verdeClaro || "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  botonRegistro: {
    backgroundColor: colors?.terciarios?.verdeEsmeralda || "#145A32",
    width: "100%",
    marginTop: 10,
  },
});
