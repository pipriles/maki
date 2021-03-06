import { createSelector } from '@reduxjs/toolkit';
import { commandsAdapter } from './slices/command';
import { recipeAdapter } from './slices/recipe';
import { RootState } from './';
import { isTruthy } from '../common/utils';

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

export const getRecipeDataFields = createSelector(
  [getCurrentRecipe, selectCommands],
  (recipe, commands) => {
    if (recipe === undefined) return;
    const recipeCommands = recipe.commands.map(id => commands.entities[id]);
    const result = recipeCommands
      .filter(isTruthy)
      .filter(command => command.field)
      .map(command => [command.id, command.field] as const)
    return result;
  }
);

export const getRecipeCommands = createSelector(
  [
    recipeSelectors.selectById,
    selectCommands
  ],
  (recipe, commands) => {
    const recipeCommands = recipe?.commands ?? [];
    return recipeCommands.map(id => commands.entities[id]).filter(isTruthy);
  }
)

export const getCurrentRecipeCommands = createSelector(
  [
    getCurrentRecipe,
    selectCommands
  ],
  (recipe, commands) => {
    const recipeCommands = recipe?.commands ?? [];
    return recipeCommands.map(id => commands.entities[id]).filter(isTruthy);
  }
)

export const getCommandCopied = createSelector(
  [selectUi, selectCommands],
  (ui, commands) => {
    if (ui.commandCopied !== undefined) {
      const command = commands.entities[ui.commandCopied];
      return command;
    }
  }
);
