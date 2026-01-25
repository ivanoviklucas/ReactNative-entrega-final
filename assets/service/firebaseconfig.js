// 1️⃣ Importa la función para inicializar Firebase
import { initializeApp } from "firebase/app";

// 2️⃣ Importa Auth (sistema de login real)
import { getAuth } from "firebase/auth";

// 3️⃣ Importa Realtime Database
import { getDatabase } from "firebase/database";

// 4️⃣ Configuración REAL de tu proyecto Firebase
// 👉 Esto lo copiaste de Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAmq9vfD0MhYgUbMXQ4tGoUTbL3nR9MZdY",
  authDomain: "pedidos-coder.firebaseapp.com",
  databaseURL: "https://pedidos-coder-default-rtdb.firebaseio.com",
  projectId: "pedidos-coder",
  storageBucket: "pedidos-coder.firebasestorage.app",
  messagingSenderId: "709337737262",
  appId: "1:709337737262:web:f53cae11562506e35fd7bf"
};

// 5️⃣ Inicializa Firebase
const app = initializeApp(firebaseConfig);

// 6️⃣ Inicializa Auth
// 👉 Conecta el sistema de autenticación a tu app
export const auth = getAuth(app);

// 7️⃣ Inicializa Realtime Database
// 👉 Esto permite leer y escribir datos en tu RTDB
export const database = getDatabase(app);
