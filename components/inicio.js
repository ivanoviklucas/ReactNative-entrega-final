import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { baseDatosPedido } from "../assets/service/Localdb";
import {
  inicioBusqueda,
  cancelarBusqueda,
  pedidoAceptado,
  ReasignarPedido,
} from "../store/slice";
import { useGetPedidosQuery } from "../assets/service/servicerepartidores";
import ModalPerfil from "./modal";
import Button from "./Button";
import colors from "./stylos/colors";
import espaciado from "./stylos/espaciado";
import tipografia from "./stylos/tipografia";

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
    riderStatus === "Buscando pedidos..." &&
    pedidos[indicePedido] &&
    !pedidoActivo
      ? pedidos[indicePedido]
      : null;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
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
      setIndicePedido((prev) => prev + 1);
      dispatch(ReasignarPedido());
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
          style={{ flex: 1 }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapPadding={{
            top: 30,
            right: 320,
            bottom: 500,
            left: 0,
          }}
        ></MapView>
      ) : (
        <View style={styles.loadingMap}>
          <ActivityIndicator
            size="large"
            color={colors.secundarios.verdeHoja}
          />
          <Text style={{ marginTop: espaciado.sm }}>Cargando mapa...</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.botonPerfilFlotante}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textoPerfil}>👤 Perfil</Text>
      </TouchableOpacity>

      {!pedidoActivo ? (
        <View style={styles.bottomActions}>
          <Text style={styles.userBadge}>
            Hola, {usuarioLogueado.nombre} 👋
          </Text>
          {riderStatus === "inactivo" ? (
            <Button
              texto="Conectarse"
              onPress={() => dispatch(inicioBusqueda())}
              style={styles.botonConectarse}
            />
          ) : (
            <Button
              texto="Cancelar Búsqueda"
              onPress={() => dispatch(cancelarBusqueda())}
              style={styles.botonCancelar}
            />
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.cartelAviso}
          onPress={() => navigation.navigate("Pedidos")}
        >
          <Text style={styles.textoAviso}>📍 Tienes un pedido en curso</Text>
          <Text style={styles.subtextoAviso}>
            Toca aquí para ver los detalles
          </Text>
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
            <Button
              texto="Aceptar"
              onPress={() => {
                const pedidoParaDisco = {
                  ...pedidoActual,
                  riderStatus: "En pedido",
                };
                baseDatosPedido.guardar(pedidoParaDisco);
                dispatch(pedidoAceptado(pedidoParaDisco));
              }}
              style={styles.botonAceptar}
            />
            <Button
              texto="Rechazar"
              onPress={manejarRechazo}
              style={styles.botonRechazar}
            />
          </View>
        </View>
      )}

      <ModalPerfil
        visible={modalVisible}
        setVisible={setModalVisible}
        usuario={usuarioLogueado}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingMap: { flex: 1, justifyContent: "center", alignItems: "center" },
  botonPerfilFlotante: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: colors.primarios.verdeMuyClaro,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 5,
    zIndex: 100,
    marginTop: 30,
  },
  textoPerfil: {
    fontWeight: tipografia.peso.negrita,
    color: colors.terciarios.verdeOscuro,
  },
  bottomActions: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primarios.verdeMuyClaro,
    padding: espaciado.md,
    borderRadius: 15,
    elevation: 5,
  },
  cartelAviso: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: colors.secundarios.verdeBosque,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 10,
  },
  textoAviso: {
    color: "#fff",
    fontWeight: tipografia.peso.negrita,
  },
  subtextoAviso: {
    color: "#eee",
    fontSize: tipografia.tamanios.chico,
  },
  userBadge: {
    fontSize: tipografia.tamanios.subtitulo,
    fontWeight: tipografia.peso.negrita,
    marginBottom: 10,
    textAlign: "center",
  },
  pedidoCard: {
    position: "absolute",
    top: 140,
    alignSelf: "center",
    width: "85%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    elevation: 20,
    borderWidth: 2,
    borderColor: colors.primarios.verdePrimavera,
    zIndex: 200,
  },
  pedidoTitulo: {
    fontSize: tipografia.tamanios.titulo,
    fontWeight: tipografia.peso.negrita,
    color: colors.secundarios.verdeMedio,
    textAlign: "center",
  },
  infoBox: { marginVertical: 15 },
  label: {
    fontSize: tipografia.tamanios.chico,
    color: "#666",
    fontWeight: tipografia.peso.negrita,
  },
  dato: {
    fontSize: tipografia.tamanios.texto,
    color: "#333",
    marginBottom: 5,
  },
  precio: {
    fontSize: tipografia.tamanios.subtitulo,
    fontWeight: tipografia.peso.negrita,
    color: colors.secundarios.verdeMedio,
  },
  botonesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  botonConectarse: {
    backgroundColor: colors.terciarios.verdeEsmeralda,
    width: "100%",
  },
  botonAceptar: {
    backgroundColor: colors.primarios.verdePrimavera,
    flex: 1,
    marginRight: 5,
    minHeight: 45,
  },
  botonRechazar: {
    backgroundColor: colors.secundarios.verdeHoja,
    flex: 1,
    marginLeft: 5,
    minHeight: 45,
  },
  botonCancelar: {
    backgroundColor: colors.secundarios.verdeHoja,
    width: "100%",
  },
});
