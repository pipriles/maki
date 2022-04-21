import React from 'react';
import { batch } from 'react-redux';
import { BiPlay, BiPause, BiStop } from 'react-icons/bi';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { commandSelectors } from '../store/selectors';
import { changeRunningState } from '../store/slices/app';
import { resetAllCommandStatus } from '../store/slices/command';
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
  const dispatch = useAppDispatch();
  const commands = useAppSelector(commandSelectors.selectAll);

  const onRecipePlay = () => {
    console.log('Start scraping!');
    runCommands(commands);
  };

  const onRecipePause = () => {
    dispatch(changeRunningState(false));
  }

  const onRecipeStop = () => {
    batch(() => {
      dispatch(changeRunningState(false));
      dispatch(resetAllCommandStatus());
    });
  };

  return (
    <div className={styles.root}>
      <CurrentTab />
      <div className={styles.playback}>
        <button className={styles.button} onClick={onRecipePlay}>
          <BiPlay />
        </button>
        <button className={styles.button} onClick={onRecipePause}>
          <BiPause />
        </button>
        <button className={styles.button} onClick={onRecipeStop}>
          <BiStop />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
