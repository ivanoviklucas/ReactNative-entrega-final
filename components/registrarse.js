import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, database } from "../assets/service/firebaseconfig";
import { Picker } from "@react-native-picker/picker";
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
  const [patente, setPatente] = useState("");
  const [vehiculo, setVehiculo] = useState("");

  const handleRegister = async () => {
    if (
      !nombre ||
      !usuario ||
      !email ||
      !password ||
      !telefono ||
      !vehiculo ||
      (vehiculo === "moto" && !patente)
    ) {
      Alert.alert("Error", "Completá todos los campos");
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert("Error", "Email inválido");
      return;
    }

    const telefonoError = validarTelefono(telefono);
    if (telefonoError) {
      Alert.alert("Error", telefonoError);
      return;
    }

    if (vehiculo === "moto" && !validarPatente(patente)) {
      Alert.alert("Error", "Patente inválida (formato A123ABC)");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
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
        patente: vehiculo === "moto" ? patente : null,
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

  const validarEmail = (mail) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(mail);
  };

  const validarContraseña = (pass) => {
    setPassword(pass);
    const regex = /^(?=.*[0-9]).{8,}$/;

    if (regex.test(pass)) {
      setErrorPassword("");
    } else {
      setErrorPassword("Mínimo 8 caracteres y un número");
    }
  };

  const validarTelefono = (tel) => {
    const limpio = tel.replace(/\D/g, "");
    setTelefono(limpio);

    if (!limpio) return "El teléfono es obligatorio";
    if (limpio.length !== 10)
      return "El teléfono debe tener exactamente 10 dígitos";

    return null;
  };

  const validarPatente = (pat) => {
    const limpio = pat.toUpperCase();
    setPatente(limpio);

    const regex = /^[A-Z][0-9]{3}[A-Z]{3}$/;
    return regex.test(limpio);
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
        value={usuario}
        returnKeyType="next"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
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
        onChangeText={validarTelefono}
        keyboardType="numeric"
        value={telefono}
      />

      <Text style={styles.label}>Elegí tu vehículo</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={vehiculo}
          onValueChange={(itemValue) => setVehiculo(itemValue)}
        >
          <Picker.Item label="Seleccionar vehículo..." value="" />
          <Picker.Item label="Moto" value="moto" />
          <Picker.Item label="Bicicleta" value="bicicleta" />
        </Picker>
      </View>

      {vehiculo === "moto" && (
        <TextInput
          placeholder="Patente"
          style={styles.input}
          onChangeText={validarPatente}
          value={patente}
          autoCapitalize="characters"
        />
      )}

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
  label: {
    fontSize: tipografia?.tamanios?.texto || 16,
    marginBottom: 5,
    color: colors?.terciarios?.verdeOscuro || "#333",
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors?.primarios?.verdeClaro || "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  botonRegistro: {
    backgroundColor: colors?.terciarios?.verdeEsmeralda || "#145A32",
    width: "100%",
    marginTop: 10,
  },
});
