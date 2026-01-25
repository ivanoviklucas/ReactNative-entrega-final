import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

import colors from "./stylos/colors";
import espaciado from "./stylos/espaciado";
import tipografia from "./stylos/tipografia";

export default function Boton({ texto, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.boton}>
        <Text style={styles.texto}>{texto}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    width: "100%",
    backgroundColor: colors.terciarios.verdeEsmeralda,
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
    borderRadius: 8,
    alignItems: "center",
  },

  texto: {
    color: "#fff",
    fontSize: tipografia.tamanios.texto,
    fontWeight: tipografia.peso.negrita,
  },
});
