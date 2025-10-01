// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

// Optional: setup type helpers if using TypeScript
export const RootState = store.getState
export const AppDispatch = store.dispatch
