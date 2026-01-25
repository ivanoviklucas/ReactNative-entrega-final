import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Loggin from './components/Loggin.js';
import Inicio from './components/inicio.js';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loggin" component={Loggin} />
        <Stack.Screen name="inicio" component={Inicio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
