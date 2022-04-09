import { createSelector } from '@reduxjs/toolkit';
import { commandsAdapter } from './slices/command';
import { RootState } from './';


export const selectCommands = (state: RootState) => state.commands;
export const selectUi = (state: RootState) => state.ui;
export const getActiveTab = (state: RootState) => state.app.activeTab;

export const commandSelectors = commandsAdapter.getSelectors(selectCommands);

export const getCurrentCommand = createSelector(
  [commandSelectors.selectAll, selectUi], 
  (commands, ui) => {
    if (ui.currentCommand !== undefined) {
      return commands.find(command => command.id === ui.currentCommand);
    }
  }
);

