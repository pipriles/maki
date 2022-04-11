import React from 'react';
import { batch } from 'react-redux';

import { createAppUseStyles } from '../styles';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { commandFactory, createCommandCopy, removeCommand } from '../store/slices/command';
import { changeCurrentCommand, copyCommand } from '../store/slices/ui';
import { commandSelectors, getCurrentCommand } from '../store/selectors';

import CommandStep from './CommandStep';

const useStyles = createAppUseStyles(theme => ({
  root: {
    borderTop: ["1px", "solid", theme.lighten(theme.palette.background, 0.5)],
    flexGrow: 1,
    overflow: "auto",
  },
}));

const CommandList = () => {

  const styles = useStyles();
  const dispatch = useAppDispatch();
  const commands = useAppSelector(commandSelectors.selectAll)
  const currentCommand = useAppSelector(getCurrentCommand)
  const commandCopied = useAppSelector(state => state.ui.commandCopied);

  const fakeCommand = commandFactory();
  const commandSteps = [ ...commands, fakeCommand ];

  const renderCommands = commandSteps.map(
    (command, index) => <CommandStep command={command} index={index} key={command.id} />
  );

  const handleCopy = React.useCallback(() => {
    dispatch(copyCommand(currentCommand?.id));
  }, [dispatch, currentCommand]);

  const handlePaste = React.useCallback(() => {
    const currentCommandIndex = commands.findIndex(command => command.id === currentCommand?.id);
    const index = currentCommandIndex !== -1 ? currentCommandIndex : commands.length - 1;
    const payload = { commandId: commandCopied, index };
    dispatch(createCommandCopy(payload));
  }, [dispatch, commands, currentCommand, commandCopied]);

  const handleDelete = React.useCallback(() => {
    if (!currentCommand) return;

    const index = commands.findIndex(command => command.id === currentCommand.id);
    const nextCommand = commands[index+1];

    batch(() => {
      dispatch(removeCommand(currentCommand.id))
      dispatch(changeCurrentCommand(nextCommand?.id))
    });
  }, [dispatch, currentCommand]);

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'c') handleCopy();
    else if (event.ctrlKey && event.key.toLowerCase() === 'v') handlePaste();
    else if (event.key === "Delete") handleDelete();
  }, [handleCopy, handlePaste, handleDelete]);

  // listen to hot key events
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  return (
    <div className={styles.root}>
      <div>{renderCommands}</div>
    </div>
  )
};

export default CommandList;
