"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// NEW TYPE EXPORT: Add this so your dispatch hook understands your store actions
export type AppDispatch = typeof store.dispatch;
