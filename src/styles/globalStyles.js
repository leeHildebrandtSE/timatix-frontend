// src/styles/globalStyles.js - SINGLE ENTRY POINT FOR ALL STYLES
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// =============================================================================
// DESIGN TOKENS
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const sizing = {
  buttonHeight: 52,
  inputHeight: 44,
  headerHeight: 64,
  cardPadding: 16,
  sectionSpacing: 32,
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  }
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  }
};

// =============================================================================
// COLOR SYSTEM
// =============================================================================

export const lightColors = {
  // Brand Colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4A9EFF',
  secondary: '#4CAF50',
  secondaryDark: '#388E3C',
  secondaryLight: '#81C784',
  
  // Status Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Surface Colors
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  
  // Text Colors
  text: '#1C1C1E',
  textSecondary: '#6C7B7F',
  textLight: '#8E8E93',
  
  // Border Colors
  border: '#E5E5EA',
  separator: '#C6C6C8',
  placeholder: '#C7C7CC',
  
  // Utility Colors
  disabled: '#F2F2F7',
  overlay: 'rgba(0,0,0,0.4)',
  backdrop: 'rgba(0,0,0,0.3)',
  
  // Status Badge Colors (consolidated from your colors.js)
  pending: '#FF9500',
  inProgress: '#007AFF',
  completed: '#4CAF50',
  cancelled: '#FF3B30',
};

export const darkColors = {
  // Brand Colors
  primary: '#0A84FF',
  primaryDark: '#0056CC',
  primaryLight: '#4A9EFF',
  secondary: '#FF9F0A',
  secondaryDark: '#FF8C00',
  secondaryLight: '#FFB84A',
  
  // Status Colors
  success: '#32D74B',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',
  
  // Surface Colors
  background: '#000000',
  surface: '#1C1C1E',
  card: '#1C1C1E',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textLight: '#8E8E93',
  
  // Border Colors
  border: '#38383A',
  separator: '#48484A',
  placeholder: '#48484A',
  
  // Utility Colors
  disabled: '#1C1C1E',
  overlay: 'rgba(0,0,0,0.6)',
  backdrop: 'rgba(0,0,0,0.5)',
  
  // Status Badge Colors
  pending: '#FF9F0A',
  inProgress: '#0A84FF',
  completed: '#32D74B',
  cancelled: '#FF453A',
};

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const createTypography = (isDark) => ({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily,
    color: isDark ? darkColors.textSecondary : lightColors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily,
    color: isDark ? darkColors.textSecondary : lightColors.textSecondary,
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    fontFamily,
    color: isDark ? darkColors.text : lightColors.text,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily,
  },
  error: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily,
    color: isDark ? darkColors.error : lightColors.error,
  },
});

// =============================================================================
// LAYOUT UTILITIES
// =============================================================================

export const layout = {
  flex1: { flex: 1 },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  center: { alignItems: 'center', justifyContent: 'center' },
  centerHorizontal: { alignItems: 'center' },
  centerVertical: { justifyContent: 'center' },
  spaceBetween: { justifyContent: 'space-between' },
  spaceAround: { justifyContent: 'space-around' },
  alignStart: { alignItems: 'flex-start' },
  alignEnd: { alignItems: 'flex-end' },
};

// =============================================================================
// RESPONSIVE UTILITIES
// =============================================================================

export const responsive = {
  isSmallScreen: width < 375,
  isMediumScreen: width >= 375 && width < 414,
  isLargeScreen: width >= 414,
  screenWidth: width,
  screenHeight: height,
  
  getSpacing: (size) => {
    const multiplier = width < 375 ? 0.8 : width > 414 ? 1.2 : 1;
    return spacing[size] * multiplier;
  },
  
  getFontSize: (size) => {
    const multiplier = width < 375 ? 0.9 : width > 414 ? 1.1 : 1;
    return size * multiplier;
  }
};

// =============================================================================
// STYLE UTILITIES
// =============================================================================

