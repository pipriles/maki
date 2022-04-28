import React from 'react';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({
  root: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    border: "none",
    borderBottom: [1, "solid", theme.lighten(theme.palette.background, 2)],
    margin: theme.spacing(1),
  },
}));

const ContextMenuDivider = () => {

  const styles = useStyles();

  return (
    <hr className={styles.root} />
  );
};

export default ContextMenuDivider;
