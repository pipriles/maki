import React from 'react';
import { createAppUseStyles } from '../styles';
import { Command } from '../store/slices/command';

const useStyles = createAppUseStyles(theme => ({
  root: {
    height: "100%",
    overflow: "auto",
  },
  message: {
    display: "block",
    padding: [theme.spacing(1), theme.spacing(1.5)],
    fontSize: theme.sizes(1.5),
    '&:hover': {
      backgroundColor: theme.lighten(theme.palette.background, 0.25),
    }
  }
}));

interface CommandLogProps {
  command: Command;
}

const CommandLog = ({ command }: CommandLogProps) => {

  const styles = useStyles();

  const commandLogger = command.commandLogger ?? ['No messages yet']
  const messages = commandLogger.map((msg) => (
    <span className={styles.message}>
      {msg}
    </span>
  ))

  return (
    <div className={styles.root}>
      {messages}
    </div>
  )
};

export default CommandLog;
