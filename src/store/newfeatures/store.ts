import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { courseSliceReducer } from './features/courseSlice';
import { authSliceSliceReducer } from './features/authSlice';
import { utilitySliceReducer } from './features/utilitySlice';

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      courses: courseSliceReducer,
      authentication: authSliceSliceReducer,
      utilities: utilitySliceReducer,
    }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
