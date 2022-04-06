import React from 'react';
import { CommandParameters } from '../redux/slices/command';
import { ICommandParametersProps } from './utils';

import LocatorParameter from './LocatorParameter';
import TextParameter from './TextParameter';
import UrlParameter from './UrlParameter';
import TimeoutParameter from './TimeoutParameter';
import CoordinatesParameter from './CoordinatesParameter';
import StripParameter from './StripParameter';
import CollectionParameter from './CollectionParameter';
import AttributeParameter from './AttributeParameter';

const parameterComponent = (parameterType: string) => {

  switch ( parameterType ) {

    case 'locator': 
      return LocatorParameter;
    case 'text':
      return TextParameter;
    case 'url': 
      return UrlParameter;
    case 'timeout': 
      return TimeoutParameter;
    case 'coordinates': 
      return CoordinatesParameter;
    case 'strip': 
      return StripParameter;
    case 'collection':
      return CollectionParameter;
    case 'attribute':
      return AttributeParameter;
    default:
      return null;
  };
}

type CommandComponentParameters = ICommandParametersProps<keyof CommandParameters>;

interface CommandParameterProps extends CommandComponentParameters {
  parameterType: string;
}

const CommandParameter = ({ parameterType, parameter, onChange }: CommandParameterProps) => {

  const Component = parameterComponent(
    parameterType
  ) as React.FunctionComponent<CommandComponentParameters>;

  if (!Component) 
    return null;

  return (
    <Component parameter={parameter} onChange={onChange} />
  );
};

export default CommandParameter;
