import React, { useState, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";

// Importación de Store y Acciones
import { store } from "./store/store";
import { localDB, baseDatosPedido } from "./assets/service/Localdb";
import { 
  setUsuarioLogueado, 
  pedidoAceptado, 
  inicioBusqueda, 
  cancelarBusqueda 
} from "./store/slice"; 

// Importación de Pantallas
import Loggin from "./components/Loggin";
import Registrarse from "./components/registrarse";
import MainTab from "./components/tap-navigator/maintaps";
import Ganancias from "./components/ganancias";

const Stack = createStackNavigator();

function MainApp() {
  const dispatch = useDispatch();
  const [appLista, setAppLista] = useState(false);

  // Observamos el usuario para la navegación
  const usuarioLogueado = useSelector((state) => state.rider.usuarioLogueado);

  useEffect(() => {
    const inicializarSesion = async () => {
      try {
        // 1. Inicializar DB
        localDB.init(); 

        // 2. Intentar recuperar sesión
        const usuarioGuardado = localDB.getSession();
        
        if (usuarioGuardado) {
          dispatch(setUsuarioLogueado(usuarioGuardado));

          // 3. RECUPERAR ESTADO Y PEDIDO (La clave de la persistencia)
          const pedidoGuardado = baseDatosPedido.obtener();
          const estadoGuardado = localDB.getStatus();

          if (pedidoGuardado && pedidoGuardado.origen) {
            // Caso A: Tenía un pedido activo.
            dispatch(pedidoAceptado(pedidoGuardado));
          } 
          else if (estadoGuardado === "Buscando pedidos...") {
            // Caso B: No tenía pedido, pero estaba conectado buscando.
            dispatch(inicioBusqueda());
          } 
          else {
            // Caso C: Estaba inactivo.
            dispatch(cancelarBusqueda());
          }
        } else {
          // Si no hay usuario, limpiamos todo por seguridad
          localDB.deleteSession();
        }

      } catch (error) {
        console.log("Error al inicializar App:", error);
      } finally {
        setAppLista(true);
      }
    };

    inicializarSesion();
  }, [dispatch]);

  if (!appLista) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {usuarioLogueado ? (
          <>
            <Stack.Screen name="MainTab" component={MainTab} />
            <Stack.Screen name="Ganancias" component={Ganancias}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Loggin" component={Loggin} />
            <Stack.Screen name="Registrarse" component={Registrarse} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}