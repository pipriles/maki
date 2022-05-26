import React from 'react';
import { batch } from 'react-redux';
import { BiPlay, BiPause, BiStop } from 'react-icons/bi';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentRecipe } from '../store/selectors';
import { changeRunningState } from '../store/slices/app';
import { resetAllCommandStatus } from '../store/slices/command';
import { clearMessages, changeRecipe } from '../store/slices/recipe';
import { createAppUseStyles } from '../styles';
import { playRecipe } from '../middleware'

import CurrentTab from './CurrentTab';

const useStyles = createAppUseStyles(theme => ({
  root: {
    borderBottom: [1, "solid", theme.palette.primary.main ],
  },
  playback: {
    display: "flex",
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
  },
  above: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: [theme.spacing(0.75), theme.spacing(1)],
  },
  below: {
    borderTop: [1, "solid", theme.lighten(theme.palette.background, 0.5)],
    display: "flex",
    justifyContent: "space-between",
  },
  options: {
    display: "flex",
  }
}));

const StatusBar = () => {

  const styles = useStyles();
  const dispatch = useAppDispatch();
  const currentRecipe = useAppSelector(getCurrentRecipe);

  const onRecipePlay = () => {
    console.log('Start scraping!');
    if (currentRecipe !== undefined)
      playRecipe(currentRecipe);
  };

  const onRecipePause = () => {
    dispatch(changeRunningState(false));
  }

  const onRecipeStop = () => {
    batch(() => {
      dispatch(changeRunningState(false));
      dispatch(resetAllCommandStatus());

      const changes = { currentInput: undefined };
      currentRecipe && dispatch(changeRecipe({ id: currentRecipe.id, changes }));
      currentRecipe && dispatch(clearMessages(currentRecipe.id));
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.above}>
        <CurrentTab />
        <div className={styles.options}></div>
      </div>
      <div className={styles.below}>
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
    </div>
  );
};

export default StatusBar;
