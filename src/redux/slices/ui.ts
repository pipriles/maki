import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICommand } from './command';

export interface IUi {
  currentCommand?: ICommand['id'];
}

const initialState: IUi = {
  currentCommand: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    changeCurrentCommand: (state: IUi, action: PayloadAction<IUi['currentCommand']>) => {
      console.log(action.payload);
      return { ...state, currentCommand: action.payload };
    }
  }
});

export const { changeCurrentCommand } = uiSlice.actions;

export default uiSlice.reducer;

