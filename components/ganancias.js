import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { localDB } from "../assets/service/Localdb";

export default function Ganancias() {
  const pedidosRedux = useSelector((state) => state.rider.pedidosConfirmados);
  const usuario = useSelector((state) => state.rider.usuarioLogueado);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!usuario?.uid) return;

    const guardados = localDB.obtenerGanancias(usuario.uid);

    if (Array.isArray(pedidosRedux) && pedidosRedux.length > 0) {
      pedidosRedux.forEach((pedido) => {
        const existe = guardados.some(
          (p) => p.id === pedido.id && p.fechaEntrega === pedido.fechaEntrega
        );
        if (!existe) {
          localDB.guardarGanancia(usuario.uid, pedido);
          guardados.push(pedido);
        }
      });
    }

    setPedidos(guardados);
  }, [pedidosRedux, usuario]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tituloHeader}>Resumen de Ganancias</Text>
      {pedidos.length === 0 ? (
        <Text style={styles.mensajeVacio}>
          Todavía no tenés pedidos terminados
        </Text>
      ) : (
        pedidos.map((p) => {
          const fecha = new Date(p.fechaEntrega);
          return (
            <View
              key={`${usuario.uid}-${p.id}-${p.fechaEntrega}`}
              style={styles.tarjetaPedido}
            >
              <Text style={styles.textoId}>ID: {p.id}</Text>
              <Text style={styles.textoPrecio}>Precio: ${p.precio}</Text>
              <Text style={styles.textoFecha}>{fecha.toLocaleString()}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 15,
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tarjetaPedido: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#06a2d1",
  },
  textoId: { fontSize: 12, color: "#666" },
  textoPrecio: { fontSize: 18, fontWeight: "bold", color: "#27ae60" },
  textoFecha: { fontSize: 12, color: "#999" },
  mensajeVacio: { textAlign: "center", marginTop: 40, color: "#888" },
});
