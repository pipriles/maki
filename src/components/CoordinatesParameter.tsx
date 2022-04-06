import React from 'react';
import { ICommandParametersProps } from './utils';

const CoordinatesParameter = ({ 
  parameter, 
  onChange 
}: ICommandParametersProps<'coordinates'>) => {

  const handleXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeout = parseFloat(event.target.value);
    const payload = { x: isNaN(timeout) ? null : timeout };
    onChange(payload)
  };

  const handleYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeout = parseFloat(event.target.value);
    const payload = { y: isNaN(timeout) ? null : timeout };
    onChange(payload)
  };

  const { x: coordX, y: coordY } = parameter;

  return (
    <div>
      <input 
        placeholder="X" 
        type="number"
        value={ coordX === null ? '' : coordX }
        onChange={ handleXChange }
      />

      <input 
        placeholder="Y" 
        type="number"
        value={ coordY === null ? '' : coordY }
        onChange={ handleYChange }
      />
    </div>
  );
}

export default CoordinatesParameter;
