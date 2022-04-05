import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Command } from './command';

export interface IUi {
  currentCommand?: Command['id'];
}

const initialState: IUi = {
  currentCommand: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    changeCurrentCommand: (state: IUi, action: PayloadAction<IUi['currentCommand']>) => {
      return { ...state, currentCommand: action.payload };
    }
  }
});

export const { changeCurrentCommand } = uiSlice.actions;

export default uiSlice.reducer;

