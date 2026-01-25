import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../assets/service/firebaseconfig";
import { ref, get } from "firebase/database";
import { useDispatch } from "react-redux";
import { setUsuarioLogueado } from "../store/slice";
import { localDB } from "../assets/service/Localdb";

export default function Loggin({ navigation }) {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const dispatch = useDispatch();

  const iniciarSesion = async () => {
    if (!email || !contraseña) {
      Alert.alert("Error", "Completá email y contraseña");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), contraseña);
      const uid = userCredential.user.uid;
      
      // Buscamos los datos del repartidor en la base de datos
      const snapshot = await get(ref(database, `repartidores/${uid}`));

      if (!snapshot.exists()) {
        Alert.alert("Error", "Usuario sin datos en la base");
        return;
      }

      const usuarioLogueado = { uid, ...snapshot.val() };

      // 1. Guardamos la sesión en SQLite para que no se cierre al salir de la app 💾
      localDB.saveSession(usuarioLogueado);

      // 2. Actualizamos Redux 🧠
      // Al hacer este dispatch, el estado global cambia. 
      // Como App.js está escuchando, detecta que hay usuario y te manda al Inicio solo.
      dispatch(setUsuarioLogueado(usuarioLogueado));

      // ✅ NOTA: Ya no usamos navigation.reset aquí para evitar choques con App.js

    } catch (error) {
      console.log("Error en login:", error);
      Alert.alert("Error", "Email o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión 🔑</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        value={contraseña} 
        onChangeText={setContraseña} 
        secureTextEntry 
      />
      
      <Button title="Ingresar" onPress={iniciarSesion} />
      
      <View style={{ marginTop: 20 }}>
        <Button 
          title="¿No tienes cuenta? Regístrate" 
          color="#666"
          onPress={() => navigation.navigate("Registrarse")} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20,
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 25, 
    textAlign: "center",
    color: "#333" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8 
  },
});