import React from 'react';
import { createAppUseStyles } from '../styles';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getRecipeDataFields, getActiveTab } from '../store/selectors';
import { changeRecipe } from '../store/slices/recipe';
import { Recipe } from '../models';

import { MdKeyboardArrowUp, MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { AiOutlineExport } from 'react-icons/ai';

import Toolbar from './Toolbar';

const useStyles = createAppUseStyles(theme => ({
  root: {
    flexGrow: 1,
    flexBasis: 30,
    overflow: "auto",
  },
  pre: {
    margin: 0,
    fontSize: 12,
  },
  row: {
    display: "flex",
    fontSize: 12,
    borderBottom: [1, "solid", theme.lighten(theme.palette.background, .15)],
  },
  label: {
    flexGrow: 1,
    flexBasis: 200,
    minWidth: 200,
    width: "50%",
    padding: [theme.spacing(.75), theme.spacing(1)],
    backgroundColor: theme.lighten(theme.palette.background, .15),
  },
  value: {
    flexGrow: 2,
    flexBasis: "65%",
    padding: [theme.spacing(.5), theme.spacing(1)],
  },
  text: {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 320,
  },
  button: {
    display: "flex",
    background: "none",
    color: theme.palette.typography.primary,
    padding: 0,
    fontSize: 20,
    '&:hover': {
      color: theme.palette.primary.main,
    }
  }
}));

interface RecipeOutputProps {
  recipe: Recipe;
}

const RecipeOutput = ({ recipe }: RecipeOutputProps) => {

  const styles = useStyles();
  const dispatch = useAppDispatch();
  const fields = useAppSelector(getRecipeDataFields);
  const activeTab = useAppSelector(getActiveTab);

  const [index, setIndex] = React.useState(0);

  const currentResult = recipe.output[index];
  const resultLabel = currentResult?.label ?? activeTab?.url;
  const resultState = currentResult ? `${index+1} of ${recipe.output.length}` : '';

  const onPreviousClick = () => {
    if (recipe.output.length > 0) {
      const next = index === 0 ? recipe.output.length-1 : index-1;
      setIndex(next);
    }
  };

  const onNextClick = () => {
    if (recipe.output.length > 0) {
      const next = (index + 1) % recipe.output.length;
      setIndex(next);
    }
  };

  const handleFormatClick = () => {
    const format: Recipe['exportFormat'] = recipe.exportFormat === 'JSON' ? 'CSV' : 'JSON';
    const payload = { id: recipe.id, changes: { exportFormat: format } };
    dispatch(changeRecipe(payload));
  }

  const recipeResult = fields?.map(([id, field]) => {
    const value = currentResult?.data[id];
    return (
      <div className={styles.row} key={id}>
        <div className={styles.label}>{field}</div>
        <div className={styles.value}>{JSON.stringify(value, null, 2)}</div>
      </div>
    );
  });

  return (
    <>
      <div className={styles.root}>
        {recipeResult}
      </div>
      <Toolbar>

        <Toolbar.ToolbarItem>
          <button className={styles.button}>
            <MdKeyboardArrowUp />
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem>
          <button onClick={onPreviousClick} className={styles.button}>
            <MdKeyboardArrowLeft />
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem>
          <button onClick={onNextClick} className={styles.button}>
            <MdKeyboardArrowRight />
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarDivider />

        <Toolbar.ToolbarItem>
          <span className={styles.text}>
            {resultState}
          </span>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem>
          <span className={styles.text}>
            {resultLabel}
          </span>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarSpacer />
        <Toolbar.ToolbarDivider />

        <Toolbar.ToolbarItem>
          <button 
            onClick={handleFormatClick}
            className={styles.button} 
            style={{fontSize: 12}} 
            aria-label="Format">
            {recipe.exportFormat}
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem padding="4px 6px">
          <button className={styles.button} title="Export" aria-label="Export">
            <AiOutlineExport />
          </button>
        </Toolbar.ToolbarItem>

      </Toolbar>
    </>
  );
};

export default RecipeOutput;
