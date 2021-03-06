import React from 'react';
import { batch } from 'react-redux';
import { MdMoreVert } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentCommand, commandSelectors } from '../store/selectors';
import { changeCurrentCommand, setContextMenu } from '../store/slices/ui';
import { addCommand, changeCommand } from '../store/slices/command';
import { Command } from '../models';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({
  command: {
    display: "flex",
    cursor: "pointer",
    backgroundColor: theme.lighten(theme.palette.background, 0.15),
    borderLeft: ["2px", "solid", theme.lighten(theme.palette.background, 0.5)],
    borderBottom: ["1px", "solid", theme.lighten(theme.palette.background, 0.5)],
    '&:hover': {
      backgroundColor: theme.lighten(theme.palette.background, 0.5),
      '& > $icons': {
        visibility: "visible",
      },
    },
  },
  index: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    width: 30,
    padding: [theme.spacing(1), theme.spacing(0.5)],
    fontSize: theme.sizes(1.5),
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
  },
  input: {
    padding: [theme.spacing(0.5), theme.spacing(1)],
    fontSize: theme.sizes(1.75),
    backgroundColor: "transparent",
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "none",
    cursor: "pointer",
  },
  commandLabel: {
    display: "flex",
    width: "100%",
  },
  commandField: {
    display: "flex",
    width: "100%",
    position: "relative",
    "&:before": {
      content: "''",
      display: 'block',
      position: "absolute",
      width: 1,
      height: "50%",
      top: "50%",
      left: 0,
      transform: "translateY(-50%)",
      backgroundColor: theme.lighten(theme.palette.background, 0.75),
    }
  },
  current: {
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
    '& $icons': {
      display: "flex",
    },
  },
  running: {
    borderLeft: ["2px", "solid", theme.palette.primary.main],
  },
  done: {
    borderLeft: ["2px", "solid", "#8bfd8d"],
  },
  error: {
    borderLeft: ["2px", "solid", "#fd8b8b"],
  },
  icons: {
    visibility: "hidden",
    display: "flex",
    '& > button': {
      background: "none",
      color: theme.palette.typography.primary,
      display: "flex",
      alignItems: "center",
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  },
  hidden: {
    opacity: 0,
    '&:hover': {
      opacity: 1,
    },
    '& $icons': {
      display: ["none", "!important"],
    },
  }
}));

interface CommandStepProps {
  command: Command;
  index: number;
}

const CommandStep = ({ command, index }: CommandStepProps) => {

  const commands = useAppSelector(commandSelectors.selectAll);
  const currentCommand = useAppSelector(getCurrentCommand);
  const dispatch = useAppDispatch();

  const styles = useStyles();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: command.id});

  const rootClassName = [styles.command] 

  if (command.id === currentCommand?.id)
    rootClassName.push(styles.current);

  if (index >= commands.length)
    rootClassName.push(styles.hidden);

  if (command.commandStatus)
    rootClassName.push(styles[command.commandStatus]);

  const onCommandClick = () => {

    if ( document.activeElement instanceof HTMLInputElement 
      && currentCommand?.id !== command.id )
      document.activeElement.blur();

    if (index >= commands.length) {
      batch(() => {
        dispatch(addCommand(command));
        dispatch(changeCurrentCommand(command.id));
      });
    } else {
      dispatch(changeCurrentCommand(command.id));
    }
  };

  const onCommandTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: command.id, commandType: event.target.value };
    dispatch(changeCommand(payload));
  };

  const onCommandFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = { id: command.id, field: event.target.value };
    dispatch(changeCommand(payload));
  };

  const onCommandContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    dispatch(setContextMenu({ command: command.id, left: event.clientX, top: event.clientY }));
  };

  const onMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    dispatch(setContextMenu({ command: command.id, left: event.clientX, top: event.clientY }));
  };

  const onInputMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
    if (currentCommand?.id !== command.id)
      event.preventDefault();
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      { ...attributes } 
      { ...listeners }>

      <div 
        className={rootClassName.join(" ")} 
        onContextMenu={onCommandContextMenu} 
        onClick={onCommandClick}>
        <span className={styles.index}>
          {index}
        </span>
        <div className={styles.commandLabel}>
          <input 
            className={styles.input} 
            value={command.commandType} 
            onChange={onCommandTypeChange}
            onMouseDown={onInputMouseDown}
          />
        </div>
        <div className={styles.commandField}>
          <input 
            className={styles.input} 
            value={command.field} 
            onChange={onCommandFieldChange}
            onMouseDown={onInputMouseDown}
          />
        </div>
        <div className={styles.icons}>
          <button onClick={onMoreClick}>
            <MdMoreVert />
          </button>
        </div>

      </div>

    </div>
  );
}

export default CommandStep;
