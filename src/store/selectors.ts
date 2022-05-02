import { createSelector } from '@reduxjs/toolkit';
import { commandsAdapter } from './slices/command';
import { recipeAdapter } from './slices/recipe';
import { RootState } from './';

export const selectRecipes = (state: RootState) => state.recipes;
export const selectCommands = (state: RootState) => state.commands;
export const selectUi = (state: RootState) => state.ui;
export const getActiveTab = (state: RootState) => state.app.activeTab;

export const commandSelectors = commandsAdapter.getSelectors(selectCommands);
export const recipeSelectors = recipeAdapter.getSelectors(selectRecipes);

export const getCurrentCommand = createSelector(
  [commandSelectors.selectAll, selectUi], 
  (commands, ui) => {
    if (ui.currentCommand !== undefined) {
      return commands.find(command => command.id === ui.currentCommand);
    }
  }
);

export const getCurrentRecipe = createSelector(
  [recipeSelectors.selectAll, selectUi],
  (recipes, ui) => {
    if (ui.currentRecipe !== undefined) {
      return recipes.find(recipe => recipe.id === ui.currentRecipe);
    }
  }
);
