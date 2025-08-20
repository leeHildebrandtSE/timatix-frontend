import colors from './colors';
import typography from './typography';
import spacing from './spacing';

export const lightTheme = {
  colors: {
    ...colors,
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: colors.textPrimary,
    textSecondary: colors.textSecondary,
    border: colors.border,
  },
  typography,
  spacing,
};

export const darkTheme = {
  colors: {
    ...colors,
    primary: '#4A9EFF',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textPrimary: '#FFFFFF',
    border: '#333333',
    borderLight: '#2A2A2A',
  },
  typography: {
    ...typography,
    h1: { ...typography.h1, color: '#FFFFFF' },
    h2: { ...typography.h2, color: '#FFFFFF' },
    h3: { ...typography.h3, color: '#FFFFFF' },
    h4: { ...typography.h4, color: '#FFFFFF' },
    h5: { ...typography.h5, color: '#FFFFFF' },
    h6: { ...typography.h6, color: '#FFFFFF' },
    body1: { ...typography.body1, color: '#FFFFFF' },
    body2: { ...typography.body2, color: '#FFFFFF' },
    caption: { ...typography.caption, color: '#B3B3B3' },
    subtitle1: { ...typography.subtitle1, color: '#B3B3B3' },
    subtitle2: { ...typography.subtitle2, color: '#B3B3B3' },
    label: { ...typography.label, color: '#FFFFFF' },
    labelSmall: { ...typography.labelSmall, color: '#FFFFFF' },
    input: { ...typography.input, color: '#FFFFFF' },
  },
  spacing,
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;