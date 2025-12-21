import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { QuoteResponseDto } from "./types/quote.types";

interface QuoteFormData {
  weight: number;
  length: number;
  width: number;
  height: number;
  originId: string;
  destinationId: string;
}

interface QuoteState {
  currentQuote: QuoteResponseDto | null;
  formData: QuoteFormData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  currentQuote: null,
  formData: null,
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
    setFormData: (state, action: PayloadAction<QuoteFormData>) => {
      state.formData = action.payload;
    },
    clearQuote: (state) => {
      state.currentQuote = null;
      state.formData = null;
      state.error = null;
    },
  },
});

export const {
  quoteStart,
  quoteSuccess,
  quoteFailure,
  setFormData,
  clearQuote,
} = quoteSlice.actions;
export default quoteSlice.reducer;
