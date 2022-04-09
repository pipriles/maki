import React from 'react';
import { CommandParameters } from '../store/slices/command';

export interface ICommandParametersProps<T extends keyof CommandParameters> {
  parameter: CommandParameters[T];
  onChange: (payload: Partial<CommandParameters[T]>) => void;
}

export const hasOwnProperty = <X extends {}>(obj: X, key: PropertyKey): key is keyof X => {
  return obj.hasOwnProperty(key);
}

export const useContextMenu = () => {

  const [contextMenu, setContextMenu] = React.useState<{
    left: number;
    top: number;
  } | undefined>(undefined);

  const handleContextMenu = React.useCallback(() => {
    if (contextMenu !== undefined) setContextMenu(undefined);
  }, [contextMenu]);

  const handleClick = React.useCallback(() => {
    if (contextMenu !== undefined) setContextMenu(undefined);
  }, [contextMenu]);

  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return [contextMenu, setContextMenu] as const;
};
