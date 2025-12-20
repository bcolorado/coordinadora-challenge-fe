import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { QuoteResponseDto } from "./types/quote.types";

interface QuoteState {
  currentQuote: QuoteResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  currentQuote: null,
  isLoading: false,
  error: null,
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    quoteStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    quoteSuccess: (state, action: PayloadAction<QuoteResponseDto>) => {
      state.currentQuote = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    quoteFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearQuote: (state) => {
      state.currentQuote = null;
      state.error = null;
    },
  },
});

export const { quoteStart, quoteSuccess, quoteFailure, clearQuote } =
  quoteSlice.actions;
export default quoteSlice.reducer;
