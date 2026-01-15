import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialStoreState {
  error: string;
  loading: boolean;

  // вспомогательный объект
}

const initialState: initialStoreState = {
  error: '',
  loading: true,
};

export const utilitySlice = createSlice({
  name: 'utilities',
  initialState,
  reducers: {
    setUtilityError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    setUtilityLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUtilityError, setUtilityLoading } = utilitySlice.actions;

export const utilitySliceReducer = utilitySlice.reducer;
