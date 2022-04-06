import React from 'react';
import { ICommandParametersProps } from './utils';

const StripParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'strip'>) => {

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
        name="strip" 
        value="strip" 
        onChange={handleChange}
      />
      <label htmlFor="strip">Strip extracted text</label>
    </div>
  );
}

export default StripParameter;
