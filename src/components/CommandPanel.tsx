import React from 'react';
import { useAppSelector, } from '../store/hooks';
import { getCurrentCommand } from '../store/selectors';
import { createAppUseStyles } from '../styles';

import CommandInput from './CommandInput';

const useStyles = createAppUseStyles(theme => ({
  root: {
  },
  tabs: {
    display: "flex",
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
  },
  tab: {
    fontSize: theme.sizes(1.75),
    padding: [theme.spacing(1)],
    cursor: "pointer",
    '&:hover': {
      backgroundColor: theme.lighten(theme.palette.background, 0.25),
    }
  },
  currentTab: {
    borderBottom: [2, "solid", theme.palette.primary.main]
  },
  body: {
  }
}));

interface PanelTabsProps {
  value: number;
  onChange: (value: number) => void;
  children: React.ReactNode;
}

const PanelTabs = ({ value, onChange, children }: PanelTabsProps) => {

  const styles = useStyles();

  const handleClick = (index: number) => () => {
    onChange(index);
  };

  const renderChild = (child: React.ReactNode, index: number) => {
    const className = [styles.tab];
    if (index === value) 
      className.push(styles.currentTab);
    return (
      <div className={className.join(' ')} onClick={handleClick(index)}>
        {child}
      </div>
    )
  };

  return (
    <div className={styles.tabs}>
      {React.Children.map(children, renderChild)}
    </div>
  );
};

const CommandPanel = () => {

  const styles = useStyles();
  const command = useAppSelector(getCurrentCommand);
  const [currentTab, setCurrentTab] = React.useState(0);

  if (command === undefined)
    return null;

  const handleChange = (value: number) => {
    setCurrentTab(value)
  };

  return (
    <div className={styles.root}>
      <PanelTabs value={currentTab} onChange={handleChange}>
        <span>Command</span>
        <span>Console</span>
      </PanelTabs>
      <div className={styles.body}>
        <CommandInput command={command} />
      </div>
    </div>
  )
};

export default CommandPanel;
