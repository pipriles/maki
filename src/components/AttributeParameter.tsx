import React from 'react';
import { ICommandParametersProps } from './utils';

const AttributeParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'attribute'>) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = event.target.value;
    onChange(payload)
  };

  return (
    <input 
      placeholder="Attribute" 
      value={ parameter }
      onChange={ handleChange }
    />
  );
}

export default AttributeParameter;
