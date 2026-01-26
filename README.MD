📦 Proyecto Envios - App de Repartidores
Descripción

Proyecto Envios es una aplicación móvil desarrollada en React Native que permite a los repartidores gestionar pedidos, confirmar entregas y visualizar sus ganancias. La app se conecta a Firebase Realtime Database para sincronizar los datos de usuarios y pedidos en tiempo real, y utiliza SQLite para persistencia local cuando la app se cierra o pierde conexión.

La app se ejecuta con Expo Go, lo que permite probarla en dispositivos móviles sin necesidad de compilarla nativamente.

Funcionalidades

Login de repartidor mediante Firebase Auth

Gestión de pedidos: aceptar, reasignar, completar

Ganancias por usuario, persistentes en SQLite

Persistencia offline de pedidos y ganancias

Historial de pedidos completados con fecha y monto

Estructura del proyecto
proyecto-envios/
├─ assets/
│  ├─ service/        # Archivos de configuración, DB y Firebase
├─ components/        # Componentes de UI: Ganancias, Loggin, MainTab
├─ store/             # Redux slices y store
├─ App.js             # Entrada de la app
├─ package.json

Requisitos

Node.js v16+

Expo CLI (npm install -g expo-cli)

Visual Studio Code

Expo Go en tu celular (iOS o Android)

Conexión a Internet para Firebase

Cómo abrir el proyecto en Visual Studio Code

Clonar el repositorio:

git clone <https://github.com/ivanoviklucas/ReactNative-entrega-final>


Abrir VSCode y seleccionar la carpeta:

proyecto-envios


Instalar dependencias:

npm install


Iniciar Expo:

expo start


Abrir la app en tu celular con Expo Go usando:

Tunnel: funciona aunque no estés en la misma WiFi que la PC.

LAN: más rápido, pero tu celular debe estar en la misma WiFi que la PC.

Uso de la app

Abrí la app en Expo Go.

Ingresá con tu correo y contraseña.

Podés:

Ver pedidos disponibles

Confirmar entregas

Revisar tu historial de pedidos y ganancias

Conexión con Firebase

Base de datos en tiempo real: TU_LINK_REALTIME_DATABASE

Usuarios y autenticación: todos los repartidores registrados están ahí

Link del repositorio

GitHub: TU_REPOSITORIO_DE_GITHUB

Tecnologías utilizadas

React Native

Expo

Redux Toolkit

SQLite (persistencia local)

Firebase Realtime Database

Notas

Cada usuario tiene sus propias ganancias guardadas localmente.

La app está pensada para entender la gestión de pedidos en tiempo real, ideal para principiantes y cursos de desarrollo móvil.