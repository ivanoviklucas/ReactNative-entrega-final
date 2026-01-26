import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGetNotificacionesQuery } from "../assets/service/servicerepartidores";


import colors from './stylos/colors';


export default function Notificaciones() {
  const { data: notificacionesData = [], isLoading } = useGetNotificacionesQuery();

  const hora = new Date().getHours();
  const esHoraDeCalor = hora >= 12 && hora <= 18;
  const esHoraNocturna = hora >= 23 || hora <= 6;

  const notificaciones = Array.isArray(notificacionesData)
    ? notificacionesData.filter((n) => n)
    : [];

  const notificacionPago = notificaciones.find(
    (n) => n.mensaje?.toLowerCase().includes("pago")
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando notificaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainWrapper}>
      {notificacionPago && (
        <View
          style={[
            styles.container,
            notificacionPago.leida ? styles.leida : styles.noLeida,
          ]}
        >
          <Text style={styles.text}>
            💰 {notificacionPago.mensaje}
          </Text>
          <Text style={styles.estado}>
            {notificacionPago.leida ? "Leída" : "Nueva notificación"}
          </Text>
        </View>
      )}


      {esHoraDeCalor && (
        <View style={[styles.container, styles.extraCalor]}>
          <Text style={styles.textExtra}>
            ☀️ Bono por Calor: +$300 por pedido
          </Text>
        </View>
      )}

      {/* 🌙 NOCTURNA */}
      {esHoraNocturna && (
        <View style={[styles.container, styles.extraNocturna]}>
          <Text style={styles.textExtra}>
            🌙 Bono Nocturno: +$1000 por pedido
          </Text>
        </View>
      )}
      
      {!notificacionPago && !esHoraDeCalor && !esHoraNocturna && (
        <Text style={styles.vacio}>No hay avisos por el momento</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    paddingTop: 10
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center'
  },
  container: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 6,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  textExtra: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1B5E20"
  },
  estado: {
    marginTop: 6,
    fontSize: 12,
    fontStyle: "italic",
    color: "#666"
  },
  leida: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd"
  },
  noLeida: {
    backgroundColor: "#c4ffce", 
    borderLeftWidth: 5,
    borderLeftColor: "#2dfb3e"
  },
  extraCalor: {
    backgroundColor: "#21bb0d",
    borderLeftWidth: 5,
    borderLeftColor: "#0fdde4"
  },
  extraNocturna: {
    backgroundColor: colors?.primarios?.verdeClaro || "#c8e6c9",
    borderLeftWidth: 5,
    borderLeftColor: colors?.terciarios?.verdeEsmeralda || "#2e7d32"
  },
  vacio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20
  }
});