import React from 'react';
import { Resizable } from 're-resizable';
import { useAppSelector, } from '../store/hooks';
import { getCurrentRecipe } from '../store/selectors';
import { createAppUseStyles } from '../styles';

import RecipeSettings from './RecipeSettings';
import RecipeInput from './RecipeInput';
import RecipeOutput from './RecipeOutput';
import RecipeLog from './RecipeLog';

const useStyles = createAppUseStyles(theme => ({
  root: {
    borderTop: ["1px", "solid", theme.palette.background],
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  tabs: {
    display: "flex",
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
  },
  tab: {
    fontSize: theme.sizes(1.5),
    fontWeight: 600,
    padding: [theme.spacing(0.75), theme.spacing(1.5)],
    minWidth: 60,
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
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
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
  const currentRecipe = useAppSelector(getCurrentRecipe);
  const [currentTab, setCurrentTab] = React.useState(0);

  if (currentRecipe === undefined)
    return null

  const handleChange = (value: number) => {
    setCurrentTab(value)
  };

  return (
    <div className={styles.root}>
      <Resizable 
        defaultSize={{ width: 'auto', height: 200 }} 
        minHeight={126} 
        maxHeight={300}
        enable={{ top: true }}
      >
        <div className={styles.inner}>
          <PanelTabs value={currentTab} onChange={handleChange}>
            <span>Recipe</span>
            <span>Input</span>
            <span>Output</span>
            <span>Log</span>
          </PanelTabs>
          <PanelBody value={currentTab}>
            <RecipeSettings recipe={currentRecipe} />
            <RecipeInput recipe={currentRecipe} />
            <RecipeOutput recipe={currentRecipe} />
            <RecipeLog recipe={currentRecipe} />
          </PanelBody>
        </div>
      </Resizable>
    </div>
  )
};

export default CommandPanel;
