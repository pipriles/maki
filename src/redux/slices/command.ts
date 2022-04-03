import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import COMMANDS from '../defaults/commands.json';

interface ILocatorParameter {
  query: string;
  queryType: string;
  elementIndex?: number;
}

interface ICoordinatesParameter {
  x: number;
  y: number;
}

export interface ICommand {
  id: string;
  commandType: string;
  description: string;
  parameters: ICommandParameters;
}

export interface ICommandParameters {
  locator?: ILocatorParameter;
  text?: string;
  url?: string;
  timeout?: number;
  coordinates?: ICoordinatesParameter;
  strip?: boolean;
  collection?: boolean;
  attribute?: string;
  regex?: string;
}

const initialState: ICommand[] = COMMANDS;

export const commandFactory = () => ({
  id: uuidv4(),
  commandType: "",
  description: "",
  parameters: {} as ICommandParameters,
});

export const commandSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    addCommand: (state: ICommand[], action: PayloadAction<Partial<ICommand> | undefined>) => {
      const command = action.payload;
      const defaultCommand = commandFactory();
      return [ ...state, { ...defaultCommand, ...command ?? {} } ];
    },
    removeCommand: (state: ICommand[], action: PayloadAction<number>) => {
      const commandIndex = action.payload;
      return state.filter((_, index) => index !== commandIndex);
    },
    changeCommand: (state: ICommand[], action: PayloadAction<Partial<ICommand>>) => {
      return state.map(
        command => 
        command.id !== action.payload.id ? command : { ...command, ...action.payload }
      );
    }
  }
});

export const { addCommand, removeCommand, changeCommand } = commandSlice.actions;

export default commandSlice.reducer;
