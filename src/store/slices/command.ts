import { createSlice, PayloadAction, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { Command, CommandPayload, CommandParameters } from '../../models';

import COMMANDS from '../defaults/commands.json';

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

export const commandFactory = (recipeId?: string): Command => ({
  id: uuidv4(),
  recipeId: recipeId ?? "",
  commandType: "",
  description: "",
  parameters: { ...defaultParameters },
  field: "",
});

export const createCommandCopy = (payload?: CommandPayload): Command => {
  const defaultCommand = commandFactory();
  const merged = mergeCommand(defaultCommand, payload);
  return { ...merged, id: defaultCommand.id };
};

const mergeCommand = (command: Command, payload?: Partial<CommandPayload>): Command => {
  const parameters = { ...command.parameters, ...payload?.parameters };
  return { ...command, ...payload, parameters: parameters };
};

export const commandSlice = createSlice({
  name: 'commands',
  initialState: commandsAdapter.getInitialState(initialState),
  reducers: {
    removeCommand: commandsAdapter.removeOne,
    addCommand: commandsAdapter.addOne,
    changeCommand: (state, action: PayloadAction<Partial<CommandPayload>>) => {
      const commandId = action.payload.id;
      if (!commandId) return;

      const command = state.entities[commandId];
      if (!command) return;

      state.entities[commandId] = mergeCommand(command, action.payload);
    },
    insertCommand: {
      reducer: (state, action: PayloadAction<{ command: Command, index: number; }>) => {
        const { command, index } = action.payload;
        commandsAdapter.addOne(state, command);
        state.ids.pop();
        state.ids.splice(index, 0, command.id);
      },
      prepare: (index: number, payload?: CommandPayload) => {
        const command = createCommandCopy(payload);
        return  { payload: { command, index } };
      }
    },
    moveCommand: (state, action: PayloadAction<{ oldIndex: number, newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      state.ids = arrayMove(state.ids, oldIndex, newIndex); 
    },
    resetAllCommandStatus: (state) => {
      state.ids.forEach(id => {
        const command = state.entities[id];
        if (command !== undefined)
          command.commandStatus = undefined
      });
    },
  }
});

export const { 
  addCommand, 
  removeCommand, 
  insertCommand,
  changeCommand, 
  moveCommand,
  resetAllCommandStatus,
} = commandSlice.actions;

export default commandSlice.reducer;
