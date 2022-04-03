import { configureStore } from '@reduxjs/toolkit';

import commandReducer from './slices/command';
import appReducer from './slices/app';
import uiReducer from './slices/ui';

export const store = configureStore({
  reducer: {
    commands: commandReducer,
    app: appReducer,
    ui: uiReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
