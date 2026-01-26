import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native"; // Quitamos Button de react-native
import { useSelector, useDispatch } from "react-redux";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import { llegueATienda, retirePedido, llegueADomicilio, finalizarPedido } from "../store/slice";
import { baseDatosPedido } from "../assets/service/Localdb";

// TUS COMPONENTES E IMPORTACIONES DE ESTILOS
import Button from './Button'; 
import colors from './stylos/colors';
import espaciado from './stylos/espaciado';
import tipografia from './stylos/tipografia';

export default function Pedidos() {
  const pedidoActivo = useSelector(state => state.rider.pedidoActivo);
  const riderStatus = useSelector(state => state.rider.riderStatus);
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  useEffect(() => {
    centrarMapa();
  }, []);

  const centrarMapa = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    let location = await Location.getCurrentPositionAsync({});
    
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  const manejarEstadoPedido = () => {
    if (riderStatus === "En pedido") {
      dispatch(llegueATienda());
      baseDatosPedido.guardar({ ...pedidoActivo, riderStatus: "Llegué a la tienda" });
    } else if (riderStatus === "Llegué a la tienda") {
      dispatch(retirePedido());
      baseDatosPedido.guardar({ ...pedidoActivo, riderStatus: "Pedido retirado" });
    } else if (riderStatus === "Pedido retirado") {
      dispatch(llegueADomicilio());
      baseDatosPedido.guardar({ ...pedidoActivo, riderStatus: "En domicilio del cliente" });
    } else if (riderStatus === "En domicilio del cliente") {
      // Simulación de "Sweet Alert" (Cartel de éxito estilizado de React Native)
      Alert.alert(
        "🎉 ¡Entrega Exitosa!",
        "Has finalizado el pedido. ¡Buen trabajo!",
        [
          { 
            text: "Finalizar Jornada", 
            onPress: () => {
              dispatch(finalizarPedido());
              baseDatosPedido.borrar();
            },
            style: "default"
          }
        ]
      );
    }
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
          </>
        ) : (
          <Text style={styles.empty}>No hay pedidos activos</Text>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={false} // Lo ocultamos porque tenemos nuestro propio botón
          followsUserLocation={true}
        />
      </View>

      <View style={styles.footerAcciones}>
        <Button 
          texto={
            riderStatus === "En pedido" ? "Llegué a la tienda" :
            riderStatus === "Llegué a la tienda" ? "Retirar Pedido" :
            riderStatus === "Pedido retirado" ? "Llegué al domicilio" :
            riderStatus === "En domicilio del cliente" ? "Confirmar Entrega" :
            "Sin Pedido"
          }
          onPress={manejarEstadoPedido}
          style={styles.botonEstado}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors?.primarios?.verdeMuyClaro || "#E8F5E9" 
  },
  pedidoFila: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors?.primarios?.verdeClaro || "#C8E6C9"
  },
  titulo: { 
    fontSize: 18, 
    fontWeight: "700", // "bold" directo para evitar errores de tipografia
    color: colors?.terciarios?.verdeOscuro || "#1B5E20"
  },
  texto: { 
    fontSize: 14, 
    color: "#666" 
  },
  empty: { 
    fontSize: 14, 
    color: "#999", 
    textAlign: "center", 
    width: "100%" 
  },
  mapContainer: { 
    flex: 1 
  },
  map: { 
    width: "100%", 
    height: "100%" 
  },
  footerAcciones: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10
  },
  botonEstado: {
    backgroundColor: colors?.terciarios?.verdeEsmeralda || "#145A32",
    width: "100%",
    height: 50
  },
});