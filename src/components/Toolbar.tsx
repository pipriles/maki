import React from 'react';
import { BiPlay, BiPause, BiStop } from 'react-icons/bi';
import { useAppSelector } from '../store/hooks';
import { commandSelectors } from '../store/selectors';
import { createAppUseStyles } from '../styles';
import { runCommands } from '../proxy'

import CurrentTab from './CurrentTab';

const useStyles = createAppUseStyles(theme => ({
  root: {
    borderBottom: [1, "solid", theme.palette.primary.main ],
  },
  playback: {
    display: "flex",
    borderTop: [1, "solid", theme.lighten(theme.palette.background, 0.5)],
  },
  button: {
    background: "none",
    padding: 0,
    fontSize: theme.sizes(2.5),
    width: 32,
    aspectRatio: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.typography.primary,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  }
}));

const Toolbar = () => {

  const styles = useStyles();
  const commands = useAppSelector(commandSelectors.selectAll);

  const onRecipePlay = () => {
    console.log('Start scraping!');
    runCommands(commands);
  };

  return (
    <div className={styles.root}>
      <CurrentTab />
      <div className={styles.playback}>
        <button className={styles.button} onClick={onRecipePlay}>
          <BiPlay />
        </button>
        <button className={styles.button}>
          <BiPause />
        </button>
        <button className={styles.button}>
          <BiStop />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
