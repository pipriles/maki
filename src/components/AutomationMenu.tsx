import React from 'react';
import { createAppUseStyles } from '../styles';

import CurrentTab from './CurrentTab';
import CommandList from './CommandList';
import CommandInput from './CommandInput';

const useStyles = createAppUseStyles({
  root: {
    display: "flex",
    height: "100%",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
});

const AutomationMenu = () => {

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <CurrentTab />
        <CommandList />
        <CommandInput />
      </div>
    </div>
  );
};

export default AutomationMenu;
