import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tabs } from 'webextension-polyfill';

export interface IApp {
  activeTab?: Tabs.Tab
}

const initialState: IApp = {
  activeTab: undefined,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeActiveTab: (state: IApp, action: PayloadAction<Tabs.Tab>) => {
      return { ...state, activeTab: action.payload };
    }
  }
});

export const { changeActiveTab } = appSlice.actions;

export default appSlice.reducer;
