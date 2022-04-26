import React from 'react';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({
  root: {
    position: "relative",
    width: "100%",
  },
  options: {
    position: "fixed",
    backgroundColor: theme.lighten(theme.palette.background, 0.15),
    listStyle: "none",
    margin: 0,
    padding: 0,
    height: 200,
    overflow: "auto",
  },
  option: {
    fontSize: 12,
    padding: theme.spacing(1),
  }
}));

interface AutocompleteProps {
  value: string;
  options: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Autocomplete = ({ value, options, onChange, className }: AutocompleteProps) => {

  const element = React.useRef<HTMLInputElement>(null);
  const styles = useStyles();

  const suggestions = options.map(opt => (
    <li key={opt} className={styles.option}>{opt}</li>
  ));

  const rect = element.current?.getBoundingClientRect();
  const boxStyles = { top: rect?.top ?? 'unset', transform: "translateY(-100%)" }

  return (
    <div className={styles.root}>
      <input 
          ref={element}
          className={className} 
          value={value}
          onChange={onChange}
        />
        <ul className={styles.options} style={boxStyles}>
          {suggestions}
        </ul>
    </div>
  );
};

export default Autocomplete;
