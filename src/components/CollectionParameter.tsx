import React from 'react';
import { ICommandParametersProps } from './utils';

const CollectionParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'collection'>) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = event.target.checked;
    console.log(payload);
    onChange(payload)
  };

  return (
    <div>
      <input 
        type="checkbox" 
        checked={parameter} 
        name="collection" 
        value="collection" 
        onChange={handleChange}
      />
      <label htmlFor="collection">Extract all matches</label>
    </div>
  );
}

export default CollectionParameter;
