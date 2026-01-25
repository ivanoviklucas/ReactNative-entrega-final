import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const repartidoresApi = createApi({
  reducerPath: "repartidoresApi",

  // ✅ NECESARIO
  tagTypes: ["Repartidores", "Pedidos", "Notificaciones"],

  baseQuery: fetchBaseQuery({
    baseUrl: "https://pedidos-coder-default-rtdb.firebaseio.com/",
  }),

  endpoints: (builder) => ({
    getRepartidores: builder.query({
      query: () => "repartidores.json",
      providesTags: ["Repartidores"],
    }),

    getNotificaciones: builder.query({
      query: () => "notificaciones.json",
      providesTags: ["Notificaciones"],
    }),

    getPedidos: builder.query({
      query: () => "pedidos.json",
      providesTags: ["Pedidos"],
    }),
  }),
});

export const {
  useGetRepartidoresQuery,
  useGetNotificacionesQuery,
  useGetPedidosQuery,
} = repartidoresApi;
