import React from 'react';
import { Resizable } from 're-resizable';
import { useAppSelector, } from '../store/hooks';
import { getCurrentCommand } from '../store/selectors';
import { createAppUseStyles } from '../styles';

import CommandInput from './CommandInput';
import CommandLog from './CommandLog';
import CommandOutput from './CommandOutput';

const useStyles = createAppUseStyles(theme => ({
  root: {
    borderTop: ["1px", "solid", theme.palette.background],
  },
  tabs: {
    display: "flex",
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
  },
  tab: {
    fontSize: theme.sizes(1.75),
    padding: [theme.spacing(0.75), theme.spacing(1.5)],
    minWidth: 75,
    textAlign: 'center',
    cursor: "pointer",
    '&:hover': {
      backgroundColor: theme.lighten(theme.palette.background, 0.25),
    }
  },
  currentTab: {
    borderBottom: [2, "solid", theme.palette.primary.main],
  },
  body: {
    // height: 94,
    // maxHeight: 94,
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

interface PanelBodyProps {
  value: number;
  children: React.ReactNode;
}

const PanelBody = ({ value, children }: PanelBodyProps) => {

  const styles = useStyles();
  let body = null;

  React.Children.forEach(children, (child, index) => {
    if (index === value) body = child;
  });

  return (
    <div className={styles.body}>
      {body}
    </div>
  )
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
      <Resizable 
        defaultSize={{ width: 'auto', height: 126 }} 
        minHeight={126} 
        maxHeight={300}
        enable={{ top: true }}
      >
        <PanelTabs value={currentTab} onChange={handleChange}>
          <span>Command</span>
          <span>Log</span>
          <span>Output</span>
        </PanelTabs>
        <PanelBody value={currentTab}>
          <CommandInput command={command} />
          <CommandLog command={command} />
          <CommandOutput command={command} />
        </PanelBody>
      </Resizable>
    </div>
  )
};

export default CommandPanel;
