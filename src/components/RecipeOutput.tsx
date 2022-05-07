import React from 'react';
import { createAppUseStyles } from '../styles';
import { useAppSelector } from '../store/hooks';
import { getRecipeResults } from '../store/selectors';

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
    maxWidth: 400,
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

const RecipeOutput = () => {

  const styles = useStyles();
  // const results = useAppSelector(getRecipeResults);

  const results = [
    ['Name', 'Uzumaki'],
    ['Price', '$29.9'],
    ['Author', 'Junji Ito'],
    ['Description', 'Uzumaki is a Japanese horror manga series written and illustrated by Junji Ito. Appearing as a serial in the weekly seinen manga magazine Big Comic Spirits from 1998 to 1999, the chapters were compiled into three bound volumes by Shogakukan and published from August 1998 to September 1999.'],
    ['Date', '1999'],
    ['Genre', 'Horror'],
  ]

  const recipeResult = results?.map(row => {
    const [label, value] = row;
    return (
      <div className={styles.row}>
        <div className={styles.label}>{label}</div>
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
          <button className={styles.button}>
            <MdKeyboardArrowLeft />
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem>
          <button className={styles.button}>
            <MdKeyboardArrowRight />
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarDivider />

        <Toolbar.ToolbarItem>
          <span className={styles.text}>
            1 of 345
          </span>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem>
          <span className={styles.text}>
            https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html
          </span>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarSpacer />
        <Toolbar.ToolbarDivider />

        <Toolbar.ToolbarItem>
          <button className={styles.button} style={{fontSize: 12}} aria-label="Format">
            JSON
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
