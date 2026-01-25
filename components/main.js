import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, StyleSheet, Dimensions, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import colors from "./colors";
import Boton from "./Button";
import { repartidores } from "../assets/data/data";

const { height: screenHeight } = Dimensions.get("window");

export default function Loggin() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");

  function ValidarUsuario() {
    const usuarioLogueado = repartidores.find((u) => u.usuario === usuario);

    if (!usuarioLogueado) {
      Alert.alert("Error", "Usted debe registrarse");
    } 
    else if (contraseña === usuario) {
      navigation.navigate("CuerpoDeAPP", { usuarioLogueado });
    } 
    else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  }

  return (
    <View style={[styles.container, { height: screenHeight }]}>
      <View style={styles.header}>
        <Text style={styles.TituloPrincipal}>Bienvenido a mi App</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.subTitulo}>Ingresa a tu cuenta</Text>

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          onChangeText={(texto) => setUsuario(texto)}
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#555"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          onChangeText={(texto) => setContraseña(texto)}
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#555"
          secureTextEntry={true}
        />

        <Boton onPress={ValidarUsuario} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.primarios.verdePrimavera,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 40,
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: colors.primarios.verdeSuave,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 60,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: "80%",
    maxWidth: 350,
    alignSelf: "center",
  },
  TituloPrincipal: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#003049",
    textAlign: "center",
  },
  subTitulo: {
    fontSize: 20,
    fontWeight: "500",
    color: "#003049",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#222",
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    height: 50,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
});
