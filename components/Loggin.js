import React, { useState } from "react";
// SACAMOS 'Button' de acá porque si no, la app no sabe cuál usar y se tilda
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../assets/service/firebaseconfig";
import { ref, get } from "firebase/database";
import { useDispatch } from "react-redux";
import { setUsuarioLogueado } from "../store/slice";
import { localDB } from "../assets/service/Localdb";

// IMPORT DE TUS ESTILOS Y TU COMPONENTE
import Button from './Button'; 
import colors from './stylos/colors';
import espaciado from './stylos/espaciado';
import tipografia from './stylos/tipografia';

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
      const snapshot = await get(ref(database, `repartidores/${uid}`));

      if (!snapshot.exists()) {
        Alert.alert("Error", "Usuario sin datos en la base");
        return;
      }

      const usuarioLogueado = { uid, ...snapshot.val() };
      localDB.saveSession(usuarioLogueado);
      dispatch(setUsuarioLogueado(usuarioLogueado));

    } catch (error) {
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
      
      <Button 
        texto="Ingresar" 
        onPress={iniciarSesion} 
        style={styles.botonIngresar}
      />
      
      <View style={{ marginTop: 20 }}>
        <Button 
          texto="¿No tienes cuenta? Regístrate" 
          onPress={() => navigation.navigate("Registrarse")} 
          style={styles.botonRegistro}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: espaciado?.lg || 20,
    backgroundColor: colors?.primarios?.verdeMuyClaro || "#fff" 
  },
  title: { 
    fontSize: tipografia?.tamanios?.titulo || 24, 
    fontWeight: "bold", 
    marginBottom: 25, 
    textAlign: "center",
    color: colors?.terciarios?.verdeOscuro || "#333" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: colors?.primarios?.verdeClaro || "#ccc", 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8,
    backgroundColor: "#fff"
  },
  botonIngresar: {
    backgroundColor: colors?.terciarios?.verdeEsmeralda || "#145A32",
    width: "100%"
  },
  botonRegistro: {
    backgroundColor: "#666",
    width: "100%"
  }
});