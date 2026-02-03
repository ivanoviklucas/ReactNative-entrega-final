import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import colors from './stylos/colors';
import espaciado from './stylos/espaciado';
import tipografia from './stylos/tipografia';

export default function ModalPerfil({ visible, setVisible, usuario }) {
  if (!usuario) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={() => setVisible(false)} />

      <View style={styles.sidebar}>
        <Text style={styles.tituloSidebar}>Perfil del Rider</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.valor}>{usuario.id}</Text>
          
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.valor}>{usuario.nombre}</Text>
          
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.valor}>@{usuario.usuario}</Text>
          
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.valor}>{usuario.telefono}</Text>
          
          <Text style={styles.label}>Vehículo:</Text>
          <Text style={styles.valor}>{usuario.vehiculo}</Text>
          
          <Text style={styles.label}>Patente:</Text>
          <Text style={styles.valor}>{usuario.patente || "N/A"}</Text>
          
          
          <View style={[styles.badge, { backgroundColor: usuario.activo ? "#C8E6C9" : "#FFCDD2" }]}>
             <Text style={{ color: usuario.activo ? "#2E7D32" : "#C62828", fontWeight: "bold" }}>
               {usuario.activo ? "Activo" : "Inactivo"}
             </Text>
          </View>
        </View>

        <Pressable style={styles.botonCerrar} onPress={() => setVisible(false)}>
          <Text style={styles.textoBotonCerrar}>Cerrar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: colors?.primarios?.verdeMuyClaro || "#fff",
    padding: espaciado?.lg || 20,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: colors?.primarios?.verdeClaro || "#eee"
  },
  tituloSidebar: {
    fontSize: tipografia?.tamanios?.titulo || 22,
    fontWeight: "bold",
    color: colors?.terciarios?.verdeOscuro || "#1B5E20",
    marginBottom: 20,
    marginTop: 20,
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
    marginTop: 10,
  },
  valor: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
  },
  botonCerrar: {
    backgroundColor: colors?.terciarios?.verdeEsmeralda || "#145A32",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBotonCerrar: {
    color: "#fff",
    fontWeight: "bold",
  }
});