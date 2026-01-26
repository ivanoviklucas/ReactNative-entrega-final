import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { localDB } from "../assets/service/Localdb";

// IMPORT DE ESTILOS
import colors from './stylos/colors';
import espaciado from './stylos/espaciado';
import tipografia from './stylos/tipografia';

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
              <Text style={styles.textoId}>ID: #{p.id}</Text>
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
    backgroundColor: colors?.primarios?.verdeMuyClaro || "#F2F2F2",
    padding: espaciado?.md || 15,
  },
  tituloHeader: {
    fontSize: tipografia?.tamanios?.titulo || 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors?.terciarios?.verdeOscuro || "#333"
  },
  tarjetaPedido: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: colors?.primarios?.verdeClaro || "#06a2d1",
    elevation: 3,
  },
  textoId: { 
    fontSize: 12, 
    color: "#666",
    fontWeight: "bold" 
  },
  textoPrecio: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: colors?.terciarios?.verdeEsmeralda || "#27ae60" 
  },
  textoFecha: { 
    fontSize: 12, 
    color: "#999",
    marginTop: 5 
  },
  mensajeVacio: { 
    textAlign: "center", 
    marginTop: 40, 
    color: "#888",
    fontSize: 16 
  },
});