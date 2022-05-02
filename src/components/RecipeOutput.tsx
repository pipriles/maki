import React from 'react';
import { createAppUseStyles } from '../styles';
import { useAppSelector } from '../store/hooks';
import { getRecipeResults } from '../store/selectors';

const useStyles = createAppUseStyles(theme => ({
  root: {
    flexGrow: 1,
    flexBasis: 30,
    overflow: "auto",
    padding: [theme.spacing(1), theme.spacing(1.5)],
  },
  pre: {
    margin: 0,
    fontSize: 12,
  }
}));

const RecipeOutput = () => {

  const styles = useStyles();
  const results = useAppSelector(getRecipeResults);

  const recipeResult = JSON.stringify(results, null, 2);

  return (
    <div className={styles.root}>
      <pre className={styles.pre}>
        {recipeResult}
      </pre>
    </div>
  );
};

export default RecipeOutput;
