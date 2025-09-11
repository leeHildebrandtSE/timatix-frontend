// src/styles/globalStyles.js - ENHANCED VERSION WITH ALL SCREEN-SPECIFIC STYLES
import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// =============================================================================
// DESIGN TOKENS (Enhanced)
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const sizing = {
  buttonHeight: 52,
  inputHeight: 44,
  headerHeight: 64,
  cardPadding: 16,
  sectionSpacing: 32,
  tabBarHeight: 70,
  avatarSize: {
    small: 32,
    medium: 48,
    large: 80,
    xlarge: 120,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 28,
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
// COLOR SYSTEM (Enhanced)
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
    'in-progress': colors.inProgress,
    draft: colors.textSecondary,
    published: colors.success,
    archived: colors.textLight,
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
  // SCREEN LAYOUT STYLES
  // =============================================================================
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenScrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxxxl,
  },
  screenRefreshControl: {
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
  // AUTH SCREEN STYLES
  // =============================================================================
  authContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  authLogo: {
    alignSelf: 'center',
    marginBottom: spacing.xxxxl,
  },
  authLogoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  authTitle: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  authSubtitle: {
    ...theme.typography.body1,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: spacing.xxxxl,
  },
  authForm: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  authSubmitButton: {
    marginTop: spacing.lg,
  },
  authDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  authDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  authDividerText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginHorizontal: spacing.lg,
  },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  authFooterText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  authFooterLink: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },

  // =============================================================================
  // SPLASH SCREEN STYLES
  // =============================================================================
  splashContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    marginBottom: spacing.xxl,
  },
  splashLogoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  splashTagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  splashAnimation: {
    position: 'absolute',
    bottom: spacing.xxxxl,
  },

  // =============================================================================
  // PROFILE SCREEN STYLES
  // =============================================================================
  profileContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: spacing.xxxxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: sizing.borderRadius.xl,
    borderBottomRightRadius: sizing.borderRadius.xl,
  },
  profileHeaderContent: {
    alignItems: 'center',
  },
  profileAvatar: {
    width: sizing.avatarSize.xlarge,
    height: sizing.avatarSize.xlarge,
    borderRadius: sizing.avatarSize.xlarge / 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileAvatarImage: {
    width: sizing.avatarSize.xlarge,
    height: sizing.avatarSize.xlarge,
    borderRadius: sizing.avatarSize.xlarge / 2,
  },
  profileAvatarIcon: {
    fontSize: 48,
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xs,
  },
  profileRole: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  profileRoleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  profileMenuSection: {
    padding: spacing.xl,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileMenuItemLast: {
    borderBottomWidth: 0,
  },
  profileMenuIcon: {
    width: 24,
    marginRight: spacing.lg,
    textAlign: 'center',
  },
  profileMenuLabel: {
    flex: 1,
    ...theme.typography.body1,
  },
  profileMenuChevron: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  profileLogoutButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    backgroundColor: theme.colors.error,
  },

  // =============================================================================
  // DASHBOARD STYLES
  // =============================================================================
  dashboardContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  dashboardGradientHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: spacing.xxxxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: sizing.borderRadius.xl,
    borderBottomRightRadius: sizing.borderRadius.xl,
    ...shadows.medium,
  },
  dashboardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dashboardGreeting: {
    flex: 1,
    marginRight: spacing.lg,
  },
  dashboardGreetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  dashboardGreetingSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  dashboardProfileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: spacing.sm,
  },
  dashboardProfileIcon: {
    fontSize: 24,
    color: '#fff',
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
  // LIST SCREEN STYLES
  // =============================================================================
  listContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listHeaderContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listTitle: {
    ...theme.typography.h3,
    marginBottom: spacing.sm,
  },
  listSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
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
  listEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxxl,
  },

  // =============================================================================
  // DETAILS SCREEN STYLES
  // =============================================================================
  detailsContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  detailsHeader: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailsTitle: {
    ...theme.typography.h4,
    marginBottom: spacing.xs,
  },
  detailsSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  detailsSection: {
    marginHorizontal: spacing.xl,
    marginVertical: spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.small,
  },
  detailsSectionTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.md,
  },
  detailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  detailsInfoRowLast: {
    borderBottomWidth: 0,
  },
  detailsInfoLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  detailsInfoValue: {
    ...theme.typography.body2,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  detailsImageContainer: {
    height: 200,
    borderRadius: sizing.borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  detailsImage: {
    width: '100%',
    height: '100%',
  },
  detailsImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  detailsImagePlaceholderIcon: {
    fontSize: 48,
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
  },
  detailsImagePlaceholderText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  detailsActionsContainer: {
    padding: spacing.xl,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailsActionButton: {
    marginBottom: spacing.md,
  },
  detailsActionButtonLast: {
    marginBottom: 0,
  },

  // =============================================================================
  // FORM SCREEN STYLES
  // =============================================================================
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  formScrollContent: {
    paddingBottom: spacing.xxxxl * 2,
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
    ...theme.typography.h6,
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  formSectionSubtitle: {
    ...theme.typography.body2,
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
  formCancelButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // =============================================================================
  // INPUT STYLES
  // =============================================================================
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...theme.typography.label,
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
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
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
    ...theme.typography.body1,
    marginBottom: 4,
    fontWeight: '600',
  },
  toastMessage: {
    ...theme.typography.body2,
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
    color: theme.colors.textSecondary,
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
    ...theme.typography.body1,
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

  // =============================================================================
  // FILTER CHIP STYLES
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
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  filterChipTextActive: {
    color: theme.colors.primary,
  },
  // Add these missing styles to globalStyles.js:
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  filterChipIconContainer: {
    marginRight: spacing.xs,
  },

  filterChipIcon: {
    fontSize: 14,
  },

  filterChipIconSmall: {
    fontSize: 12,
  },

  filterChipIconLarge: {
    fontSize: 16,
  },

  filterChipCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: spacing.xs,
  },

  filterChipCountBadgeSmall: {
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  filterChipCountBadgeLarge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  filterChipCountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },

  filterChipCountTextSmall: {
    fontSize: 9,
  },

  filterChipCountTextLarge: {
    fontSize: 11,
  },

  filterChipRemoveButton: {
    marginLeft: spacing.xs,
    padding: 2,
  },

  filterChipRemoveIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Priority styles
  filterChipPriorityUrgent: {
    backgroundColor: theme.colors.error,
  },

  filterChipPriorityHigh: {
    backgroundColor: '#FF8C00',
  },

  filterChipPriorityNormal: {
    backgroundColor: theme.colors.primary,
  },

  filterChipPriorityLow: {
    backgroundColor: theme.colors.textSecondary,
  },

  // Status styles  
  filterChipStatusSuccess: {
    backgroundColor: theme.colors.success,
  },

  filterChipStatusWarning: {
    backgroundColor: theme.colors.warning,
  },

  filterChipStatusError: {
    backgroundColor: theme.colors.error,
  },

  filterChipStatusInfo: {
    backgroundColor: theme.colors.info,
  },

  // Text styles
  filterChipTextBase: {
    fontSize: 14,
    fontWeight: '500',
  },

  filterChipTextSmall: {
    fontSize: 12,
  },

  filterChipTextMedium: {
    fontSize: 14,
  },

  filterChipTextLarge: {
    fontSize: 16,
  },

  filterChipTextDefault: {
    color: theme.colors.text,
  },

  filterChipTextDefaultActive: {
    color: theme.colors.primary,
  },

  filterChipTextOutline: {
    color: theme.colors.primary,
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
    opacity: 0.5,
  },

  filterChipDisabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.disabled,
  },

  // Outline styles
  filterChipOutline: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  },

  filterChipOutlineActive: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
  },

  // Solid styles
  filterChipSolid: {
    backgroundColor: theme.colors.textSecondary,
  },

  filterChipSolidActive: {
    backgroundColor: theme.colors.primary,
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
  // ADMIN SPECIFIC STYLES
  // =============================================================================
  adminDashboardContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  adminMetricsSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: sizing.sectionSpacing,
  },
  adminMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  adminUserCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.small,
  },
  adminUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  adminUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  adminUserAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminUserInfo: {
    flex: 1,
  },
  adminUserName: {
    ...theme.typography.h6,
    marginBottom: 2,
  },
  adminUserEmail: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  adminUserRole: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  adminUserRoleText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // =============================================================================
  // MECHANIC SPECIFIC STYLES
  // =============================================================================
  mechanicJobCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.card,
  },
  mechanicJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  mechanicJobInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  mechanicJobTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.xs,
  },
  mechanicJobClient: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  mechanicJobVehicle: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  mechanicJobPriority: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  mechanicJobPriorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  mechanicJobDetails: {
    marginBottom: spacing.md,
  },
  mechanicJobDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  mechanicJobDetailLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  mechanicJobDetailValue: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  mechanicJobActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  // =============================================================================
  // QUOTE MANAGEMENT STYLES
  // =============================================================================
  quoteCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.card,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  quoteInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  quoteNumber: {
    ...theme.typography.h6,
    marginBottom: spacing.xs,
  },
  quoteClient: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  quoteVehicle: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  quoteAmount: {
    ...theme.typography.h5,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  quoteStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  quoteStatusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  quoteDetails: {
    marginBottom: spacing.md,
  },
  quoteDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  quoteDetailLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  quoteDetailValue: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  quoteActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  // =============================================================================
  // CLIENT SPECIFIC STYLES
  // =============================================================================
  clientVehicleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  clientVehicleImage: {
    height: 140,
    backgroundColor: theme.colors.surface,
  },
  clientVehicleImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientVehicleImagePlaceholderIcon: {
    fontSize: 48,
    color: theme.colors.textSecondary,
  },
  clientVehicleContent: {
    padding: spacing.lg,
  },
  clientVehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  clientVehicleInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  clientVehicleName: {
    ...theme.typography.h6,
    marginBottom: spacing.xs,
  },
  clientVehicleDetails: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  clientVehicleActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  clientVehicleActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientVehicleActionIcon: {
    fontSize: 16,
    color: '#fff',
  },

  // =============================================================================
  // SERVICE REQUEST STYLES
  // =============================================================================
  serviceRequestCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    ...shadows.card,
  },
  serviceRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  serviceRequestInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  serviceRequestTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.xs,
  },
  serviceRequestVehicle: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: spacing.xs,
  },
  serviceRequestDate: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  serviceRequestStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  serviceRequestStatusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  serviceRequestDescription: {
    ...theme.typography.body2,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  serviceRequestProgress: {
    marginBottom: spacing.md,
  },
  serviceRequestProgressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  serviceRequestProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  serviceRequestProgressText: {
    ...theme.typography.caption,
    textAlign: 'center',
  },
  serviceRequestActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  serviceRequestStatusAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },

  // =============================================================================
  // VEHICLE DETAILS STYLES
  // =============================================================================
  vehicleDetailsContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  vehicleDetailsImage: {
    height: 240,
    backgroundColor: theme.colors.surface,
  },
  vehicleDetailsImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleDetailsImagePlaceholderIcon: {
    fontSize: 64,
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
  },
  vehicleDetailsImagePlaceholderText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  vehicleDetailsContent: {
    flex: 1,
    padding: spacing.xl,
  },
  vehicleDetailsHeader: {
    marginBottom: spacing.xxl,
  },
  vehicleDetailsTitle: {
    ...theme.typography.h3,
    marginBottom: spacing.xs,
  },
  vehicleDetailsSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: spacing.md,
  },
  vehicleDetailsLicensePlate: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: sizing.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  vehicleDetailsLicensePlateText: {
    ...theme.typography.body2,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  vehicleDetailsInfoSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vehicleDetailsInfoTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.md,
  },
  vehicleDetailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  vehicleDetailsInfoRowLast: {
    borderBottomWidth: 0,
  },
  vehicleDetailsInfoLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  vehicleDetailsInfoValue: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  vehicleDetailsActions: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },

  // =============================================================================
  // CREATE SERVICE REQUEST STYLES
  // =============================================================================
  createServiceContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  createServiceForm: {
    padding: spacing.xl,
  },
  createServiceSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  createServiceSectionTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.md,
  },
  createServiceVehicleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: sizing.borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  createServiceVehicleSelectorText: {
    ...theme.typography.body1,
    flex: 1,
  },
  createServiceVehicleSelectorPlaceholder: {
    color: theme.colors.placeholder,
  },
  createServiceVehicleSelectorChevron: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  createServicePriorityContainer: {
    marginBottom: spacing.lg,
  },
  createServicePriorityLabel: {
    ...theme.typography.label,
    marginBottom: spacing.sm,
  },
  createServicePriorityOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  createServicePriorityOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: sizing.borderRadius.sm,
    alignItems: 'center',
  },
  createServicePriorityOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '15',
  },
  createServicePriorityOptionText: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  createServicePriorityOptionTextActive: {
    color: theme.colors.primary,
  },
  createServiceSubmitButton: {
    marginTop: spacing.xxl,
  },

  // =============================================================================
  // SYSTEM OVERVIEW STYLES (Admin)
  // =============================================================================
  systemOverviewContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  systemStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: sizing.sectionSpacing,
  },
  systemStatCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.small,
  },
  systemStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  systemStatIconText: {
    fontSize: 20,
    color: '#fff',
  },
  systemStatValue: {
    ...theme.typography.h4,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  systemStatLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  systemChartsSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: sizing.sectionSpacing,
  },
  systemChartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.small,
  },
  systemChartTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.lg,
  },

  // =============================================================================
  // USER MANAGEMENT STYLES (Admin)
  // =============================================================================
  userManagementContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  userFiltersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userFilterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: spacing.sm,
  },
  userFilterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  userFilterChipText: {
    ...theme.typography.body2,
    fontWeight: '500',
  },
  userFilterChipTextActive: {
    color: '#fff',
  },
  userListContainer: {
    paddingHorizontal: spacing.xl,
  },
  userListItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.small,
  },
  userListItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userListItemAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userListItemAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userListItemInfo: {
    flex: 1,
  },
  userListItemName: {
    ...theme.typography.h6,
    marginBottom: 2,
  },
  userListItemEmail: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  userListItemRole: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  userListItemRoleText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  userListItemStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  userListItemStat: {
    alignItems: 'center',
  },
  userListItemStatValue: {
    ...theme.typography.h6,
    fontWeight: 'bold',
  },
  userListItemStatLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  // =============================================================================
  // JOB DETAILS STYLES
  // =============================================================================
  jobDetailsContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  jobDetailsHeader: {
    backgroundColor: theme.colors.surface,
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  jobDetailsTitle: {
    ...theme.typography.h4,
    marginBottom: spacing.xs,
  },
  jobDetailsSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  jobDetailsStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  jobDetailsStatus: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginRight: spacing.md,
  },
  jobDetailsStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  jobDetailsPriority: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  jobDetailsPriorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  jobDetailsContent: {
    flex: 1,
    padding: spacing.xl,
  },
  jobDetailsSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  jobDetailsSectionTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.md,
  },
  jobDetailsInfoGrid: {
    gap: spacing.md,
  },
  jobDetailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  jobDetailsInfoLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  jobDetailsInfoValue: {
    ...theme.typography.body2,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  jobDetailsDescription: {
    ...theme.typography.body1,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  jobDetailsNotes: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  jobDetailsActions: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },

  // =============================================================================
  // CREATE QUOTE STYLES
  // =============================================================================
  createQuoteContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  createQuoteForm: {
    padding: spacing.xl,
  },
  createQuoteSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  createQuoteSectionTitle: {
    ...theme.typography.h6,
    marginBottom: spacing.md,
  },
  createQuoteItemsContainer: {
    marginBottom: spacing.lg,
  },
  createQuoteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  createQuoteItemDescription: {
    flex: 1,
    marginRight: spacing.md,
  },
  createQuoteItemDescriptionInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: sizing.borderRadius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
  },
  createQuoteItemQuantity: {
    width: 60,
    marginRight: spacing.sm,
  },
  createQuoteItemQuantityInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: sizing.borderRadius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    textAlign: 'center',
  },
  createQuoteItemPrice: {
    width: 80,
    marginRight: spacing.sm,
  },
  createQuoteItemPriceInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: sizing.borderRadius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    textAlign: 'right',
  },
  createQuoteItemTotal: {
    width: 80,
    alignItems: 'flex-end',
  },
  createQuoteItemTotalText: {
    ...theme.typography.body2,
    fontWeight: 'bold',
  },
  createQuoteItemRemove: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  createQuoteItemRemoveIcon: {
    fontSize: 16,
    color: theme.colors.error,
  },
  createQuoteAddItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: sizing.borderRadius.sm,
    marginTop: spacing.md,
  },
  createQuoteAddItemIcon: {
    fontSize: 16,
    color: theme.colors.primary,
    marginRight: spacing.sm,
  },
  createQuoteAddItemText: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  createQuoteTotalSection: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: sizing.borderRadius.sm,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  createQuoteTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  createQuoteTotalRowLast: {
    marginBottom: 0,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  createQuoteTotalLabel: {
    ...theme.typography.body1,
    fontWeight: '500',
  },
  createQuoteTotalValue: {
    ...theme.typography.body1,
    fontWeight: 'bold',
  },
  createQuoteTotalGrandTotal: {
    ...theme.typography.h5,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  createQuoteSubmitButton: {
    marginTop: spacing.xxl,
  },

  // =============================================================================
  // RESPONSIVE MARGIN/PADDING UTILITIES
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

  // =============================================================================
  // POSITION UTILITIES
  // =============================================================================
  positionAbsolute: { position: 'absolute' },
  positionRelative: { position: 'relative' },
  positionFixed: { position: 'fixed' },
  
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
  // Z-INDEX UTILITIES
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
  // OVERFLOW UTILITIES
  // =============================================================================
  overflowHidden: { overflow: 'hidden' },
  overflowVisible: { overflow: 'visible' },
  overflowScroll: { overflow: 'scroll' },

  // =============================================================================
  // DEBUGGING STYLES
  // =============================================================================
  debugBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },
  debugBackground: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
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

  // Status color helper
  statusColor: (status, colors) => getStatusColor(status, colors),
  priorityColor: (priority, colors) => getPriorityColor(priority, colors),

  // Common card style
  card: (theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadows.card,
  }),

  // Common button style
  button: (variant = 'primary', theme) => {
    const variants = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
      },
    };
    
    return {
      borderRadius: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      minHeight: sizing.inputHeight,
      borderWidth: 1,
      ...variants[variant],
    };
  },

  // Common input style
  input: (theme, focused = false, error = false) => ({
    borderWidth: focused ? 2 : 1,
    borderColor: error ? theme.colors.error : 
                 focused ? theme.colors.primary : theme.colors.border,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: theme.colors.surface,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: sizing.inputHeight,
  }),
};

