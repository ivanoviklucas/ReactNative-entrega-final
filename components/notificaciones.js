import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGetNotificacionesQuery } from "../assets/service/servicerepartidores";

export default function Notificaciones() {
  const { data: notificacionesData = [], isLoading } =
    useGetNotificacionesQuery();

  const hora = new Date().getHours();
  const esHoraDeCalor = hora >= 12 && hora <= 18;
  const esHoraNocturna = hora >= 23 || hora <= 6;

  // 🧹 limpiar nulls
  const notificaciones = Array.isArray(notificacionesData)
    ? notificacionesData.filter((n) => n)
    : [];

  // 💰 BUSCAR SOLO PAGO
  const notificacionPago = notificaciones.find(
    (n) => n.mensaje?.toLowerCase().includes("pago")
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando notificaciones...</Text>
      </View>
    );
  }

  return (
    <View>
      {/* 💰 NOTIFICACIÓN DE PAGO */}
      {notificacionPago && (
        <View
          style={[
            styles.container,
            notificacionPago.leida
              ? styles.leida
              : styles.noLeida,
          ]}
        >
          <Text style={styles.text}>
            {notificacionPago.mensaje}
          </Text>
          <Text style={styles.estado}>
            {notificacionPago.leida ? "Leída" : "No leída"}
          </Text>
        </View>
      )}

      {/* 🌡️ CALOR */}
      {esHoraDeCalor && (
        <View style={[styles.container, styles.extra]}>
          <Text style={styles.text}>
            Por hora de calor, los pedidos suman $300
          </Text>
        </View>
      )}

      {/* 🌙 NOCTURNA */}
      {esHoraNocturna && (
        <View style={[styles.container, styles.extra]}>
          <Text style={styles.text}>
            Por hora nocturna, los pedidos suman $1000
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  estado: {
    marginTop: 6,
    fontSize: 12,
    fontStyle: "italic",
  },
  leida: {
    backgroundColor: "#e0e0e0",
  },
  noLeida: {
    backgroundColor: "#ffe0b2",
  },
  extra: {
    backgroundColor: "#c8e6c9",
  },
});
