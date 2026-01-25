import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import { baseDatosPedido, localDB } from '../assets/service/Localdb';
import { 
  inicioBusqueda, 
  cancelarBusqueda, 
  pedidoAceptado, 
  ReasignarPedido 
} from '../store/slice';

import { useGetPedidosQuery } from '../assets/service/servicerepartidores';
import ModalPerfil from './modal'; 

export default function Inicio({ navigation }) {
  const dispatch = useDispatch();
  const usuarioLogueado = useSelector((state) => state.rider.usuarioLogueado);
  const riderStatus = useSelector((state) => state.rider.riderStatus);
  const pedidoActivo = useSelector((state) => state.rider.pedidoActivo); 

  const [modalVisible, setModalVisible] = useState(false);
  const [indicePedido, setIndicePedido] = useState(0);
  const [ubicacion, setUbicacion] = useState(null);

  const { data: pedidosData } = useGetPedidosQuery();
  const pedidos = pedidosData ? Object.values(pedidosData) : [];

  const pedidoActual = 
    riderStatus === "Buscando pedidos..." && pedidos[indicePedido] && !pedidoActivo
      ? pedidos[indicePedido]
      : null;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let localizacion = await Location.getCurrentPositionAsync({});
      setUbicacion({
        latitude: localizacion.coords.latitude,
        longitude: localizacion.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const manejarRechazo = () => {
    if (indicePedido < pedidos.length - 1) {
      setIndicePedido(prev => prev + 1);
      dispatch(ReasignarPedido()); // Esto ya borra el disco ahora
    } else {
      setIndicePedido(0);
      dispatch(cancelarBusqueda());
    }
  };

  if (!usuarioLogueado) return null;

  return (
    <View style={styles.container}>
      {ubicacion ? (
        <MapView 
          style={styles.map} 
          initialRegion={ubicacion}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
        />
      ) : (
        <View style={styles.loadingMap}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando mapa...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.botonPerfilFlotante} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoPerfil}>👤 Perfil</Text>
      </TouchableOpacity>   

      {!pedidoActivo ? (
        <View style={styles.bottomActions}>
          <Text style={styles.userBadge}>Hola, {usuarioLogueado.nombre} 👋</Text>
          {riderStatus === "inactivo" ? (
            <Button title="Conectarse" onPress={() => dispatch(inicioBusqueda())} />
          ) : (
            <Button title="Cancelar Búsqueda" color="red" onPress={() => dispatch(cancelarBusqueda())} />
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.cartelAviso} onPress={() => navigation.navigate("Pedidos")}>
          <Text style={styles.textoAviso}>📍 Tienes un pedido en curso</Text>
          <Text style={styles.subtextoAviso}>Toca aquí para ver los detalles</Text>
        </TouchableOpacity>
      )}

      {pedidoActual && (
        <View style={styles.pedidoCard}>
          <Text style={styles.pedidoTitulo}>¡Pedido Disponible!</Text>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Desde:</Text>
            <Text style={styles.dato}>{pedidoActual.origen?.calle}</Text>
            <Text style={styles.label}>Hasta:</Text>
            <Text style={styles.dato}>{pedidoActual.destino?.calle}</Text>
            <Text style={styles.precio}>${pedidoActual.precio}</Text>
          </View>
          <View style={styles.botonesRow}>
            <Button title="Aceptar" color="#2ecc71" onPress={() => {
              const pedidoParaDisco = { ...pedidoActual, riderStatus: "En pedido" };
              baseDatosPedido.guardar(pedidoParaDisco);
              dispatch(pedidoAceptado(pedidoParaDisco));
            }} />
            <Button title="Rechazar" color="#e74c3c" onPress={manejarRechazo} />
          </View>
        </View>
      )}
      <ModalPerfil visible={modalVisible} setVisible={setModalVisible} usuario={usuarioLogueado} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingMap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botonPerfilFlotante: { position: 'absolute', top: 50, right: 20, backgroundColor: 'white', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, elevation: 5, zIndex: 100 },
  textoPerfil: { fontWeight: 'bold', color: '#333' },
  bottomActions: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 5 },
  cartelAviso: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#34495e', padding: 15, borderRadius: 15, alignItems: 'center', elevation: 10 },
  textoAviso: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  subtextoAviso: { color: '#bdc3c7', fontSize: 12 },
  userBadge: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  pedidoCard: { position: 'absolute', top: 100, left: 20, right: 20, backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 20, borderWidth: 2, borderColor: '#2ecc71' },
  pedidoTitulo: { fontSize: 20, fontWeight: 'bold', color: '#2ecc71', textAlign: 'center' },
  infoBox: { marginVertical: 15 },
  label: { fontSize: 12, color: '#666', fontWeight: 'bold' },
  dato: { fontSize: 16, color: '#333', marginBottom: 5 },
  precio: { fontSize: 20, fontWeight: 'bold', color: '#27ae60' },
  botonesRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});