export const mixins = {
  // Center content
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Absolute positioning helpers
  absoluteFill: StyleSheet.absoluteFillObject,
  absoluteTop: (top = 0) => ({
    position: 'absolute',
    top,
    left: 0,
    right: 0,
  }),
  absoluteBottom: (bottom = 0) => ({
    position: 'absolute',
    bottom,
    left: 0,
    right: 0,
  }),
  
  // Spacing utilities
  margin: (value) => ({ margin: value }),
  marginHorizontal: (value) => ({ marginHorizontal: value }),
  marginVertical: (value) => ({ marginVertical: value }),
  padding: (value) => ({ padding: value }),
  paddingHorizontal: (value) => ({ paddingHorizontal: value }),
  paddingVertical: (value) => ({ paddingVertical: value }),
  
  // Border utilities
  border: (width = 1, color = '#E0E0E0') => ({
    borderWidth: width,
    borderColor: color,
  }),
  borderRadius: (radius) => ({ borderRadius: radius }),
};

// =============================================================================
// STATUS & PRIORITY HELPERS
// =============================================================================

export const getStatusColor = (status, colors) => {
  const statusColors = {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    pending: colors.pending,
    completed: colors.completed,
    cancelled: colors.cancelled,
    active: colors.primary,
  };
  return statusColors[status?.toLowerCase()] || colors.textSecondary;
};

export const getPriorityColor = (priority, colors) => {
  const priorityColors = {
    urgent: colors.error,
    high: '#FF8C00',
    normal: colors.primary,
    low: colors.textSecondary,
  };
  return priorityColors[priority?.toLowerCase()] || colors.textSecondary;
};

// =============================================================================
// GLOBAL STYLES FACTORY
// =============================================================================

