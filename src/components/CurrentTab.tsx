import React from 'react';
import { useAppSelector } from '../store/hooks';
import { createAppUseStyles } from '../styles'

const useStyles = createAppUseStyles(theme => ({
  root: {
    display: "flex",
  },
  message: {
    cursor: 'default',
    fontSize: theme.sizes(1.5),
    '&:hover': {
      color: 'gray'
    }
  },
}));

const CurrentTab = () => {

  const classes = useStyles()
  const activeTab = useAppSelector(state => state.app.activeTab);
  const msg = activeTab ? `${activeTab.id} - ${activeTab?.title}` : "No tab connected";

  return (
    <div className={classes.root}>
      <span className={classes.message}>{msg}</span>
    </div>
  );
};

export default CurrentTab;
