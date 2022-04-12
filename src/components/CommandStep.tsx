import React from 'react';
import { batch } from 'react-redux';
import { MdMoreVert } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getCurrentCommand, commandSelectors } from '../store/selectors';
import { changeCurrentCommand, copyCommand } from '../store/slices/ui';
import { Command, addCommand, removeCommand, changeCommand, createCommandCopy } from '../store/slices/command';
import { createAppUseStyles } from '../styles';

import ContextMenu from './ContextMenu';
import ContextMenuItem from './ContextMenuItem';
import { useContextMenu } from './utils';

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
        display: "flex",
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
  commandLabel: {
    padding: [theme.spacing(0.5), theme.spacing(1)],
    fontSize: theme.sizes(1.75),
    backgroundColor: "transparent",
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "none",
    cursor: "pointer",
  },
  current: {
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
    borderLeft: ["2px", "solid", theme.palette.primary.main],
    '& $icons': {
      display: "flex",
    },
  },
  icons: {
    display: "none",
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
  const commandCopied = useAppSelector(state => state.ui.commandCopied);
  const dispatch = useAppDispatch();

  const [contextMenu, setContextMenu] = useContextMenu();

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

  const onCommandClick = (event: React.MouseEvent) => {
    event.stopPropagation();
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

  const onCommandContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenu(
      (contextMenu === undefined) ? ({ left: event.clientX, top: event.clientY }) : undefined
    );
  };

  const onMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setContextMenu(
      (contextMenu === undefined) ? ({ left: event.clientX, top: event.clientY }) : undefined
    );
  };

  const onCommandDelete = () => {
    dispatch(removeCommand(command.id));
  };

  const onCommandCopy = () => {
    dispatch(copyCommand(command.id));
  };

  const onCommandPaste = () => {
    const payload = { commandId: commandCopied, index };
    dispatch(createCommandCopy(payload))
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log(listeners);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      { ...attributes } 
      { ...listeners }
      onContextMenu={onCommandContextMenu} 
      onClick={onCommandClick}
    >


      <div className={rootClassName.join(" ")}>
        <span className={styles.index}>{index}</span>
        <input 
          className={styles.commandLabel} 
          value={command.commandType} 
          onChange={onCommandTypeChange}
        />
        <div className={styles.icons}>
          <button onClick={onMoreClick}>
            <MdMoreVert />
          </button>
        </div>

      </div>

      <ContextMenu 
        open={contextMenu !== undefined} 
        position={contextMenu}>
        <ContextMenuItem label={"Copy"} tooltip={"Ctrl + C"} onClick={onCommandCopy} />
        <ContextMenuItem label={"Paste"} tooltip={"Ctrl + V"} onClick={onCommandPaste} />
        <ContextMenuItem label={"Delete"} tooltip={"Ctrl + Del"} onClick={onCommandDelete}/>
      </ContextMenu>

    </div>
  );
}

export default CommandStep;
