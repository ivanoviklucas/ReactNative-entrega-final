import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import colors from './colors';

export default function Boton({ onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: colors.terciarios.verdeEsmeralda,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
// para poder guardarlo