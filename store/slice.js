import { createSlice } from "@reduxjs/toolkit";
import { localDB, baseDatosPedido } from "../assets/service/Localdb";

const initialState = {
  riderStatus: "inactivo",
  pedidoActivo: null,
  usuarioLogueado: null,
  pedidosConfirmados: [],
};

export const riderSlice = createSlice({
  name: "rider",
  initialState,
  reducers: {
    inicioBusqueda: (state) => {
      state.riderStatus = "Buscando pedidos...";
      localDB.saveStatus("Buscando pedidos..."); // Persistimos el estado
    },

    cancelarBusqueda: (state) => {
      state.riderStatus = "inactivo";
      localDB.saveStatus("inactivo"); // Persistimos el estado
    },

    pedidoAceptado: (state, action) => {
      state.pedidoActivo = action.payload;
      state.riderStatus = action.payload.riderStatus || "En pedido";
      localDB.saveStatus(state.riderStatus); // Persistimos el estado
    },

    finalizarPedido: (state) => {
      if (!state.pedidoActivo) return;
      const pedidoConfirmado = {
        ...state.pedidoActivo,
        estado: "CONFIRMADO",
        confirmado: true,
        fechaEntrega: Date.now(),
      };
      state.pedidosConfirmados.push(pedidoConfirmado);
      
      // Limpiamos todo
      state.pedidoActivo = null;
      state.riderStatus = "inactivo";
      
      // Limpiamos disco
      localDB.saveStatus("inactivo");
      baseDatosPedido.borrar();
    },

    setUsuarioLogueado: (state, action) => {
      state.usuarioLogueado = action.payload;
    },

    cierreSesion: (state) => {
      state.usuarioLogueado = null;
      state.riderStatus = "inactivo";
      state.pedidoActivo = null;
      state.pedidosConfirmados = [];
      localDB.deleteSession(); // Limpia todo el SQLite
    },

    // Actualizan el estado de navegación del pedido
    llegueATienda: (state) => { 
      state.riderStatus = "Llegué a la tienda";
      localDB.saveStatus(state.riderStatus);
    },
    retirePedido: (state) => { 
      state.riderStatus = "Pedido retirado";
      localDB.saveStatus(state.riderStatus);
    },
    llegueADomicilio: (state) => { 
      state.riderStatus = "En domicilio del cliente";
      localDB.saveStatus(state.riderStatus);
    },
    ReasignarPedido: (state) => {
      state.pedidoActivo = null;
      state.riderStatus = "Buscando pedidos...";
      localDB.saveStatus("Buscando pedidos...");
    },
  },
});

export const {
  inicioBusqueda,
  pedidoAceptado,
  llegueATienda,
  retirePedido,
  llegueADomicilio,
  cancelarBusqueda,
  ReasignarPedido,
  finalizarPedido,
  setUsuarioLogueado,
  cierreSesion,
} = riderSlice.actions;

export default riderSlice.reducer;