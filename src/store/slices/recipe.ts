import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Command } from '../slices/command';
import { v4 as uuidv4 } from 'uuid';

import COMMANDS from '../defaults/commands.json';

interface Recipe {
  id: string;
  name: string;
  executionSpeed: number;
  commands: Command['id'][];
  recipeLog: string[];
}

export const recipeAdapter = createEntityAdapter<Recipe>();

const recipeFactory = (merge?: Partial<Recipe>): Recipe => ({
  id: uuidv4(),
  name: "Recipe",
  executionSpeed: 500,
  commands: [],
  recipeLog: [],
  ...merge
});

const initialState: EntityState<Recipe> = {
  entities: {
    "1": recipeFactory({
      commands: COMMANDS.map(command => command.id)
    })
  },
  ids: [ "1" ]
};

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState: recipeAdapter.getInitialState(initialState),
  reducers: {
  },
});

export const {} = recipeSlice.actions;

export default recipeSlice.reducer;
