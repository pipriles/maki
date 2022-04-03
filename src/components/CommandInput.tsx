import React from 'react';

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { getCurrentCommand } from '../redux/selectors';
import { changeCommand } from '../redux/slices/command';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles((theme) => ({
  root: {
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
    borderTop: ["1px", "solid", theme.palette.primary.main],
  },
  group: {
    display: "flex",
  },
  label: {
    fontSize: theme.sizes(1.75),
    flexBasis: 120,
    padding: theme.spacing(1),
  },
  input: {
    backgroundColor: theme.palette.background,
    border: "none",
    width: "100%",
  },
}));

const CommandInput = () => {

  const command = useAppSelector(getCurrentCommand);
  const dispatch = useAppDispatch();
  const styles = useStyles();

  console.log(command);

  if (command === undefined)
    return null;

  const onCommandTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: command.id, commandType: event.target.value }
    dispatch(changeCommand(payload))
  };

  const onCommandDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    const payload = { id: command.id, description: event.target.value }
    dispatch(changeCommand(payload))
  };

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <span className={styles.label}>Command</span>
        <input 
          className={styles.input} 
          value={command.commandType} 
          onChange={onCommandTypeChange}
        />
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Description</span>
        <input 
          className={styles.input} 
          value={command.description} 
          onChange={onCommandDescriptionChange}
        />
      </div>
    </div>
  );
};

export default CommandInput;
