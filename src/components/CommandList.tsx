import React from 'react';
import { batch } from 'react-redux';
import {
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';

import { SortableContext, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, } from '@dnd-kit/modifiers'

import { createAppUseStyles } from '../styles';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { changeCurrentCommand, copyCommand } from '../store/slices/ui';
import { 
  getCurrentCommand, 
  getCurrentRecipe, 
  getCurrentRecipeCommands,
  getCommandCopied,
} from '../store/selectors';
import { 
  commandFactory,
  createCommandCopy,
  insertCommand,
  removeCommand, 
} from '../store/slices/command';

import { moveCommand } from '../store/slices/recipe';

import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem';
import ContextMenuDivider from './ContextMenuDivider';
import CommandStep from './CommandStep';

import { useContextMenu } from './utils';
import { runSingleCommandById } from '../middleware';

const useStyles = createAppUseStyles(theme => ({
  root: {
    borderTop: ["1px", "solid", theme.lighten(theme.palette.background, 0.5)],
    flexGrow: 1,
    flexBasis: 100,
    overflow: "auto",
  },
}));

const CommandList = () => {

  const styles = useStyles();
  const dispatch = useAppDispatch();
  const currentRecipe = useAppSelector(getCurrentRecipe);
  const commands = useAppSelector(getCurrentRecipeCommands)
  const currentCommand = useAppSelector(getCurrentCommand)
  const commandCopied = useAppSelector(getCommandCopied);

  if (currentRecipe === undefined)
    return null;

  const commandIds = currentRecipe.commands ?? [];

  const handleCopy = React.useCallback(() => {
    dispatch(copyCommand(currentCommand?.id));
  }, [dispatch, currentCommand]);

  const handlePaste = React.useCallback(() => {
    if (commandCopied === undefined) return;

    const currentCommandIndex = commands.findIndex(command => command.id === currentCommand?.id);
    const index = currentCommandIndex !== -1 ? currentCommandIndex : commands.length - 1;
    const copy = createCommandCopy(commandCopied);

    dispatch(insertCommand(index, copy));

  }, [dispatch, commands, currentCommand, commandCopied]);

  const handleDelete = React.useCallback(() => {
    if (!currentCommand) return;

    const index = commands.findIndex(command => command.id === currentCommand.id);
    const nextCommand = commands[index < commands.length-1 ? index+1 : commands.length-2];

    batch(() => {
      dispatch(removeCommand(currentCommand.id))
      dispatch(changeCurrentCommand(nextCommand?.id))
    });
  }, [dispatch, currentCommand]);

  const handleRunCommand = React.useCallback(() => {
    if (currentCommand?.id)
      runSingleCommandById(currentCommand.id);
  }, [dispatch, currentCommand]);

  const handleArrowDown = React.useCallback(() => {

    const index = currentCommand 
      ? commands.findIndex(command => command.id === currentCommand.id)
      : -1

    const nextCommand = index < commands.length-1 ? commands[index+1] : commands[0];
    dispatch(changeCurrentCommand(nextCommand?.id))

  }, [dispatch, currentCommand]);

  const handleArrowUp = React.useCallback(() => {

    const index = currentCommand 
      ? commands.findIndex(command => command.id === currentCommand.id)
      : -1;

    const nextCommand = index <= 0 ? commands[commands.length-1] : commands[index-1];
    dispatch(changeCurrentCommand(nextCommand?.id))

  }, [dispatch, currentCommand]);

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {

    if (event.target instanceof HTMLInputElement)
      return;

    if (event.ctrlKey && event.key.toLowerCase() === 'c') handleCopy();
    else if (event.ctrlKey && event.key.toLowerCase() === 'v') handlePaste();
    else if (event.key === "Delete") handleDelete();
    else if (event.ctrlKey && event.key.toLowerCase() == "enter") handleRunCommand();

    // Arrow movement
    else if (event.key.toLowerCase() == "arrowdown") handleArrowDown();
    else if (event.key.toLowerCase() == "arrowup") handleArrowUp();

  }, [handleCopy, handlePaste, handleDelete]);

  // listen to hot key events
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active && over && active.id !== over.id) {
      const oldIndex = commandIds.indexOf(active.id);
      const newIndex = commandIds.indexOf(over.id);
      const payload = { recipeId: currentRecipe.id, newIndex, oldIndex };
      dispatch(moveCommand(payload));
    };
  }

  const renderCommands = commands.map(
    (command, index) => <CommandStep command={command} index={index} key={command.id} />
  );

  if (currentRecipe !== undefined) {
    const fakeCommand = commandFactory(currentRecipe.id);
    renderCommands.push(
      <CommandStep command={fakeCommand} index={renderCommands.length} key={fakeCommand.id} />
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  const contextMenu = useContextMenu();

  const onCommandDelete = () => {
    if (contextMenu?.command)
      dispatch(removeCommand(contextMenu.command));
  };

  const onCommandCopy = () => {
    if (contextMenu?.command)
      dispatch(copyCommand(contextMenu.command));
  };

  const onCommandPaste = () => {
    if (contextMenu?.command && commandCopied) {
      const index = commandIds.indexOf(contextMenu.command);
      const copy = createCommandCopy(commandCopied)
      dispatch(insertCommand(index+1, copy))
    }
  };

  const onCommandRun = () => {
    if (contextMenu?.command)
      runSingleCommandById(contextMenu.command)
  };

  return (
    <div className={styles.root}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext 
          items={commands}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {renderCommands}
          </div>
        </SortableContext>
      </DndContext>

      <ContextMenu 
        open={contextMenu?.command !== undefined} 
        position={contextMenu}>
        <ContextMenuItem label={"Copy"} tooltip={"Ctrl + C"} onClick={onCommandCopy}/>
        <ContextMenuItem label={"Paste"} tooltip={"Ctrl + V"} onClick={onCommandPaste}/>
        <ContextMenuItem label={"Delete"} tooltip={"Del"} onClick={onCommandDelete}/>
        <ContextMenuDivider />
        <ContextMenuItem label={"Run command"} tooltip={"Ctrl + Enter"} onClick={onCommandRun}/>
      </ContextMenu>
    </div>
  )
};

export default CommandList;
