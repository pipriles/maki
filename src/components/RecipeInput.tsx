import React from 'react';
import { batch } from 'react-redux';
import { MdAdd, MdDeleteOutline } from 'react-icons/md';
import { AiOutlineImport, AiFillDelete } from 'react-icons/ai';
import Papa from 'papaparse';

import { addInput, removeInput, clearInput } from '../store/slices/recipe';
import { useAppDispatch } from '../store/hooks';
import { createAppUseStyles } from '../styles';
import { Recipe } from '../models';
import { isValidHttpUrl } from '../common/utils';

import Toolbar from './Toolbar';

const useStyles = createAppUseStyles(theme => ({
  root: {
    flexGrow: 1,
    flexBasis: 30,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    alignItems: "center",
    minHeight: 25,
    borderBottom: [1, "solid", theme.lighten(theme.palette.background, 0.5)],
    '&:hover': {
      backgroundColor: theme.lighten(theme.palette.background, .25),
      '& $remove': {
        display: "flex",
      }
    },
  },
  url: {
    flexGrow: 1,
    display: "flex",
    padding: [theme.spacing(.75), 0, theme.spacing(1), theme.spacing(1)],
    fontSize: theme.sizes(1.5),
    border: "none",
    width: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  input: {
    flexGrow: 1,
    display: "block",
    padding: 0,
    color: theme.palette.typography.primary,
    border: "none",
  },
  remove: {
    display: "none",
    alignItems: "center",
    padding: theme.spacing(.5),
    background: "none",
    color: theme.palette.typography.primary,
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
  },
}));


interface RecipeInput {
  recipe: Recipe;
};

const RecipeInput = ({ recipe }: RecipeInput) => {

  const dispatch = useAppDispatch();
  const [input, setInput] = React.useState('');
  const styles = useStyles();

  // - Display all urls
  // - Add single url easily
  // - Allow delete url
  // - Allow paste from clipboard
  // Bulk import file
  // Validate url input
  // Use hotkeys to make it faster
  // Use virtual lists to avoid rendering all inputs

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleUrlAdd = () => {
    if (input === '') return;
    const recipeId = recipe.id;
    batch(() => {
      dispatch(addInput({ recipeId, input }));
      setInput('');
    });
  };

  const handleUrlRemove = (index: number) => () => {
    const recipeId = recipe.id;
    dispatch(removeInput({ recipeId, index }));
  };

  const handleClearInput = () => {
    const recipeId = recipe.id;
    dispatch(clearInput(recipeId));
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === "enter") 
      handleUrlAdd();
  };

  const handleInputPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    // if it is text extract urls by delimeter
    // if it is file parse file by type and extract objects
    // console.log(event.clipboardData.files);
    // console.log(event.clipboardData.types);
    // console.log(event.clipboardData.getData('Text'));
    
    const clip = event.clipboardData;
    const data = clip.getData('text/plain');
    const urls = data.split('\n');

    if (urls.length <= 1) return;

    batch(() => {
      const recipeId = recipe.id
      const trimmed = urls.map(url => url.trim())
      trimmed.forEach(input => dispatch(addInput({ recipeId, input })));
      setInput('');
    });

    event.preventDefault();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    Papa.parse(file, { 
      complete: (results) => {
        batch(() => {
          results.data.forEach((row) => {
            if (!Array.isArray(row)) return;

            const column = row[0];
            if (!isValidHttpUrl(column)) return;

            const recipeId = recipe.id;
            const input = column.trim();
            dispatch(addInput({ recipeId, input }));
          });
        });
      }
    });

  };

  const inputs = recipe.inputs;
  const renderInputs = inputs.map((url, index) => {
    return (
      <div className={styles.row} key={index}>
        <span className={styles.url}>{url}</span>
        <button onClick={handleUrlRemove(index)} className={styles.remove}>
          <MdDeleteOutline />
        </button>
      </div>
    );
  })

  return (
    <>
      <div className={styles.root}>
        {renderInputs}
      </div>

      <Toolbar>
        <Toolbar.ToolbarItem style={{ flexGrow: 1 }}>
          <input 
            className={styles.input} 
            type="text" 
            placeholder="Enter a URL"
            onChange={handleChange}
            onKeyDown={handleInputKeyDown}
            onPaste={handleInputPaste}
            value={input} />
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarDivider />

        <Toolbar.ToolbarItem>
          <button 
            onClick={handleUrlAdd} 
            className={styles.button} 
            style={{ fontSize: 18 }}
            title="Add URL">
            <MdAdd />
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem>
          <button 
            onClick={handleClearInput} 
            className={styles.button} 
            style={{ fontSize: 16 }}
            title="Clear URLs">
            <AiFillDelete />
          </button>
        </Toolbar.ToolbarItem>

        <Toolbar.ToolbarItem padding="4px 6px">
          <label htmlFor="import-file" className={styles.button} title="Import">
            <AiOutlineImport />
          </label>
          <input 
            type="file" 
            id="import-file" 
            name="import-file" 
            accept=".csv"
            hidden
            onChange={handleImport} />
        </Toolbar.ToolbarItem>

      </Toolbar>
    </>
  );
};

export default RecipeInput;
