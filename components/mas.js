import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { ReasignarPedido, cierreSesion } from "../store/slice";
import { localDB, baseDatosPedido } from "../assets/service/Localdb"; // <-- Importamos baseDatosPedido
import Item from "./itemMas.js";
import { useNavigation } from "@react-navigation/native";

export default function Mas() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const manejarCierreSesion = () => {
    // 1. Limpiamos Redux
    dispatch(cierreSesion());
    // 2. Limpiamos TODO el disco (Sesión, Estado y Pedidos)
    localDB.deleteSession();
  };

  const manejarReasignar = () => {
    // 1. Limpiamos el pedido en Redux y lo ponemos en "Buscando..."
    dispatch(ReasignarPedido());
    
    // 2. LA CLAVE: Borramos el pedido del disco duro inmediatamente
    baseDatosPedido.borrar();
    
    // 3. Actualizamos el estado en disco para que sepa que está buscando
    localDB.saveStatus("Buscando pedidos...");
    
    console.log("Pedido reasignado: Disco limpio 🧹");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Cuenta</Text>

      <Item
        icon="swap-horiz"
        text="Reasignar pedido"
        onPress={manejarReasignar} // <-- Usamos la nueva función
      />

      <Item 
        icon="attach-money" 
        text="Ganancias" 
        onPress={() => navigation.navigate("Ganancias")} 
      />

      <Text style={styles.sectionTitle}>Sesión</Text>

      <Item
        icon="logout"
        text="Cerrar sesión"
        onPress={manejarCierreSesion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#06a2d1ff",
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
    textTransform: "uppercase",
  },
});