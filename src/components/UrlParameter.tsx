import React from 'react';
import { ICommandParametersProps } from './utils';

const UrlParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'url'>) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = event.target.value;
    onChange(payload)
  };

  return (
    <input 
      placeholder="URL" 
      value={ parameter }
      onChange={ handleChange }
    />
  );
}

export default UrlParameter;
