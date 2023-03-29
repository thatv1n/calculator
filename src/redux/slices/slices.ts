import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SlicesTypes } from "./slices.types";

const initialState: SlicesTypes = {
  equation: '',
  switcherType: 1,
  usedElements: [],
};

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setUsedElements: (state, action: PayloadAction<string>) => {
      state.usedElements = [...state.usedElements, action.payload]
    },
    removeUsedElement: (state, action: PayloadAction<string[]>) => {
      state.usedElements = action.payload
    },

    setSwitcherType: (state, action: PayloadAction<number>) => {
      state.switcherType = action.payload
    },
    setEquation: (state, action: PayloadAction<string>) => {
      state.equation += action.payload;
    },
    setSolution: (state, action: PayloadAction<string>) => {
      state.equation = action.payload;
    },
    resetDisplay: (state, action: PayloadAction<string>) => {
      state.equation = '';
    },
  },
})

export const { setUsedElements, removeUsedElement, setEquation, setSwitcherType, setSolution, resetDisplay } = calculatorSlice.actions


export default calculatorSlice.reducer;