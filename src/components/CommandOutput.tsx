import React from 'react';
import { createAppUseStyles } from '../styles';
import { Command } from '../store/slices/command';

const useStyles = createAppUseStyles(theme => ({
  root: {
    height: "100%",
    overflow: "auto",
    padding: [theme.spacing(1), theme.spacing(1.5)],
  },
  pre: {
    margin: 0,
    fontSize: 12,
  }
}));

interface CommandOutputProps {
  command: Command;
};

const CommandOutput = ({ command }: CommandOutputProps) => {

  const styles = useStyles();
  const commandResult = { id: 1, name: "asd", price: "2.34$" };
  const result = JSON.stringify(commandResult, null, 2);

  return (
    <div className={styles.root}>
      <pre className={styles.pre}>
        {result}
      </pre>
    </div>
  );
};

export default CommandOutput;
