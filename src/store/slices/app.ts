import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tabs } from 'webextension-polyfill';

export interface IApp {
  activeTab?: Tabs.Tab
  running: boolean;
}

const initialState: IApp = {
  activeTab: undefined,
  running: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeActiveTab: (state: IApp, action: PayloadAction<Tabs.Tab>) => {
      return { ...state, activeTab: action.payload };
    },
    changeRunningState: (state: IApp, action: PayloadAction<boolean>) => {
      return { ...state, running: action.payload };
    }
  }
});

export const { changeActiveTab, changeRunningState } = appSlice.actions;

export default appSlice.reducer;
