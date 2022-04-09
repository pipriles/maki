import { createSlice, PayloadAction, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
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

export const commandsAdapter = createEntityAdapter<Command>();

const initialState: EntityState<Command> = {
  entities: Object.fromEntries(COMMANDS.map(command => [command.id, command])),
  ids: COMMANDS.map(command => command.id)
} 

export const commandFactory = (): Command => ({
  id: uuidv4(),
  commandType: "",
  description: "",
  parameters: { ...defaultParameters },
});

const createNewCommand = (payload?: CommandPayload): Command => {
  const defaultCommand = commandFactory();
  return mergeCommand(defaultCommand, payload);
};

const mergeCommand = (command: Command, payload?: CommandPayload): Command => {
  const parameters = { ...command.parameters, ...payload?.parameters };
  return { ...command, ...payload, parameters: parameters };
};

export const commandSlice = createSlice({
  name: 'commands',
  initialState: commandsAdapter.getInitialState(initialState),
  reducers: {
    removeCommand: commandsAdapter.removeOne,
    addCommand: (state, action: PayloadAction<Partial<Command> | undefined>) => {
      const command = createNewCommand(action.payload);
      return commandsAdapter.addOne(state, command)
    },
    changeCommand: (state, action: PayloadAction<CommandPayload>) => {
      const commandId = action.payload.id;
      if (!commandId) return;

      const command = state.entities[commandId];
      if (!command) return;

      state.entities[commandId] = mergeCommand(command, action.payload);
    },
    insertCommand: (state, action: PayloadAction<number>) => {
      const command = createNewCommand();
      commandsAdapter.addOne(state, command);
      state.ids.pop();
      state.ids.splice(action.payload, 0, command.id);
    },
  }
});

export const { addCommand, removeCommand, changeCommand } = commandSlice.actions;

export default commandSlice.reducer;
