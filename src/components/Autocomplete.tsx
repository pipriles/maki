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
    boxShadow: "0 0 15px -10px black",
  },
  option: {
    fontSize: 12,
    padding: theme.spacing(1),
    cursor: "pointer",
    '&:hover, &:focus': {
      backgroundColor: theme.lighten(theme.palette.background, 0.5),
    }
  },
  current: {
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
  },
}));

interface AutocompleteProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

const Autocomplete = ({ value, options, onChange, className }: AutocompleteProps) => {

  const styles = useStyles();

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);

  const filteredOptions = options.filter(opt => opt.startsWith(value.toUpperCase()))
  console.log(options);
  console.log(filteredOptions);

  const handleFocus = (_event: React.FocusEvent) => {
    setOpen(true);
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.relatedTarget?.classList.contains(styles.option))
      setOpen(false);
  };

  const onElementClick = (value: string) => (_event: React.MouseEvent) => {
    onChange(value);
    setOpen(false);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    setOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key == "ArrowDown") {
      const next = (selected + 1) % filteredOptions.length;
      setSelected(next)
      event.preventDefault();
    }

    else if (event.key == "ArrowUp") {
      const next = (selected === 0 ? filteredOptions.length - 1: selected - 1);
      setSelected(next)
      event.preventDefault();
    }

    else if (event.key == "Enter") {
      setOpen(false);
      onChange(filteredOptions[selected]);
      setSelected(0);
    }

    else if (event.key == "Tab") {
      const next = (selected + 1) % filteredOptions.length;
      setSelected(next);
      event.preventDefault();
    }
  };

  let renderSuggestions = null;

  if (open && filteredOptions.indexOf(value) === -1) {
    renderSuggestions = (
      <ul className={styles.options}>
        {filteredOptions.map((opt, index) => {
          const currentOption = opt === value || index == selected;
          const classNames = [styles.option];

          if (currentOption) 
            classNames.push(styles.current);

          const handleRef = (element: HTMLLIElement) => {
            if (index === selected) 
              element?.scrollIntoView(false);
          }

          return (
            <li 
              ref={handleRef}
              tabIndex={-1}
              key={opt} 
              className={classNames.join(' ')} 
              onClick={onElementClick(opt)}>
              {opt}
            </li>
          )
        })}
      </ul>
    );
  }

  return (
    <div className={styles.root}>
      <input 
        className={className} 
        value={value}
        onChange={onInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {renderSuggestions}
    </div>
  );
};

export default Autocomplete;
