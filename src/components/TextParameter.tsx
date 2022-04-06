import React from 'react';
import { ICommandParametersProps } from './utils';

const TextParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'text'>) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = event.target.value;
    onChange(payload)
  };

  return (
    <input 
      placeholder="Text" 
      value={ parameter }
      onChange={ handleChange }
    />
  );
}

export default TextParameter;
