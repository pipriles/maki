import React from 'react';
import { ICommandParametersProps } from './utils';

const TimeoutParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'timeout'>) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeout = parseInt(event.target.value);
    const payload = isNaN(timeout) || timeout < 0 ? 1000 : timeout;
    onChange(payload)
  };

  return (
    <input 
      placeholder="Timeout" 
      value={parameter}
      onChange={ handleChange }
    />
  );
}

export default TimeoutParameter;

