import React from 'react';
import { createAppUseStyles } from '../styles';
import { useAppSelector } from '../store/hooks';
import { getRecipeResults } from '../store/selectors';

import { MdKeyboardArrowUp, MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { AiOutlineExport } from 'react-icons/ai';

const useStyles = createAppUseStyles(theme => ({
  root: {
    flexGrow: 1,
    flexBasis: 30,
    overflow: "auto",
    padding: theme.spacing(1),
  },
  pre: {
    margin: 0,
    fontSize: 12,
  },
  row: {
    display: "flex",
    fontSize: 12,
    borderBottom: [1, "solid", theme.palette.background],
  },
  label: {
    flexGrow: 1,
    flexBasis: "35%",
    minWidth: 200,
    padding: [theme.spacing(.75), theme.spacing(1)],
    backgroundColor: theme.lighten(theme.palette.background, .25),
  },
  value: {
    flexGrow: 2,
    flexBasis: "65%",
    padding: [theme.spacing(.5), theme.spacing(1)],
  },
  bar: {
    display: "flex",
    alignItems: "center",
    background: theme.lighten(theme.palette.background, .5),
  },
  item: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 256,
    fontSize: 12,
    display: "inline-block",
    padding: 4,
  },
  button: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    background: "none",
    color: theme.palette.typography.primary,
    padding: 4,
  },
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
      <div className={styles.bar}>
        <button className={styles.button}>
          <MdKeyboardArrowUp />
        </button>
        <button className={styles.button}>
          <MdKeyboardArrowLeft />
        </button>
        <button className={styles.button}>
          <MdKeyboardArrowRight />
        </button>
        {/* Divider */}
        <span className={styles.item}>
          1 of 345
        </span>
        <span className={styles.item}>
          https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html
        </span>
        {/* Spacer */}
        {/* Divider */}
        <button className={styles.button}>
          JSON
        </button>
        <button className={styles.button}>
          <AiOutlineExport />
        </button>
      </div>
    </>
  );
};

export default RecipeOutput;
