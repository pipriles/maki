import { 
  createSlice, 
  PayloadAction, 
  Update, 
  createEntityAdapter, 
  EntityState 
} from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid';
import { Recipe } from '../../models';

import COMMANDS from '../defaults/commands.json';

export const recipeAdapter = createEntityAdapter<Recipe>();

const recipeFactory = (merge?: Partial<Recipe>): Recipe => ({
  id: uuidv4(),
  name: "Recipe",
  description: "",
  executionSpeed: 500,
  commands: [],
  recipeLog: [],
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

      const changes = { recipeLog: [ message, ...recipe.recipeLog ] };
      const update: Update<Recipe> = { id: recipeId, changes };
      return recipeAdapter.updateOne(state, update);
    },
    clearMessages: (state, action: PayloadAction<Recipe['id']>) => {
      const recipeId = action.payload;
      const change = { id: recipeId, changes: { recipeLog: [] } }
      return recipeAdapter.updateOne(state, change);
    }
  },
});

export const { addRecipe, changeRecipe, pushMessage, clearMessages, } = recipeSlice.actions;

export default recipeSlice.reducer;
