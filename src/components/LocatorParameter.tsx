import React from 'react';
import { createAppUseStyles } from '../styles';
import { ICommandParametersProps } from './utils';

const useStyles = createAppUseStyles(theme => ({
}));

type LocatorParameterProps = ICommandParametersProps<"locator">;

const LocatorParameter = ({ parameter, onChange }: LocatorParameterProps) => {

  const styles = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    const payload = { query };
    onChange(payload)
  };

  const handleLocator = async () => {
    // let response = await locateElement();
    // const query = response.payload
    // const payload = { query }
    // onChange(payload);
  };

  return (
    <div>
      <input 
        placeholder="Query" 
        value={ parameter.query }
        onChange={ handleChange }
      />
      <button 
        onClick={ handleLocator } 
        aria-label="Locate">
        Locate
      </button>
    </div>
  );
}

export default LocatorParameter;

