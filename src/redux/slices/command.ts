import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import COMMANDS from '../defaults/commands.json';

interface LocatorParameter {
  query: string;
  queryType: string;
  elementIndex?: number | null;
}

interface CoordinatesParameter {
  x?: number | null;
  y?: number | null;
}

export interface CommandParameters {
  locator: LocatorParameter;
  text: string;
  url: string;
  timeout: number;
  coordinates: CoordinatesParameter;
  strip: boolean;
  collection: boolean;
  attribute: string;
  regex: string;
}

export interface Command {
  id: string;
  commandType: string;
  description: string;
  parameters: CommandParameters;
}

export interface CommandPayload extends Omit<Partial<Command>, 'parameters'> { 
  parameters?: Partial<CommandParameters>
}

const defaultParameters: CommandParameters = {
  "locator": {
    "query": "",
    "queryType": "CSS",
    "elementIndex": undefined
  },
  "text": "",
  "url": "",
  "timeout": 1000,
  "coordinates": {
    "x": undefined,
    "y": undefined
  },
  "strip": true,
  "collection": false,
  "attribute": "",
  "regex": ""
};

const initialState: Command[] = COMMANDS;

export const commandFactory = (): Command => ({
  id: uuidv4(),
  commandType: "",
  description: "",
  parameters: { ...defaultParameters },
});

export const commandSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    addCommand: (state: Command[], action: PayloadAction<Partial<Command> | undefined>) => {
      const command = action.payload;
      const defaultCommand = commandFactory();
      return [ ...state, { ...defaultCommand, ...command ?? {} } ];
    },
    removeCommand: (state: Command[], action: PayloadAction<number>) => {
      const commandIndex = action.payload;
      return state.filter((_, index) => index !== commandIndex);
    },
    changeCommand: (state: Command[], action: PayloadAction<CommandPayload>) => {
      return state.map(
        command => 
        command.id !== action.payload.id ? command : updateCommand(command, action.payload)
      );
    },
  }
});

const updateCommand = (command: Command, payload: CommandPayload) => {
  const parameters = { ...command.parameters, ...payload?.parameters };
  return { ...command, ...payload, parameters: parameters };
};

export const { addCommand, removeCommand, changeCommand } = commandSlice.actions;

export default commandSlice.reducer;
