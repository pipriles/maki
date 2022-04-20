import React from 'react';
import { createAppUseStyles } from '../styles';
import { ICommandParametersProps } from './utils';
import { AiOutlineSelect } from 'react-icons/ai';

import { locateElement } from '../proxy';

const useStyles = createAppUseStyles(theme => ({
  root: {
    display: "flex",
  },
  input: {
    flexGrow: 1,
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.text,
    padding: theme.spacing(0),
    width: theme.sizes(4),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    fontSize: "1.125em",
  }
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
    const response = await locateElement();
    const query = response?.payload
    const payload = { query }
    onChange(payload);
  };

  return (
    <div className={styles.root}>
      <input 
        className={styles.input}
        placeholder="Query" 
        value={ parameter.query }
        onChange={ handleChange }
      />
      <button 
        className={styles.button}
        onClick={ handleLocator } 
        aria-label="Locate">
        <AiOutlineSelect />
      </button>
    </div>
  );
}

export default LocatorParameter;

