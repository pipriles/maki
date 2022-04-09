import React from 'react';
import { createAppUseStyles } from '../styles';

import Toolbar from './Toolbar';
import CommandList from './CommandList';
import CommandInput from './CommandInput';
import CommandParametersComponent from './CommandParameters';

const useStyles = createAppUseStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  body: {
    display: "flex",
    flexGrow: 1,
  }
}));

const AutomationMenu = () => {

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Toolbar />
      <div className={styles.body}>
        <div className={styles.inner}>
          <CommandList />
          <CommandInput />
        </div>
        <CommandParametersComponent />
      </div>
    </div>
  );
};

export default AutomationMenu;
