import React from 'react';
import { ICommandParametersProps } from './utils';

import Checkbox from './Checkbox';

const StripParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'strip'>) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = event.target.checked;
    onChange(payload)
  };

  return (
    <Checkbox 
      name="strip" 
      label="Strip extracted text" 
      checked={parameter} 
      onChange={handleChange} 
    />
  );
}

export default StripParameter;
