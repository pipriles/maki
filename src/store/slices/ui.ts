import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Command } from './command';

export interface IUi {
  currentCommand?: Command['id'];
  commandCopied?: Command['id'];
}

const initialState: IUi = {
  currentCommand: undefined,
  commandCopied: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    changeCurrentCommand: (state: IUi, action: PayloadAction<IUi['currentCommand']>) => {
      return { ...state, currentCommand: action.payload };
    },
    copyCommand: (state: IUi, action: PayloadAction<IUi['commandCopied']>) => {
      return { ...state, commandCopied: action.payload };
    }
  }
});

export const { changeCurrentCommand, copyCommand } = uiSlice.actions;

export default uiSlice.reducer;

