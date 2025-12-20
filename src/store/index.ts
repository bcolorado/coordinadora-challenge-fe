import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import quoteReducer from "../features/quote/quoteSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quote: quoteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
