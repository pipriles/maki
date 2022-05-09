import React from 'react';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({
  root: {
    display: "flex",
  },
  inner: {
    flex: 1,
    width: 0,
    display: "flex",
    alignItems: "center",
    background: theme.lighten(theme.palette.background, .5),
    overflow: "auto",
  },
  item: {
    display: "block",
    padding: 4,
    fontSize: 12,
  },
  divider: {
    paddingLeft: theme.spacing(.5),
    marginLeft: theme.spacing(.5),
    borderLeft: [1, "solid", theme.darken(theme.palette.typography.primary, 0.75)],
    display: "block",
    height: "50%",
  },
  spacer: {
    flexGrow: 1,
    display: "block",
  },
}));

interface ToolbarItemProps {
  fontSize?: React.CSSProperties['fontSize'];
  padding?: React.CSSProperties['padding'];
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const ToolbarItem = ({ 
  children, 
  fontSize, 
  padding,
  style 
}: ToolbarItemProps) => {

  const styles = useStyles();
  const customStyles: React.CSSProperties = { fontSize, padding, ...style };

  return (
    <div className={styles.item} style={customStyles}>
      {children}
    </div>
  )
};

interface ToolbarDividerProps {
  height?: React.CSSProperties['height'];
};

export const ToolbarDivider = ({ height }: ToolbarDividerProps) => {

  const styles = useStyles();

  return (
    <span className={styles.divider} style={{ height }} />
  );
};

export const ToolbarSpacer = () => {

  const styles = useStyles();

  return (
    <span className={styles.spacer} />
  );
};

interface ToolbarProps {
  children: React.ReactNode;
}

export const Toolbar = ({ children }: ToolbarProps) => {

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        { children }
      </div>
    </div>
  );
};

Toolbar.ToolbarSpacer = ToolbarSpacer;
Toolbar.ToolbarDivider = ToolbarDivider;
Toolbar.ToolbarItem = ToolbarItem;

export default Toolbar;
