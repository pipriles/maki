import React from 'react';
import { createAppUseStyles } from '../styles';
import { Recipe } from '../models';

const useStyles = createAppUseStyles(theme => ({
  root: {
  },
}));


interface RecipeInput {
  recipe: Recipe;
};

const RecipeInput = ({ recipe }: RecipeInput) => {

  const styles = useStyles();

  // Display all urls
  // Add single url easily
  // Allow delete url
  // Use hotkeys to make it faster
  // Bulk import file
  // Allow past from clipboard

  return (
    <div className={styles.root}>
    </div>
  );
};

export default RecipeInput;
