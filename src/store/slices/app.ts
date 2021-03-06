import browser from 'webextension-polyfill';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tabs } from 'webextension-polyfill';
import { IApp } from '../../models';

const initialState: IApp = {
  activeTab: undefined,
  running: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeActiveTab: (state: IApp, action: PayloadAction<Tabs.Tab>) => {
      if (!state.running || state.activeTab?.id === action.payload.id) {
        return { ...state, activeTab: action.payload };
      } return state;
    },
    changeRunningState: (state: IApp, action: PayloadAction<boolean>) => {
      return { ...state, running: action.payload };
    }
  }
});

export const { changeActiveTab, changeRunningState } = appSlice.actions;

export default appSlice.reducer;
