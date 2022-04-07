import React from 'react';
import { createAppUseStyles } from '../styles';

import AutomationMenu from './AutomationMenu';

const useStyles = createAppUseStyles(theme => ({
  '@global': {
    'body, html, #root': {
      backgroundColor: theme.palette.background,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      color: theme.palette.typography.primary,
      height: "100%",
      margin: 0,
      boxSizing: "border-box",
    },
    p: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.typography.primary
    },
    button: {
      border: 'none',
      outline: 'none',
      fontSize: theme.typography.fontSize,
      padding: [theme.spacing(0.5), theme.spacing(1)],
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.text,
      cursor: "pointer",
      '&:focus, &:hover': {
        border: 'none',
        outline: 'none',
      }
    },
    "*, *:before, *:after": {
      boxSizing: "inherit",
    },
    input: {
      outline: "none",
      border: "none",
      background: "none",
      borderBottom: ["1px", "solid", theme.palette.primary.main],
      color: theme.palette.typography.primary,
      padding: theme.spacing(1),
      fontFamily: theme.typography.fontFamily,
    },
    "*::-webkit-scrollbar": {
      width: 3,
      height: 3,
    },
    "*::-webkit-scrollbar-track": {
      background: theme.palette.background,
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))

const App = () => {

  useStyles();

  return (
    <AutomationMenu />
  );
};

export default App;
