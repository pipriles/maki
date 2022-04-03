import React from 'react';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    '&:hover': {
      backgroundColor: theme.palette.background
    }
  },
  label: {
    fontSize: theme.sizes(1.5),
    padding: theme.spacing(1),
  },
  tooltip: {
    padding: theme.spacing(1),
    fontSize: theme.sizes(1.25),
    color: theme.palette.secondary.dark,
  },
}));

interface ContextMenuItemProps {
  label: string;
  tooltip: React.ReactNode; 
  onClick?: (event?: React.MouseEvent<HTMLDivElement>) => void;
};

const ContextMenuItem = ({ label, tooltip, onClick }: ContextMenuItemProps) => {

  const styles = useStyles();

  return (
    <div className={styles.root} onClick={onClick}>
      <span className={styles.label}>{label}</span>
      <span className={styles.tooltip}>{tooltip}</span>
    </div>
  );
};

export default ContextMenuItem;
