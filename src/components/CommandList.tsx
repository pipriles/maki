import React from 'react';

import { createAppUseStyles } from '../styles';
import { useAppSelector } from '../store/hooks';
import { commandFactory } from '../store/slices/command';
import { commandSelectors } from '../store/selectors';

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
  const commands = useAppSelector(commandSelectors.selectAll)

  const fakeCommand = commandFactory();
  const commandSteps = [ ...commands, fakeCommand ];

  const renderCommands = commandSteps.map(
    (command, index) => <CommandStep command={command} index={index} key={command.id} />
  );

  // listen to hot key events

  return (
    <div className={styles.root}>
      <div>{renderCommands}</div>
    </div>
  )
};

export default CommandList;
