import React from 'react';

import { useAppDispatch } from '../store/hooks';
import { Recipe, changeRecipe } from '../store/slices/recipe';
import { createAppUseStyles } from '../styles';

import Autocomplete from './Autocomplete';

const useStyles = createAppUseStyles((theme) => ({
  root: {
    backgroundColor: theme.lighten(theme.palette.background, 0.15),
    borderTop: ["1px", "solid", theme.lighten(theme.palette.background, 1)],
  },
  group: {
    display: "flex",
  },
  label: {
    padding: [theme.spacing(1), theme.spacing(1), theme.spacing(1), theme.spacing(1.5)],
    fontSize: theme.sizes(1.5),
    flexBasis: 120,
    flexShrink: 0,
  },
  input: {
    backgroundColor: theme.palette.background,
    border: "none",
    width: "100%",
  },
}));

export interface RecipeInputProps {
  recipe: Recipe;
}

export const RecipeInput = ({ recipe }: RecipeInputProps) => {

  const dispatch = useAppDispatch();
  const styles = useStyles();

  if (recipe === undefined)
    return null;

  const onRecipeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: recipe.id, changes: { name: event.target.value } }
    dispatch(changeRecipe(payload))
  };

  const onRecipeDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: recipe.id, changes: { description: event.target.value } }
    dispatch(changeRecipe(payload))
  };

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <span className={styles.label}>Name</span>
        <input 
          className={styles.input} 
          value={recipe.name} 
          onChange={onRecipeNameChange}
        />
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Description</span>
        <input 
          className={styles.input} 
          value={recipe.description} 
          onChange={onRecipeDescriptionChange}
        />
      </div>
    </div>
  );
};

export default RecipeInput;
