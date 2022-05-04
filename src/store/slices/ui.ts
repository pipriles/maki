import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUi } from '../../models';

const initialState: IUi = {
  currentRecipe: "1",
  currentCommand: undefined,
  commandCopied: undefined,
  contextMenu: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    changeUi: (state: IUi, action: PayloadAction<Partial<IUi>>) => {
      return { ...state, ...action.payload };
    },
    changeCurrentCommand: (state: IUi, action: PayloadAction<IUi['currentCommand']>) => {
      return { ...state, currentCommand: action.payload };
    },
    copyCommand: (state: IUi, action: PayloadAction<IUi['commandCopied']>) => {
      return { ...state, commandCopied: action.payload };
    },
    setContextMenu: (state, action: PayloadAction<IUi['contextMenu']>) => {
      const { contextMenu } = state;
      const merged = { ...contextMenu, ...action.payload }
      return { ...state, contextMenu: merged };
    },
  }
});

export const { changeUi, changeCurrentCommand, copyCommand, setContextMenu } = uiSlice.actions;

export default uiSlice.reducer;

