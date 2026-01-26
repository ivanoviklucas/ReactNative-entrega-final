import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import colors from "./stylos/colors";
import espaciado from "./stylos/espaciado";
import tipografia from "./stylos/tipografia";

export default function Button({ texto, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={{ width: style?.width || 'auto', flex: style?.flex }}>
      <View style={[styles.botonBase, style]}>
        <Text style={styles.textoBase}>{texto}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botonBase: {
    // Usamos el signo ? para que si tipografia o colors fallan, no se rompa
    backgroundColor: colors?.terciarios?.verdeEsmeralda || "#145A32",
    paddingVertical: espaciado?.sm || 10,
    paddingHorizontal: espaciado?.md || 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBase: {
    color: "#fff",
    fontSize: tipografia?.tamanios?.texto || 16,
    fontWeight: tipografia?.peso?.negrita || "700",
  },
});