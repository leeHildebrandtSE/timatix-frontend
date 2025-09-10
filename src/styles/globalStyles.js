// src/styles/globalStyles.js - ENHANCED VERSION WITH ALL COMPONENT STYLES
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
    xs: 4,
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
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
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
  white: '#FFFFFF',
  
  // Border Colors
  border: '#E5E5EA',
  borderLight: '#F0F0F0',
  separator: '#C6C6C8',
  placeholder: '#C7C7CC',
  
  // Utility Colors
  disabled: '#F2F2F7',
  overlay: 'rgba(0,0,0,0.4)',
  backdrop: 'rgba(0,0,0,0.3)',
  shadow: '#000000',
  
  // Status Badge Colors
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
  white: '#FFFFFF',
  
  // Border Colors
  border: '#38383A',
  borderLight: '#2C2C2E',
  separator: '#48484A',
  placeholder: '#48484A',
  
  // Utility Colors
  disabled: '#1C1C1E',
  overlay: 'rgba(0,0,0,0.6)',
  backdrop: 'rgba(0,0,0,0.5)',
  shadow: '#000000',
  
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
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
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
  // =============================================================================
  // CONTAINER STYLES
  // =============================================================================
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

  // =============================================================================
  // HEADER STYLES
  // =============================================================================
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

  // =============================================================================
  // SECTION STYLES
  // =============================================================================
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

  // =============================================================================
  // CARD STYLES
  // =============================================================================
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.card,
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

  // =============================================================================
  // METRIC CARD STYLES
  // =============================================================================
  metricCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.card,
  },
  metricCardInteractive: {
    transform: [{ scale: 1 }],
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metricIconContainer: {
    borderRadius: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricIconText: {
    // Base icon text styles
  },
  metricValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  metricValue: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  metricLoadingSkeleton: {
    height: 24,
    width: 60,
    borderRadius: 4,
    opacity: 0.3,
  },
  metricTitle: {
    fontWeight: '600',
    lineHeight: 20,
  },
  metricTrendContainer: {
    marginTop: spacing.sm,
  },
  metricTrend: {
    fontWeight: '500',
    lineHeight: 16,
  },
  metricInteractiveIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricArrowIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricAccentLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },

  // Metric card size variants
  metricSmallContainer: {
    padding: spacing.md,
    minHeight: 100,
  },
  metricSmallIcon: {
    width: 32,
    height: 32,
  },
  metricSmallIconText: {
    fontSize: 16,
  },
  metricSmallValue: {
    fontSize: 20,
  },
  metricSmallTitle: {
    fontSize: 12,
  },
  metricSmallTrend: {
    fontSize: 10,
  },
  metricMediumContainer: {
    padding: spacing.lg,
    minHeight: 120,
  },
  metricMediumIcon: {
    width: 40,
    height: 40,
  },
  metricMediumIconText: {
    fontSize: 20,
  },
  metricMediumValue: {
    fontSize: 24,
  },
  metricMediumTitle: {
    fontSize: 14,
  },
  metricMediumTrend: {
    fontSize: 12,
  },
  metricLargeContainer: {
    padding: spacing.xl,
    minHeight: 140,
  },
  metricLargeIcon: {
    width: 48,
    height: 48,
  },
  metricLargeIconText: {
    fontSize: 24,
  },
  metricLargeValue: {
    fontSize: 32,
  },
  metricLargeTitle: {
    fontSize: 16,
  },
  metricLargeTrend: {
    fontSize: 14,
  },

  // =============================================================================
  // SERVICE CARD STYLES
  // =============================================================================
  serviceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.card,
  },
  serviceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  serviceCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  serviceCardHeaderRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  serviceIcon: {
    fontSize: 20,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  serviceVehicleInfo: {
    opacity: 0.8,
  },
  servicePriorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  servicePriorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  serviceDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  serviceDetailRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  serviceDetailIcon: {
    fontSize: 14,
    width: 16,
  },
  serviceDetailText: {
    flex: 1,
    fontWeight: '500',
  },
  serviceDescriptionContainer: {
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
  },
  serviceDescription: {
    lineHeight: 20,
    marginBottom: 4,
  },
  serviceNotes: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  serviceQuoteContainer: {
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
  },
  serviceQuoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceQuoteLabel: {
    opacity: 0.8,
    fontWeight: '600',
  },
  serviceQuoteAmount: {
    fontWeight: 'bold',
  },
  serviceQuoteExpiry: {
    opacity: 0.7,
  },
  serviceProgressContainer: {
    marginBottom: spacing.md,
  },
  serviceProgressBackground: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  serviceProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  serviceProgressText: {
    opacity: 0.7,
    textAlign: 'center',
  },
  serviceActionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  serviceActionButton: {
    flex: 1,
    minWidth: 80,
  },
  serviceStatusAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },

  // =============================================================================
  // VEHICLE CARD STYLES
  // =============================================================================
  vehicleCard: {
    borderRadius: sizing.borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  vehicleImageContainer: {
    position: 'relative',
    height: 140,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  vehicleYearBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  vehicleYearText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  vehicleInfoContainer: {
    padding: spacing.lg,
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  vehicleTitleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  vehicleName: {
    marginBottom: 2,
    fontWeight: 'bold',
  },
  vehicleColor: {
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  vehicleLicensePlateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  vehicleLicensePlateText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  vehicleDetailsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: spacing.md,
  },
  vehicleDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleDetailIcon: {
    fontSize: 16,
  },
  vehicleDetailText: {
    fontWeight: '500',
  },
  vehicleVinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  vehicleVinLabel: {
    fontWeight: '600',
    opacity: 0.7,
  },
  vehicleVinText: {
    flex: 1,
    fontFamily: 'monospace',
    opacity: 0.6,
  },
  vehicleStatusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  vehicleStatusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  vehicleActionsContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  vehicleActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  vehicleActionButtonText: {
    fontSize: 16,
  },

  // =============================================================================
  // INPUT STYLES
  // =============================================================================
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    marginBottom: 6,
  },
  inputRequired: {
    color: theme.colors.error,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: sizing.inputHeight,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  inputFieldFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  inputFieldError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  inputFieldDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.6,
  },
  inputField: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    fontFamily,
    color: theme.colors.text,
  },
  inputFieldMultiline: {
    textAlignVertical: 'top',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  inputLeftIconContainer: {
    marginRight: spacing.sm,
  },
  inputRightIconContainer: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  inputErrorText: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.error,
  },

  // =============================================================================
  // SEARCH BAR STYLES
  // =============================================================================
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    height: sizing.inputHeight,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  searchBarFocused: {
    borderColor: theme.colors.primary,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    color: theme.colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: theme.colors.text,
  },
  searchClearButton: {
    padding: spacing.xs,
  },
  searchClearIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },

  // =============================================================================
  // BUTTON STYLES
  // =============================================================================
  buttonBase: {
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: sizing.inputHeight,
    backgroundColor: theme.colors.primary,
  },
  buttonSmall: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 32,
  },
  buttonLarge: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    minHeight: sizing.buttonHeight,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDanger: {
    backgroundColor: theme.colors.error,
  },
  buttonSuccess: {
    backgroundColor: theme.colors.success,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  buttonTextSecondary: {
    color: theme.colors.primary,
  },
  buttonTextOutline: {
    color: theme.colors.primary,
  },
  buttonTextGhost: {
    color: theme.colors.primary,
  },

  // =============================================================================
  // STATUS BADGE STYLES
  // =============================================================================
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusBadgeTextSmall: {
    fontSize: 10,
  },
  statusBadgeTextLarge: {
    fontSize: 14,
  },
  statusBadgeSolid: {
    // Will be colored with status color
  },
  statusBadgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },

  // =============================================================================
  // LOADING SPINNER STYLES
  // =============================================================================
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingOverlayContent: {
    padding: spacing.xxl,
    borderRadius: spacing.md,
    alignItems: 'center',
    minWidth: 120,
    backgroundColor: theme.colors.surface,
    ...shadows.medium,
  },
  loadingMessage: {
    marginTop: spacing.md,
    textAlign: 'center',
    color: theme.colors.text,
  },

  // =============================================================================
  // NOTIFICATION TOAST STYLES
  // =============================================================================
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: spacing.md,
    borderLeftWidth: 4,
    ...shadows.large,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
  },
  toastIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    marginTop: 2,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastTitle: {
    marginBottom: 4,
    fontWeight: '600',
  },
  toastMessage: {
    lineHeight: 20,
  },
  toastCloseButton: {
    padding: spacing.xs,
    marginTop: -4,
  },
  toastCloseIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // =============================================================================
  // OFFLINE NOTICE STYLES
  // =============================================================================
  offlineNoticeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50, // Account for status bar
    paddingBottom: 10,
    paddingHorizontal: 15,
    zIndex: 1000,
    alignItems: 'center',
    backgroundColor: theme.colors.error,
  },
  offlineNoticeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#fff',
  },

  // =============================================================================
  // IMAGE PICKER STYLES
  // =============================================================================
  imagePickerContainer: {
    marginVertical: spacing.lg,
  },
  imagePickerTitle: {
    marginBottom: spacing.md,
  },
  imagePickerScrollContainer: {
    flexDirection: 'row',
  },
  imagePickerImageContainer: {
    marginRight: spacing.md,
  },
  imagePickerImage: {
    borderRadius: spacing.sm,
  },
  imagePickerAddButton: {
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  imagePickerAddIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: theme.colors.primary,
  },
  imagePickerAddText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },

  // =============================================================================
  // PROFILE IMAGE PICKER MODAL STYLES
  // =============================================================================
  profileImagePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  profileImagePickerModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xxl,
    minHeight: '60%',
    maxHeight: '80%',
    backgroundColor: theme.colors.background,
  },
  profileImagePickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileImagePickerModalTitle: {
    fontWeight: 'bold',
  },
  profileImagePickerCloseButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  profileImagePickerCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  profileImagePickerPreviewSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  profileImagePickerImagePreviewContainer: {
    position: 'relative',
  },
  profileImagePickerImagePreview: {
    width: 200,
    height: 200,
    borderRadius: spacing.md,
  },
  profileImagePickerRemoveButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.error,
  },
  profileImagePickerRemoveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImagePickerImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: spacing.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.border,
  },
  profileImagePickerPlaceholderIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
    color: theme.colors.textSecondary,
  },
  profileImagePickerPlaceholderText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  profileImagePickerActionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  profileImagePickerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: spacing.md,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  profileImagePickerActionButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  profileImagePickerActionButtonIconText: {
    fontSize: 20,
  },
  profileImagePickerActionButtonText: {
    flex: 1,
    fontWeight: '600',
  },
  profileImagePickerInfoText: {
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
    color: theme.colors.textSecondary,
  },

  // =============================================================================
  // PROGRESS TRACKER STYLES
  // =============================================================================
  progressTrackerContainer: {
    paddingHorizontal: spacing.lg,
  },
  progressStepContainer: {
    position: 'relative',
  },
  progressStepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  progressStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  progressStepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressStepTextContainer: {
    flex: 1,
  },
  progressStepTitle: {
    marginBottom: 2,
  },
  progressStepSubtitle: {
    // Styles from theme
  },
  progressStepLine: {
    position: 'absolute',
    left: 15,
    top: 48,
    width: 2,
    height: 32,
  },

  // =============================================================================
  // FILTER CHIP STYLES (Enhanced version)
  // =============================================================================
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
  filterChipDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.disabled,
  },
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
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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

  // =============================================================================
  // FORM STYLES
  // =============================================================================
  formContainer: {
    flex: 1,
  },
  formScrollContent: {
    paddingBottom: spacing.xxxl * 2,
  },
  formSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.xl,
    backgroundColor: theme.colors.surface,
    ...shadows.small,
  },
  formSectionTitle: {
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  formSectionSubtitle: {
    opacity: 0.7,
    marginBottom: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.xl,
  },
  formSubmitButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    borderRadius: spacing.md,
  },

  // =============================================================================
  // VEHICLE FORM SPECIFIC STYLES
  // =============================================================================
  vehicleFormImageContainer: {
    height: 200,
    borderRadius: spacing.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    borderColor: theme.colors.border,
  },
  vehicleFormImageWrapper: {
    flex: 1,
    position: 'relative',
  },
  vehicleFormImage: {
    width: '100%',
    height: '100%',
  },
  vehicleFormImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    alignItems: 'center',
  },
  vehicleFormImageOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  vehicleFormImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleFormPlaceholderIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
    color: theme.colors.textSecondary,
  },
  vehicleFormPlaceholderText: {
    fontWeight: '600',
    marginBottom: 4,
    color: theme.colors.textSecondary,
  },
  vehicleFormPlaceholderSubtext: {
    opacity: 0.7,
    color: theme.colors.textSecondary,
  },
  vehicleFormSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  vehicleFormSelectorText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  vehicleFormSelectorTextPlaceholder: {
    color: theme.colors.placeholder,
  },
  vehicleFormChevron: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  // =============================================================================
  // MODAL STYLES
  // =============================================================================
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: sizing.borderRadius.lg,
    paddingTop: spacing.xl,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  modalBodyContent: {
    flex: 1,
    padding: spacing.xl,
  },
  modalOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalCheckmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },

  // =============================================================================
  // EMPTY STATE STYLES
  // =============================================================================
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.xxxl * 1.5,
    alignItems: 'center',
    marginTop: 60,
    marginHorizontal: spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
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

  // =============================================================================
  // ERROR BOUNDARY STYLES
  // =============================================================================
  errorBoundaryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: '#F5F5F5',
  },
  errorBoundaryCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.xxl,
    borderRadius: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxWidth: 350,
    ...shadows.medium,
  },
  errorBoundaryIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorBoundaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorBoundaryMessage: {
    fontSize: 16,
    color: '#666666',
    marginBottom: spacing.xxl,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorBoundaryDebugInfo: {
    width: '100%',
    marginBottom: spacing.xl,
    padding: spacing.md,
    backgroundColor: '#F8F9FA',
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  errorBoundaryDebugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: spacing.sm,
  },
  errorBoundaryDebugText: {
    fontSize: 12,
    color: '#6C757D',
    fontFamily: 'monospace',
    maxHeight: 100,
  },
  errorBoundaryRetryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
    minWidth: 120,
  },
  errorBoundaryRetryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorBoundaryReloadButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 120,
  },
  errorBoundaryReloadButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // =============================================================================
  // QUICK ACTIONS STYLES
  // =============================================================================
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

  // =============================================================================
  // METRICS GRID STYLES
  // =============================================================================
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

  // =============================================================================
  // LIST STYLES
  // =============================================================================
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

  // =============================================================================
  // FILTER STYLES
  // =============================================================================
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

  // =============================================================================
  // UTILITY STYLES
  // =============================================================================
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
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textSemiBold: {
    fontWeight: '600',
  },
  textMedium: {
    fontWeight: '500',
  },
  textRegular: {
    fontWeight: '400',
  },
  textLight: {
    fontWeight: '300',
  },

  // =============================================================================
  // AUTH DEBUG STYLES
  // =============================================================================
  authDebuggerContainer: {
    padding: spacing.xl,
    backgroundColor: '#f5f5f5',
    borderRadius: spacing.sm,
    margin: spacing.xl,
  },
  authDebuggerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  authDebuggerButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  authDebuggerButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    minWidth: '45%',
  },
  authDebuggerDangerButton: {
    backgroundColor: '#FF3B30',
  },
  authDebuggerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  authDebuggerResultContainer: {
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 6,
    maxHeight: 300,
  },
  authDebuggerResultText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },

  // =============================================================================
  // ERROR DEBUGGER STYLES
  // =============================================================================
  errorDebuggerContainer: {
    padding: spacing.xl,
    backgroundColor: '#e8f4fd',
    margin: 10,
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  errorDebuggerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007AFF',
  },
  errorDebuggerText: {
    fontSize: 14,
    marginVertical: 2,
    color: '#333',
  },

  // =============================================================================
  // FORCE LOGOUT STYLES
  // =============================================================================
  forceLogoutContainer: {
    padding: spacing.xl,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: spacing.sm,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  forceLogoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  forceLogoutButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginVertical: 5,
  },
  forceLogoutButtonLogout: {
    backgroundColor: '#FF3B30',
  },
  forceLogoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  forceLogoutInfo: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  forceLogoutInfoText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },

  // =============================================================================
  // TOUCHABLE CONTAINER STYLES
  // =============================================================================
  touchableContainer: {
    // Base container for touchable elements
  },
  touchableOpacity: {
    // Default touchable opacity
  },
  touchableHighlight: {
    // Default touchable highlight
  },

  // =============================================================================
  // ACCESSIBILITY STYLES
  // =============================================================================
  accessibilityFocused: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  accessibilityLabel: {
    // Screen reader optimized text
  },
  accessibilityHint: {
    // Screen reader hint text
  },

  // =============================================================================
  // RESPONSIVE BREAKPOINT STYLES
  // =============================================================================
  smallScreenOnly: responsive.isSmallScreen ? {} : { display: 'none' },
  mediumScreenOnly: responsive.isMediumScreen ? {} : { display: 'none' },
  largeScreenOnly: responsive.isLargeScreen ? {} : { display: 'none' },
  
  // =============================================================================
  // ANIMATION STYLES
  // =============================================================================
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
  slideInLeft: {
    transform: [{ translateX: 0 }],
  },
  slideInRight: {
    transform: [{ translateX: 0 }],
  },
  slideOutLeft: {
    transform: [{ translateX: -width }],
  },
  slideOutRight: {
    transform: [{ translateX: width }],
  },
  scaleUp: {
    transform: [{ scale: 1.1 }],
  },
  scaleDown: {
    transform: [{ scale: 0.9 }],
  },
  rotate90: {
    transform: [{ rotate: '90deg' }],
  },
  rotate180: {
    transform: [{ rotate: '180deg' }],
  },
  rotate270: {
    transform: [{ rotate: '270deg' }],
  },

  // =============================================================================
  // PLATFORM SPECIFIC STYLES
  // =============================================================================
  iosOnly: Platform.OS === 'ios' ? {} : { display: 'none' },
  androidOnly: Platform.OS === 'android' ? {} : { display: 'none' },
  webOnly: Platform.OS === 'web' ? {} : { display: 'none' },

  // =============================================================================
  // Z-INDEX LAYERS
  // =============================================================================
  zIndexBase: { zIndex: 1 },
  zIndexDropdown: { zIndex: 1000 },
  zIndexStickyHeader: { zIndex: 1001 },
  zIndexModal: { zIndex: 1002 },
  zIndexPopover: { zIndex: 1003 },
  zIndexTooltip: { zIndex: 1004 },
  zIndexNotification: { zIndex: 1005 },
  zIndexMax: { zIndex: 9999 },

  // =============================================================================
  // POSITION UTILITIES
  // =============================================================================
  positionAbsolute: { position: 'absolute' },
  positionRelative: { position: 'relative' },
  positionFixed: { position: 'fixed' },
  
  // Absolute positioning helpers
  absoluteFill: StyleSheet.absoluteFillObject,
  absoluteTop: { position: 'absolute', top: 0, left: 0, right: 0 },
  absoluteBottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  absoluteLeft: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  absoluteRight: { position: 'absolute', right: 0, top: 0, bottom: 0 },
  absoluteCenter: { 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: [{ translateX: -50 }, { translateY: -50 }] 
  },
  absoluteTopLeft: { position: 'absolute', top: 0, left: 0 },
  absoluteTopRight: { position: 'absolute', top: 0, right: 0 },
  absoluteBottomLeft: { position: 'absolute', bottom: 0, left: 0 },
  absoluteBottomRight: { position: 'absolute', bottom: 0, right: 0 },

  // =============================================================================
  // OVERFLOW UTILITIES
  // =============================================================================
  overflowHidden: { overflow: 'hidden' },
  overflowVisible: { overflow: 'visible' },
  overflowScroll: { overflow: 'scroll' },

  // =============================================================================
  // OPACITY UTILITIES
  // =============================================================================
  opacity0: { opacity: 0 },
  opacity10: { opacity: 0.1 },
  opacity20: { opacity: 0.2 },
  opacity30: { opacity: 0.3 },
  opacity40: { opacity: 0.4 },
  opacity50: { opacity: 0.5 },
  opacity60: { opacity: 0.6 },
  opacity70: { opacity: 0.7 },
  opacity80: { opacity: 0.8 },
  opacity90: { opacity: 0.9 },
  opacity100: { opacity: 1 },

  // =============================================================================
  // MARGIN UTILITIES
  // =============================================================================
  marginXS: { margin: spacing.xs },
  marginSM: { margin: spacing.sm },
  marginMD: { margin: spacing.md },
  marginLG: { margin: spacing.lg },
  marginXL: { margin: spacing.xl },
  marginXXL: { margin: spacing.xxl },
  marginXXXL: { margin: spacing.xxxl },

  marginTopXS: { marginTop: spacing.xs },
  marginTopSM: { marginTop: spacing.sm },
  marginTopMD: { marginTop: spacing.md },
  marginTopLG: { marginTop: spacing.lg },
  marginTopXL: { marginTop: spacing.xl },
  marginTopXXL: { marginTop: spacing.xxl },
  marginTopXXXL: { marginTop: spacing.xxxl },

  marginBottomXS: { marginBottom: spacing.xs },
  marginBottomSM: { marginBottom: spacing.sm },
  marginBottomMD: { marginBottom: spacing.md },
  marginBottomLG: { marginBottom: spacing.lg },
  marginBottomXL: { marginBottom: spacing.xl },
  marginBottomXXL: { marginBottom: spacing.xxl },
  marginBottomXXXL: { marginBottom: spacing.xxxl },

  marginHorizontalXS: { marginHorizontal: spacing.xs },
  marginHorizontalSM: { marginHorizontal: spacing.sm },
  marginHorizontalMD: { marginHorizontal: spacing.md },
  marginHorizontalLG: { marginHorizontal: spacing.lg },
  marginHorizontalXL: { marginHorizontal: spacing.xl },
  marginHorizontalXXL: { marginHorizontal: spacing.xxl },
  marginHorizontalXXXL: { marginHorizontal: spacing.xxxl },

  marginVerticalXS: { marginVertical: spacing.xs },
  marginVerticalSM: { marginVertical: spacing.sm },
  marginVerticalMD: { marginVertical: spacing.md },
  marginVerticalLG: { marginVertical: spacing.lg },
  marginVerticalXL: { marginVertical: spacing.xl },
  marginVerticalXXL: { marginVertical: spacing.xxl },
  marginVerticalXXXL: { marginVertical: spacing.xxxl },

  // =============================================================================
  // PADDING UTILITIES
  // =============================================================================
  paddingXS: { padding: spacing.xs },
  paddingSM: { padding: spacing.sm },
  paddingMD: { padding: spacing.md },
  paddingLG: { padding: spacing.lg },
  paddingXL: { padding: spacing.xl },
  paddingXXL: { padding: spacing.xxl },
  paddingXXXL: { padding: spacing.xxxl },

  paddingTopXS: { paddingTop: spacing.xs },
  paddingTopSM: { paddingTop: spacing.sm },
  paddingTopMD: { paddingTop: spacing.md },
  paddingTopLG: { paddingTop: spacing.lg },
  paddingTopXL: { paddingTop: spacing.xl },
  paddingTopXXL: { paddingTop: spacing.xxl },
  paddingTopXXXL: { paddingTop: spacing.xxxl },

  paddingBottomXS: { paddingBottom: spacing.xs },
  paddingBottomSM: { paddingBottom: spacing.sm },
  paddingBottomMD: { paddingBottom: spacing.md },
  paddingBottomLG: { paddingBottom: spacing.lg },
  paddingBottomXL: { paddingBottom: spacing.xl },
  paddingBottomXXL: { paddingBottom: spacing.xxl },
  paddingBottomXXXL: { paddingBottom: spacing.xxxl },

  paddingHorizontalXS: { paddingHorizontal: spacing.xs },
  paddingHorizontalSM: { paddingHorizontal: spacing.sm },
  paddingHorizontalMD: { paddingHorizontal: spacing.md },
  paddingHorizontalLG: { paddingHorizontal: spacing.lg },
  paddingHorizontalXL: { paddingHorizontal: spacing.xl },
  paddingHorizontalXXL: { paddingHorizontal: spacing.xxl },
  paddingHorizontalXXXL: { paddingHorizontal: spacing.xxxl },

  paddingVerticalXS: { paddingVertical: spacing.xs },
  paddingVerticalSM: { paddingVertical: spacing.sm },
  paddingVerticalMD: { paddingVertical: spacing.md },
  paddingVerticalLG: { paddingVertical: spacing.lg },
  paddingVerticalXL: { paddingVertical: spacing.xl },
  paddingVerticalXXL: { paddingVertical: spacing.xxl },
  paddingVerticalXXXL: { paddingVertical: spacing.xxxl },

  // =============================================================================
  // BORDER UTILITIES
  // =============================================================================
  border: { borderWidth: 1, borderColor: theme.colors.border },
  borderTop: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  borderLeft: { borderLeftWidth: 1, borderLeftColor: theme.colors.border },
  borderRight: { borderRightWidth: 1, borderRightColor: theme.colors.border },

  borderRadius: { borderRadius: sizing.borderRadius.md },
  borderRadiusXS: { borderRadius: sizing.borderRadius.xs },
  borderRadiusSM: { borderRadius: sizing.borderRadius.sm },
  borderRadiusMD: { borderRadius: sizing.borderRadius.md },
  borderRadiusLG: { borderRadius: sizing.borderRadius.lg },
  borderRadiusXL: { borderRadius: sizing.borderRadius.xl },
  borderRadiusXXL: { borderRadius: sizing.borderRadius.xxl },

  borderRadiusCircle: { borderRadius: 9999 },
  borderRadiusTopLeft: { borderTopLeftRadius: sizing.borderRadius.md },
  borderRadiusTopRight: { borderTopRightRadius: sizing.borderRadius.md },
  borderRadiusBottomLeft: { borderBottomLeftRadius: sizing.borderRadius.md },
  borderRadiusBottomRight: { borderBottomRightRadius: sizing.borderRadius.md },

  // =============================================================================
  // SHADOW UTILITIES
  // =============================================================================
  shadowSmall: shadows.small,
  shadowMedium: shadows.medium,
  shadowLarge: shadows.large,
  shadowCard: shadows.card,

  // =============================================================================
  // WIDTH/HEIGHT UTILITIES
  // =============================================================================
  width25: { width: '25%' },
  width50: { width: '50%' },
  width75: { width: '75%' },
  width100: { width: '100%' },
  widthFull: { width: '100%' },
  widthScreen: { width },

  height25: { height: '25%' },
  height50: { height: '50%' },
  height75: { height: '75%' },
  height100: { height: '100%' },
  heightFull: { height: '100%' },
  heightScreen: { height },

  minWidth0: { minWidth: 0 },
  minWidthFull: { minWidth: '100%' },
  maxWidth0: { maxWidth: 0 },
  maxWidthFull: { maxWidth: '100%' },

  minHeight0: { minHeight: 0 },
  minHeightFull: { minHeight: '100%' },
  maxHeight0: { maxHeight: 0 },
  maxHeightFull: { maxHeight: '100%' },
});

// =============================================================================
// STYLE UTILITIES AND HELPERS
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
  
  // Shadow utilities
  shadow: (elevation = 4) => ({
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation / 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    elevation,
  }),
  
  // Responsive helpers
  whenSmallScreen: (styles) => responsive.isSmallScreen ? styles : {},
  whenMediumScreen: (styles) => responsive.isMediumScreen ? styles : {},
  whenLargeScreen: (styles) => responsive.isLargeScreen ? styles : {},
  
  // Platform helpers
  whenIOS: (styles) => Platform.OS === 'ios' ? styles : {},
  whenAndroid: (styles) => Platform.OS === 'android' ? styles : {},
  whenWeb: (styles) => Platform.OS === 'web' ? styles : {},
};

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