import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './';

export const selectCommands = (state: RootState) => state.commands;
export const selectUi = (state: RootState) => state.ui;

export const getCurrentCommand = createSelector(
  [selectCommands, selectUi], 
  (commands, ui) => {
    if (ui.currentCommand !== undefined) {
      return commands.find(command => command.id === ui.currentCommand);
    }
  }
);
