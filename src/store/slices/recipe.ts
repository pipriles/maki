import { createSlice, PayloadAction, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

import { Recipe, Result } from '../../models';
import { addCommand, removeCommand, insertCommand } from './command';

import COMMANDS from '../defaults/commands.json';

export const recipeAdapter = createEntityAdapter<Recipe>();

const recipeFactory = (merge?: Partial<Recipe>): Recipe => ({
  id: uuidv4(),
  name: "Recipe",
  description: "",
  executionSpeed: 500,
  exportFormat: "JSON",
  commands: [],
  logger: [],
  inputs: [],
  output: [],
  ...merge
});

const initialState: EntityState<Recipe> = {
  entities: {
    "1": recipeFactory({
      id: "1",
      commands: COMMANDS.map(command => command.id)
    })
  },
  ids: [ "1" ]
};

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState: recipeAdapter.getInitialState(initialState),
  reducers: {
    addRecipe: recipeAdapter.addOne,
    changeRecipe: recipeAdapter.updateOne,
    pushMessage: (
      state, 
      action: PayloadAction<{ recipeId: Recipe['id']; message: string; }>
    ) => {
      const { recipeId, message } = action.payload;
      const recipe = state.entities[recipeId];

      if (recipe === undefined)
        return state;

      const changes = { logger: [ message, ...recipe.logger ] };
      const update = { id: recipeId, changes };
      return recipeAdapter.updateOne(state, update);
    },
    clearMessages: (state, action: PayloadAction<Recipe['id']>) => {
      const recipeId = action.payload;
      const change = { id: recipeId, changes: { logger: [] } }
      return recipeAdapter.updateOne(state, change);
    },
    moveCommand: (
      state, 
      action: PayloadAction<{ recipeId: Recipe['id'], oldIndex: number, newIndex: number }>
    ) => {
      const { recipeId, oldIndex, newIndex } = action.payload;
      const recipe = state.entities[recipeId];

      if (recipe !== undefined) {
        const commands = recipe.commands;
        recipe.commands = arrayMove(commands, oldIndex, newIndex); 
      }
    },
    upsertResult: (state, action: PayloadAction<{ recipeId: Recipe['id'], result: Result }>) => {
      const { recipeId, result } = action.payload;
      const recipe = state.entities[recipeId];

      if (recipe === undefined) return;

      const index = recipe.output.findIndex(obj => obj.label === result.label);

      if (index === -1) {
        recipe.output.push(result);
      } else {
        const obj = recipe.output[index];
        obj.data = { ...obj.data, ...result.data }; 
      }
    },
    addInput: (
      state, 
      action: PayloadAction<{ recipeId: Recipe['id']; input: string; }>
    ) => {
      const { recipeId, input } = action.payload;
      const recipe = state.entities[recipeId];

      if (recipe === undefined)
        return state;

      const changes = { inputs: [ ...recipe.inputs, input ] };
      const update = { id: recipeId, changes };
      return recipeAdapter.updateOne(state, update);
    },
    removeInput: (
      state, 
      action: PayloadAction<{ recipeId: Recipe['id']; index: number; }>
    ) => {
      const { recipeId, index } = action.payload;
      const recipe = state.entities[recipeId];

      if (recipe === undefined || index < 0)
        return;

      recipe.inputs.splice(index, 1);
    },
    clearInput: (
      state, 
      action: PayloadAction<Recipe['id']>
    ) => {
      const recipeId = action.payload;
      const recipe = state.entities[recipeId];

      if (recipe === undefined) return;
      recipe.inputs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCommand, (state, action) => {
        const { id, recipeId } = action.payload;
        const recipe = state.entities[recipeId];

        if (recipe !== undefined)
          recipe.commands = [ ...recipe.commands, id ]
      })
      .addCase(removeCommand, (state, action) => {
        const commandId = action.payload;
        state.ids.forEach(recipeId => {
          const recipe = state.entities[recipeId];
          if (recipe !== undefined)
            recipe.commands = recipe.commands.filter(id => id !== commandId);
        });
      })
      .addCase(insertCommand, (state, action) => {
        const { index, command } = action.payload;
        const recipe = state.entities[command.recipeId];

        if (recipe !== undefined)
          recipe.commands.splice(index, 0, command.id);
      });
  }
});

export const { 
  addRecipe, 
  changeRecipe, 
  pushMessage, 
  clearMessages, 
  moveCommand,
  upsertResult,
  addInput,
  removeInput,
  clearInput,
} = recipeSlice.actions;

export default recipeSlice.reducer;
