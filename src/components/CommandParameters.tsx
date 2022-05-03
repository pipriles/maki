import React from 'react';
import { createAppUseStyles } from '../styles';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentCommand } from '../store/selectors';
import { CommandPayload, CommandParameters, changeCommand } from '../store/slices/command';
import CommandTypes from '../constants/commandTypes.json';

import CommandParameter from './CommandParameter';
import { isPropertyOf } from '../common/utils';

const useStyles = createAppUseStyles(theme => ({
  root: {
    paddingTop: 16,
    marginTop: 16,
    borderTop: [1, "solid", theme.lighten(theme.palette.background, 1)],
  },
  parameter: {
    marginBottom: theme.spacing(1),
  }
}));

const CommandParametersComponent = () => {

  const styles = useStyles();
  const dispatch = useAppDispatch();
  const currentCommand = useAppSelector(getCurrentCommand);

  if (currentCommand === undefined || !isPropertyOf(currentCommand.commandType, CommandTypes))
    return null;

  const parameters = CommandTypes[currentCommand.commandType]
  const currentParameters = currentCommand.parameters;

  const handleChange = (
    parameterType: keyof CommandParameters
  ) => (
    payload: Partial<CommandParameters[typeof parameterType]>
  ) => {
    const updated: Partial<CommandPayload> = { 
      id: currentCommand.id, 
      parameters: {
        [parameterType]: payload 
      }
    }
    dispatch(changeCommand(updated));
  };

  const renderParameters = parameters.map(key => {

    const propertyKey = key.toLowerCase();

    if (!isPropertyOf(propertyKey, currentParameters)) 
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
