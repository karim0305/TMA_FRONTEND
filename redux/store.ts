import { configureStore } from "@reduxjs/toolkit";

// e.g. import rootReducer from './rootReducer';

const store = configureStore({
  reducer: /* rootReducer */ (state => state), // replace with your reducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;