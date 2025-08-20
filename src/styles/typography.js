import { Platform } from 'react-native';
import colors from './colors';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  
  // Body text
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  
  // Caption and small text
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily,
    color: colors.white,
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily,
    color: colors.white,
    lineHeight: 18,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  
  // Input text
  input: {
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  
  // Error text
  error: {
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily,
    color: colors.error,
    lineHeight: 16,
  },
};

export default typography;