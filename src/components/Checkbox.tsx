import React from 'react';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({

  checkbox: {
    position: "relative",
    appearance: "none",
    margin: 0,
    padding: 0,
    width: theme.sizes(2.5),
    height: theme.sizes(2.5),
    border: "none",
    cursor: "pointer",
    backgroundColor: theme.lighten(theme.palette.background, 1),
    color: theme.palette.primary.main,
    display: "inline-block",
    verticalAlign: "middle",

    '&[type="checkbox"]::before': {
      content: "''",
      position: "absolute",
      display: "block",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: theme.sizes(1.25),
      height: theme.sizes(1.25),
      fontSize: theme.sizes(1.25),
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      visibility: "hidden",
    },

    '&[type="checkbox"]:checked::before': {
      visibility: "visible",
    },
  },

  label: {
    display: "inline-block",
    marginLeft: theme.spacing(1),
    verticalAlign: "middle",
    fontSize: theme.sizes(1.5),
  }
}));

interface CheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ name, label, checked, onChange }: CheckboxProps) => {

  const styles = useStyles();

  return (
    <div>
      <input 
        className={styles.checkbox}
        type="checkbox" 
        checked={checked} 
        name={name}
        value={name}
        onChange={onChange} />
      <label 
        className={styles.label} 
        htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
