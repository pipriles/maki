import React from 'react';
import { createAppUseStyles } from '../styles';
import { useAppSelector } from '../redux/hooks';
import { getCurrentCommand } from '../redux/selectors';

import CommandTypes from '../constants/commandTypes.json';

const useStyles = createAppUseStyles(theme => ({
  root: {
    flexBasis: 256,
    borderLeft: [1, "solid", theme.palette.primary.main],
    overflow: "hidden",
  },
}));

const CommandParameters = () => {

  const styles = useStyles();
  const currentCommand = useAppSelector(getCurrentCommand);

  console.log(currentCommand);

  if (currentCommand === undefined)
    return null;

  console.log(currentCommand.parameters)

  return (
    <div className={styles.root}>
      <span>Parameters</span>
    </div>
  );
};

export default CommandParameters;
