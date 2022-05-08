import React from 'react';
import { createAppUseStyles } from '../styles';
import { Recipe } from '../models';

const useStyles = createAppUseStyles(theme => ({
  root: {
    flexGrow: 1,
    flexBasis: 30,
    overflow: "auto",
  },
  message: {
    display: "block",
    padding: [theme.spacing(1), theme.spacing(1.5)],
    fontSize: theme.sizes(1.5),
    '&:hover': {
      backgroundColor: theme.lighten(theme.palette.background, 0.25),
    }
  }
}));

interface RecipeLogProps {
  recipe: Recipe;
}

const RecipeLog = ({ recipe }: RecipeLogProps) => {

  const styles = useStyles();

  const recipeLogger = recipe.logger ?? []
  const messages = recipeLogger.map((msg, index) => (
    <span className={styles.message} key={index}>
      {msg}
    </span>
  ))

  return (
    <div className={styles.root}>
      {messages}
    </div>
  )
};

export default RecipeLog;
