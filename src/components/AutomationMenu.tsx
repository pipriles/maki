import React from 'react';
import { createAppUseStyles } from '../styles';

import CurrentTab from './CurrentTab';
import CommandList from './CommandList';
import CommandInput from './CommandInput';
import CommandParametersComponent from './CommandParameters';

const useStyles = createAppUseStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
}));

const AutomationMenu = () => {

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <CurrentTab />
        <CommandList />
        <CommandInput />
      </div>
      <CommandParametersComponent />
    </div>
  );
};

export default AutomationMenu;
