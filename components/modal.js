import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

export default function ModalPerfil({ visible, setVisible, usuario }) {
  if (!usuario) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={() => setVisible(false)} />

      <View style={styles.sidebar}>
        <Text>ID: {usuario.id}</Text>
        <Text>Nombre: {usuario.nombre}</Text>
        <Text>Usuario: {usuario.usuario}</Text>
        <Text>Teléfono: {usuario.telefono}</Text>
        <Text>Vehículo: {usuario.vehiculo}</Text>
        <Text>Patente: {usuario.patente}</Text>
        <Text>Zona: {usuario.zona}</Text>
        <Text>Estado: {usuario.activo ? "Activo" : "Inactivo"}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#fff",
    padding: 20,
  },
});

