import React from 'react';
import { createAppUseStyles } from '../styles';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentCommand } from '../store/selectors';
import { CommandPayload, CommandParameters, changeCommand } from '../store/slices/command';
import CommandTypes from '../constants/commandTypes.json';

import CommandParameter from './CommandParameter';
import { hasOwnProperty } from './utils';

const useStyles = createAppUseStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    flexBasis: 256,
    borderLeft: [1, "solid", theme.lighten(theme.palette.background, 1)],
    overflow: "hidden",
  },
  parameter: {
    marginBottom: theme.spacing(1),
  }
}));

const CommandParametersComponent = () => {

  const styles = useStyles();
  const dispatch = useAppDispatch();
  const currentCommand = useAppSelector(getCurrentCommand);

  if (currentCommand === undefined || !hasOwnProperty(CommandTypes, currentCommand.commandType))
    return null;

  const parameters = CommandTypes[currentCommand.commandType]
  const currentParameters = currentCommand.parameters;

  const handleChange = (
    parameterType: keyof CommandParameters
  ) => (
    payload: Partial<CommandParameters[typeof parameterType]>
  ) => {
    const updated: CommandPayload = { 
      id: currentCommand.id, 
      parameters: {
        [parameterType]: payload 
      }
    }
    dispatch(changeCommand(updated));
  };

  const renderParameters = parameters.map(key => {

    const propertyKey = key.toLowerCase();

    if (!hasOwnProperty(currentParameters, propertyKey)) 
      return null;

    return (
      <div 
        className={styles.parameter}
        key={propertyKey}
      >
        <CommandParameter 
          key={propertyKey}
          parameterType={propertyKey} 
          parameter={currentParameters[propertyKey]} 
          onChange={handleChange(propertyKey)} 
        />
      </div>
    )
  });

  if (!renderParameters)
    return null;

  return (
    <div className={styles.root}>
      {renderParameters}
    </div>
  );
};

export default CommandParametersComponent;
