import React from 'react';
import { CommandParameters } from '../store/slices/command';
import { setContextMenu } from '../store/slices/ui';
import { useAppSelector, useAppDispatch } from '../store/hooks';

export interface ICommandParametersProps<T extends keyof CommandParameters> {
  parameter: CommandParameters[T];
  onChange: (payload: Partial<CommandParameters[T]>) => void;
}

export const hasOwnProperty = <X extends {}>(obj: X, key: PropertyKey): key is keyof X => {
  return obj.hasOwnProperty(key);
}

export const useContextMenu = () => {

  const contextMenu = useAppSelector(state => state.ui.contextMenu);
  const dispatch = useAppDispatch();

  const handleClick = React.useCallback(() => {
    if (contextMenu?.command !== undefined) 
      dispatch(setContextMenu({ command: undefined }));
  }, [dispatch, contextMenu]);

  React.useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return contextMenu;
};

export const useDimensions = (ref: React.RefObject<HTMLElement>) => {

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  const computeDimensions = () => {
    if (ref && ref.current) {
      setWidth(ref.current.clientWidth);
      setHeight(ref.current.clientWidth);
    }
  };

  React.useEffect(() => {
    computeDimensions();
  }, [ref]);

  React.useEffect(() => {
    window.addEventListener("resize", computeDimensions);
    return () => {
      window.removeEventListener("resize", computeDimensions);
    };
  }, []);

  return [width, height] as const;
};