export const createGlobalStyles = (theme) => StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...theme.typography.h3,
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: spacing.lg,
  },

  // Welcome header (common in dashboards)
  welcomeHeader: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: sizing.borderRadius.xxl,
    borderBottomRightRadius: sizing.borderRadius.xxl,
    ...shadows.medium,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
    marginRight: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: '#fff',
  },
  subGreeting: {
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.8)',
  },

  // Section styles
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: sizing.sectionSpacing,
  },
  sectionWithBackground: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: theme.colors.surface,
  },
  sectionTitle: {
    ...theme.typography.h5,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  // Quick actions (common pattern)
  quickActionsContainer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: sizing.sectionSpacing,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: sizing.borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Metrics grid (common in dashboards)
  metricsContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: sizing.sectionSpacing,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
  },
  largeCard: {
    minWidth: '100%',
  },

  // Filter styles (common in lists)
  filters: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    height: sizing.inputHeight,
    borderRadius: sizing.borderRadius.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  filterChips: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: spacing.sm,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipTextActive: {
    color: '#fff',
  },

  // List styles
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  listCount: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  listCountText: {
    ...theme.typography.body2,
    opacity: 0.7,
  },

  // Card styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...theme.typography.h6,
    flex: 1,
    marginRight: spacing.md,
  },
  cardSubtitle: {
    ...theme.typography.body2,
    opacity: 0.8,
    marginBottom: spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    gap: spacing.sm,
  },

  // Empty states
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.xxxl * 1.5,
    alignItems: 'center',
    marginTop: 60,
    marginHorizontal: spacing.xl,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...theme.typography.body2,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  emptyStateButton: {
    paddingHorizontal: spacing.xxl,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    ...theme.typography.h4,
    flex: 1,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.xl,
  },

  // Form styles
  formSection: {
    marginBottom: spacing.xxl,
  },
  formGroup: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },

  // Button styles
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },

  // Utility styles
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.border,
    opacity: 0.3,
    marginVertical: spacing.lg,
  },
  spacer: {
    height: spacing.lg,
  },
  spacerLarge: {
    height: spacing.xxxl,
  },
  textCenter: {
    textAlign: 'center',
  },
  opacity70: {
    opacity: 0.7,
  },
  opacity60: {
    opacity: 0.6,
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...theme.typography.h6,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: spacing.xxl,
  },

  // ENHANCED FILTER SYSTEM
  // =====================
  
  // Filter containers
  filtersContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  filtersScrollContainer: {
    paddingHorizontal: spacing.xl,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChipsScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },

  // Base filter chip styles
  filterChipBase: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },

  // Size variants
  filterChipSmall: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  filterChipMedium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  filterChipLarge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
  },

  // Variant styles
  filterChipDefault: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  filterChipDefaultActive: {
    backgroundColor: theme.colors.primary + '15',
    borderColor: theme.colors.primary,
  },
  
  filterChipOutline: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  },
  filterChipOutlineActive: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  
  filterChipSolid: {
    backgroundColor: theme.colors.textSecondary,
    borderColor: theme.colors.textSecondary,
  },
  filterChipSolidActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  // State styles
  filterChipDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.disabled,
  },
  filterChipPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  // Text styles
  filterChipTextBase: {
    fontWeight: '500',
    textAlign: 'center',
  },
  filterChipTextSmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  filterChipTextMedium: {
    fontSize: 14,
    lineHeight: 18,
  },
  filterChipTextLarge: {
    fontSize: 16,
    lineHeight: 20,
  },
  
  filterChipTextDefault: {
    color: theme.colors.text,
  },
  filterChipTextDefaultActive: {
    color: theme.colors.primary,
  },
  
  filterChipTextOutline: {
    color: theme.colors.text,
  },
  filterChipTextOutlineActive: {
    color: theme.colors.primary,
  },
  
  filterChipTextSolid: {
    color: '#fff',
  },
  filterChipTextSolidActive: {
    color: '#fff',
  },
  
  filterChipTextDisabled: {
    color: theme.colors.textLight,
  },

  // Icon styles
  filterChipIconContainer: {
    marginRight: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipIcon: {
    fontSize: 16,
  },
  filterChipIconSmall: {
    fontSize: 14,
  },
  filterChipIconLarge: {
    fontSize: 18,
  },

  // Count badge styles
  filterChipCountBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginLeft: spacing.xs,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipCountBadgeSmall: {
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
  },
  filterChipCountBadgeLarge: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    minWidth: 22,
  },
  filterChipCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 13,
  },
  filterChipCountTextSmall: {
    fontSize: 10,
    lineHeight: 12,
  },
  filterChipCountTextLarge: {
    fontSize: 12,
    lineHeight: 14,
  },

  // Remove button styles
  filterChipRemoveButton: {
    marginLeft: spacing.xs,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipRemoveIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
  },

  // Content container for complex chips
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Special filter chips
  filterChipPriorityUrgent: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  filterChipPriorityHigh: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  filterChipPriorityNormal: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipPriorityLow: {
    backgroundColor: theme.colors.textSecondary,
    borderColor: theme.colors.textSecondary,
  },

  filterChipStatusSuccess: {
    backgroundColor: theme.colors.success + '15',
    borderColor: theme.colors.success,
  },
  filterChipStatusWarning: {
    backgroundColor: theme.colors.warning + '15',
    borderColor: theme.colors.warning,
  },
  filterChipStatusError: {
    backgroundColor: theme.colors.error + '15',
    borderColor: theme.colors.error,
  },
  filterChipStatusInfo: {
    backgroundColor: theme.colors.info + '15',
    borderColor: theme.colors.info,
  },

  // Filter section styles
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterSectionTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  filterSectionContent: {
    paddingHorizontal: spacing.xl,
  },

  // Filter header with clear all
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  filterHeaderTitle: {
    ...theme.typography.h6,
    flex: 1,
  },
  filterClearAll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  filterClearAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Filter results indicator
  filterResults: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: theme.colors.info + '10',
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
  },
  filterResultsText: {
    color: theme.colors.info,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Quick filter presets
  quickFilters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  quickFilterButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  quickFilterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  spacing,
  sizing,
  shadows,
  layout,
  lightColors,
  darkColors,
  createTypography,
  createGlobalStyles,
  responsive,
  mixins,
  getStatusColor,
  getPriorityColor,
};