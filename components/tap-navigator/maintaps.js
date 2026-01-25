import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Inicio from "../inicio";
import Pedidos from "../pedido.js";
import Notificaciones from "../notificaciones.js";
import Mas from "../mas";

const Tab = createBottomTabNavigator();

export default function MainTab({ route }) {
  const usuarioLogueado = route.params?.usuarioLogueado;

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        initialParams={{ usuarioLogueado }}
      />
      <Tab.Screen
        name="Pedidos"
        component={Pedidos}
        initialParams={{ usuarioLogueado }}
      />
      <Tab.Screen
        name="Notificaciones"
        component={Notificaciones}
        initialParams={{ usuarioLogueado }}
      />
      <Tab.Screen
        name="Mas"
        component={Mas}
        initialParams={{ usuarioLogueado }}
      />
    </Tab.Navigator>
  );
}
