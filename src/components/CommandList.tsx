import React from 'react';

import { createAppUseStyles } from '../styles';
import { useAppSelector } from '../redux/hooks';
import { commandFactory } from '../redux/slices/command';

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
  const commands = useAppSelector(state => state.commands)

  const fakeCommand = commandFactory();
  const commandSteps = [ ...commands, fakeCommand ];

  const renderCommands = commandSteps.map(
    (command, index) => <CommandStep command={command} index={index} key={command.id} />
  );

  return (
    <div className={styles.root}>
      <div>{renderCommands}</div>
    </div>
  )
};

export default CommandList;
