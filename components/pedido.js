import React, { useEffect, useRef } from "react"; // 1. Agregamos useRef y useEffect
import { View, Text, StyleSheet, Button, Alert} from "react-native";
import { useSelector } from "react-redux";
import MapView from "react-native-maps";
import * as Location from "expo-location"; // Asegúrate de tener esta librería
import { useDispatch } from "react-redux";
import { llegueATienda, retirePedido,llegueADomicilio, finalizarPedido} from "../store/slice";
import { baseDatosPedido } from "../assets/service/Localdb";
export default function Pedidos() {
  const pedidoActivo = useSelector(state => state.rider.pedidoActivo);
  const riderStatus  = useSelector(state=> state.rider.riderStatus)
  const dispatch = useDispatch();
  // 2. Creamos la referencia para controlar el mapa manualmente
  const mapRef = useRef(null);

  useEffect(() => {
    centrarMapa();
  }, []);

  const centrarMapa = async () => {
    // Pedimos permiso de ubicación
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    // Obtenemos la ubicación actual
    let location = await Location.getCurrentPositionAsync({});
    
    // 3. Animamos la cámara hacia nuestra posición
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005, // Zoom más cercano para ver calles
      longitudeDelta: 0.005,
    }, 1000); // 1000ms = 1 segundo de animación
  };

  return (
    <View style={styles.container}>
      <View style={styles.pedidoFila}>
        {pedidoActivo ? (
          <>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>Pedido #{pedidoActivo.id}</Text>
              <Text style={styles.texto}>
                {pedidoActivo.origen?.calle} → {pedidoActivo.destino?.calle}
              </Text>
            </View>
            <Button title="Centrar" onPress={centrarMapa} color="#06a2d1" />
          </>
        ) : (
          <Text style={styles.empty}>No hay pedidos activos</Text>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef} // 4. Vinculamos la referencia al mapa
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
        />
      </View>
      <View>
       <Button 
 onPress={() => { 
  if (riderStatus === "En pedido") {
    dispatch(llegueATienda());
    // Guardamos en SQLite: los datos del pedido + el nuevo estado
    baseDatosPedido.guardar({ ...pedidoActivo, riderStatus: "Llegué a la tienda" });

  } else if (riderStatus === "Llegué a la tienda") {
    dispatch(retirePedido());
    baseDatosPedido.guardar({ ...pedidoActivo, riderStatus: "Pedido retirado" });

  } else if (riderStatus === "Pedido retirado") {
    dispatch(llegueADomicilio());
    baseDatosPedido.guardar({ ...pedidoActivo, riderStatus: "En domicilio del cliente" });

  } else if (riderStatus === "En domicilio del cliente") {
    Alert.alert(
      "¡Pedido Finalizado!",
      "Has entregado el pedido con éxito.",
      [
        { 
          text: "OK", 
          onPress: () => {
            dispatch(finalizarPedido());
            baseDatosPedido.borrar(); // Limpiamos el disco al terminar
          }
        }
      ]
    );
  }
}}
  // Lógica interna para decidir qué NOMBRE mostrar en el botón
  title={
    riderStatus === "En pedido" ? "Llegué a la tienda" :
    riderStatus === "Llegué a la tienda" ? "Retirar Pedido" :
    riderStatus === "Pedido retirado" ? "Llegué al domicilio" :
    riderStatus === "En domicilio del cliente" ? "Confirmar Entrega" :
    "Sin Pedido"
  }
  
/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  pedidoFila: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    zIndex: 10,
  },
  titulo: { fontSize: 18, fontWeight: "bold" },
  texto: { fontSize: 14, color: "#666" },
  empty: { fontSize: 14, color: "#999", textAlign: "center", width: "100%" },
  mapContainer: { flex: 1 },
  map: { width: "100%", height: "100%" },
});