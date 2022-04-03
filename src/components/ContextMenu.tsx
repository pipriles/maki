import React from 'react';
import { createAppUseStyles } from '../styles';

const useStyles = createAppUseStyles(theme => ({
  root: {
    position: "fixed",
    maxWidth: 200,
    width: "100%",
    backgroundColor: theme.lighten(theme.palette.background, 0.5),
    boxShadow: [0, 10, 20, -8, "black"],
    display: "block",
    opacity: 0,
    visibility: "hidden",
    zIndex: 1,
  },
  show: {
    visibility: "visible",
    opacity: 1,
  },
}));

interface ContextMenuPosition {
  top: number;
  left: number;
}

interface ContextMenuProps {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  position?: ContextMenuPosition;
};

const ContextMenu = ({ children, className, open, position }: ContextMenuProps) => {

  const element = React.useRef<HTMLDivElement>(null);
  const [width, height] = useDimensions(element);
  const styles = useStyles();
  const rootClassName = [className ?? styles.root];
  const elementPosition = { left: 'unset', top: 'unset' };

  if (open)
    rootClassName.push(styles.show);

  if (position !== undefined && element && element.current) {
    elementPosition.left = `min(${position.left}px, calc(100% - ${width}px))`;
    elementPosition.top = `min(${position.top}px, calc(100% - ${height}px))`;
  }

  console.log(width, height);

  return (
    <div ref={element} className={rootClassName.join(" ")} style={elementPosition}>
      {children}
    </div>
  );
};

const useDimensions = (ref: React.RefObject<HTMLElement>) => {

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

export default ContextMenu;
