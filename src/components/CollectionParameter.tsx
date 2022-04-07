import React from 'react';
import { ICommandParametersProps } from './utils';

import Checkbox from './Checkbox';

const CollectionParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'collection'>) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = event.target.checked;
    onChange(payload)
  };

  return (
    <Checkbox 
      name="collection" 
      label="Extract all matches" 
      checked={parameter} 
      onChange={handleChange} 
    />
  );
}

export default CollectionParameter;