// =============================================================================
// COMPONENT STYLE GENERATORS
// =============================================================================

export const generateComponentStyles = {
  // Status badge generator
  statusBadge: (status, theme, size = 'medium') => {
    const backgroundColor = getStatusColor(status, theme.colors);
    const sizes = {
      small: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        fontSize: 10,
      },
      medium: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
        fontSize: 12,
      },
      large: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: 16,
        fontSize: 14,
      },
    };
    
    return {
      backgroundColor,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      ...sizes[size],
    };
  },

  // Priority badge generator
  priorityBadge: (priority, theme, size = 'medium') => {
    const backgroundColor = getPriorityColor(priority, theme.colors);
    const sizes = {
      small: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        fontSize: 10,
      },
      medium: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
        fontSize: 12,
      },
      large: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: 16,
        fontSize: 14,
      },
    };
    
    return {
      backgroundColor,
      alignSelf: 'flex-start',
      alignItems: 'center',
      justifyContent: 'center',
      ...sizes[size],
    };
  },

  // Metric card generator
  metricCard: (theme, size = 'medium', interactive = false) => {
    const sizes = {
      small: {
        padding: spacing.md,
        minHeight: 100,
        iconSize: 32,
        valueSize: 20,
        titleSize: 12,
      },
      medium: {
        padding: spacing.lg,
        minHeight: 120,
        iconSize: 40,
        valueSize: 24,
        titleSize: 14,
      },
      large: {
        padding: spacing.xl,
        minHeight: 140,
        iconSize: 48,
        valueSize: 32,
        titleSize: 16,
      },
    };
    
    return {
      backgroundColor: theme.colors.surface,
      borderRadius: sizing.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      position: 'relative',
      overflow: 'hidden',
      ...shadows.card,
      ...sizes[size],
      ...(interactive && { transform: [{ scale: 1 }] }),
    };
  },
};

// =============================================================================
// THEME INTEGRATION HELPERS
// =============================================================================

export const themeIntegration = {
  // Get themed colors
  getThemedColors: (isDark) => isDark ? darkColors : lightColors,
  
  // Get themed typography
  getThemedTypography: (isDark) => createTypography(isDark),
  
  // Get themed global styles
  getThemedGlobalStyles: (theme) => createGlobalStyles(theme),
  
  // Create complete theme object
  createTheme: (isDark = false) => {
    const colors = isDark ? darkColors : lightColors;
    const typography = createTypography(isDark);
    
    return {
      isDark,
      colors,
      typography,
      spacing,
      sizing,
      shadows,
      layout,
      responsive,
      mixins,
      generateComponentStyles,
    };
  },
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
  generateComponentStyles,
  themeIntegration,
  getStatusColor,
  getPriorityColor,
};