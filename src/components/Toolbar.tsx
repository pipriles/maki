import React from 'react';
import { batch } from 'react-redux';
import { BiPlay, BiPause, BiStop, BiDotsVertical, BiExport } from 'react-icons/bi';
import { AiOutlineExport } from 'react-icons/ai';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { commandSelectors } from '../store/selectors';
import { changeRunningState } from '../store/slices/app';
import { resetAllCommandStatus, clearLogMessages } from '../store/slices/command';
import { createAppUseStyles } from '../styles';
import { runCommands } from '../proxy'

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
    padding: [theme.spacing(0.25), theme.spacing(1)],
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
      dispatch(clearLogMessages());
    });
  };

  const onClickExport = () => {
    // Open export file
  };

  return (
    <div className={styles.root}>
      <div className={styles.above}>
        <CurrentTab />
        <div className={styles.options}>
          <button className={styles.button} onClick={onClickExport}>
            <AiOutlineExport />
          </button>
        </div>
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

export default Toolbar;
