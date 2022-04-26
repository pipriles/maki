import React from 'react';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({
  root: {
    width: "100%",
    position: "relative",
  },
  options: {
    position: "absolute",
    backgroundColor: theme.lighten(theme.palette.background, 0.15),
    listStyle: "none",
    margin: 0,
    padding: 0,
    maxHeight: 200,
    overflow: "auto",
    zIndex: 99,
    bottom: "100%",
    width: "100%",
    // transform: "translateY(-100%)",
  },
  option: {
    fontSize: 12,
    padding: theme.spacing(1),
    cursor: "pointer",
    '&:hover, &:focus': {
      backgroundColor: theme.lighten(theme.palette.background, 0.5),
    }
  }
}));

interface AutocompleteProps {
  value: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Autocomplete = ({ value, options, onChange, className }: AutocompleteProps) => {

  const styles = useStyles();

  const suggestions = options.map(opt => (
    <li key={opt} className={styles.option}>{opt}</li>
  ));

  return (
    <div className={styles.root}>
      <input className={className} value={value} onChange={onChange} />
      <ul className={styles.options}>
        {suggestions}
      </ul>
    </div>
  );
};

export default Autocomplete;
