import React from 'react';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentCommand } from '../store/selectors';
import { changeCommand } from '../store/slices/command';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles((theme) => ({
  root: {
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
    borderTop: ["1px", "solid", theme.lighten(theme.palette.background, 1)],
  },
  group: {
    display: "flex",
  },
  label: {
    padding: theme.spacing(1),
    fontSize: theme.sizes(1.75),
    flexBasis: 120,
    flexShrink: 0,
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

  if (command === undefined)
    return null;

  const onCommandTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: command.id, commandType: event.target.value }
    dispatch(changeCommand(payload))
  };

  const onCommandDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: command.id, description: event.target.value }
    dispatch(changeCommand(payload))
  };

  const onCommandFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: command.id, field: event.target.value }
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
        <span className={styles.label}>Field*</span>
        <input 
          className={styles.input} 
          value={command.field} 
          onChange={onCommandFieldChange}
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
