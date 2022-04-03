import { createUseStyles, Styles } from 'react-jss'
import { Classes } from 'jss';
import Color from 'color';

const lighten = (color: string, ratio: number) => Color(color).lighten(ratio).hex();
const darken  = (color: string, ratio: number) => Color(color).darken(ratio).hex();

export const defaultTheme = {
  palette: {
    type: "dark",
    primary:   { main: "#8B9BFD" },
    secondary: { main: "#F5F5F5" },
    background: "#141414"
  },
  typography: {
    fontFamily: 'monospace, ui-monospace'
  },
  shape: {
    borderRadius: 0
  },
  sizeUnit: 8,
  spaceUnit: 8,
  lighten,
  darken
};

interface ColorPalette {
  main: string;
  light?: string;
  dark?: string;
}

const textColorFromBackground = (background: string) => {
  return Color(background).isDark() ? "#ffffff" : "#000000";
}

const createPalette = (palette: ColorPalette, ratio: number = 0.1) => {
  return {
    light: lighten(palette.main, ratio),
    dark: darken(palette.main, ratio),
    text: textColorFromBackground(palette.main),
    ...palette
  }
}

export const createTheme = ({ ...args } = {}) => {

  const theme = { ...defaultTheme, ...args };
  const palette = theme.palette;

  return {
    ...theme,
    sizes: (value: number) => theme.sizeUnit * value,
    spacing: (value: number) => theme.spaceUnit * value,
    typography: {
      fontSize: theme.sizeUnit * 2,
      ...theme.typography
    },
    palette: {
      ...theme.palette,
      primary: createPalette(palette.primary),
      secondary: createPalette(palette.secondary),
      typography: {
        primary: textColorFromBackground(palette.background),
      },
    },
  };
};

export type ThemeType = ReturnType<typeof createTheme>;

/* Interface to avoid having to pass the Theme type to
 * the createUseStyles function
 */
export interface TypedCreateUseStyles<Theme> {
  <C extends string = string, Props = unknown>(
    styles: Styles<C, Props, Theme> | ((theme: Theme) => Styles<C, Props, undefined>),
    options?: undefined
  ): (data?: Props & {theme?: Theme}) => Classes<C>
};

export const createAppUseStyles: TypedCreateUseStyles<ThemeType> = createUseStyles;
