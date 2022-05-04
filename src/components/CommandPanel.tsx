import React from 'react';
import { Resizable } from 're-resizable';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentCommand } from '../store/selectors';
import { changeCommand } from '../store/slices/command';
import { createAppUseStyles } from '../styles';

import Autocomplete from './Autocomplete';
import CommandParametersComponent from './CommandParameters';
import CommandTypes from '../constants/commandTypes.json';

const useStyles = createAppUseStyles(theme => ({
  root: {
    borderLeft: [1, "solid", theme.lighten(theme.palette.background, 1)],
  },
  inner: {
    padding: theme.spacing(2),
    height: "100%",
  },
  group: {
    marginBottom: theme.spacing(1)
  },
}));

const CommandPanel = () => {

  const styles = useStyles();
  const dispatch = useAppDispatch();
  const command = useAppSelector(getCurrentCommand);

  if (command === undefined)
    return null;

  const onCommandTypeChange = (value: string) => {
    const payload = { id: command.id, commandType: value }
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
      <Resizable 
        defaultSize={{ width: 256, height: "100%" }} 
        enable={{ left: true }} 
        minWidth={256} 
        maxWidth={512}>

        <div className={styles.inner}>

          <div className={styles.group}>
            <Autocomplete 
              value={command.commandType} 
              placeholder="Command"
              onChange={onCommandTypeChange}
              options={Object.keys(CommandTypes)} /> 
          </div>

          <div className={styles.group}>
            <input 
              value={command.field} 
              onChange={onCommandFieldChange}
              placeholder="Field*" />
          </div>

          <div className={styles.group}>
            <input 
              value={command.description} 
              onChange={onCommandDescriptionChange}
              placeholder="Description" />
          </div>

          <CommandParametersComponent />

      </div>

    </Resizable>
  </div>
)
};

export default CommandPanel;

