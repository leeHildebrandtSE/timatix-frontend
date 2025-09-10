// src/styles/globalStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Base sizing system
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

// Shadow presets
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

// Layout utilities
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

// Common component styles factory
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
});

// Responsive utilities
export const responsive = {
  isSmallScreen: width < 375,
  isMediumScreen: width >= 375 && width < 414,
  isLargeScreen: width >= 414,
  screenWidth: width,
  screenHeight: height,
  
  // Dynamic sizing based on screen
  getSpacing: (size) => {
    const multiplier = width < 375 ? 0.8 : width > 414 ? 1.2 : 1;
    return spacing[size] * multiplier;
  },
  
  getFontSize: (size) => {
    const multiplier = width < 375 ? 0.9 : width > 414 ? 1.1 : 1;
    return size * multiplier;
  }
};

export default { spacing, sizing, shadows, layout, createGlobalStyles, responsive };