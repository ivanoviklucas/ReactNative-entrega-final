import { configureStore } from "@reduxjs/toolkit";
import riderSlice from "./slice";
import { repartidoresApi } from "../assets/service/servicerepartidores";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    rider: riderSlice,
    [repartidoresApi.reducerPath]: repartidoresApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(repartidoresApi.middleware),
});


