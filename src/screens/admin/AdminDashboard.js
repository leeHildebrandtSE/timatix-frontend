import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../../components/cards/MetricCard';
import ServiceCard from '../../components/cards/ServiceCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { 
    serviceRequests, 
    users, 
    isLoading,
    setLoading,
    addNotification 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalMechanics: 0,
    activeServices: 0,
    totalRevenue: 0,
    pendingQuotes: 0,
    completedServices: 0,
    todayServices: 0,
    weeklyGrowth: 0,
  });

  useEffect(() => {
    loadDashboardData();
    
    // Fade in animation
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 50, useNativeDriver: true, delay: 20 }),
    ]).start();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [serviceRequests, users]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadServiceRequests(),
        loadSystemMetrics(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    // Mock data - replace with actual API call
  };

  const loadServiceRequests = async () => {
    // Mock data - replace with actual API call
  };

  const loadSystemMetrics = async () => {
    // Mock data - replace with actual API call
  };

  const calculateMetrics = () => {
    const totalUsers = users.filter(u => u.role === 'CLIENT').length;
    const totalMechanics = users.filter(u => u.role === 'MECHANIC').length;
    const activeServices = serviceRequests.filter(req => 
      ['CONFIRMED', 'IN_PROGRESS'].includes(req.status)
    ).length;
    const pendingQuotes = serviceRequests.filter(req => 
      req.status === 'QUOTE_SENT'
    ).length;
    const completedServices = serviceRequests.filter(req => 
      req.status === 'COMPLETED'
    ).length;
    
    // Calculate today's services
    const today = new Date().toDateString();
    const todayServices = serviceRequests.filter(req => 
      new Date(req.preferredDate).toDateString() === today
    ).length;
    
    const totalRevenue = serviceRequests
      .filter(req => req.status === 'COMPLETED' && req.quote?.totalAmount)
      .reduce((sum, req) => sum + req.quote.totalAmount, 0);

    // Calculate weekly growth (mock calculation)
    const weeklyGrowth = Math.round(Math.random() * 20 + 5); // 5-25% growth

    setDashboardData({
      totalUsers,
      totalMechanics,
      activeServices,
      totalRevenue,
      pendingQuotes,
      completedServices,
      todayServices,
      weeklyGrowth,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleViewSystemOverview = () => {
    navigation.navigate('SystemOverview');
  };

  const handleViewUserManagement = () => {
    navigation.navigate('UserManagement');
  };

  const handleViewAllServices = () => {
    navigation.navigate('ServiceRequests');
  };

  const handleViewReports = () => {
    navigation.navigate('Reports');
  };

  const handleViewSettings = () => {
    navigation.navigate('AdminSettings');
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { serviceId: service.id });
  };

  const handleApproveService = (service) => {
    Alert.alert(
      'Approve Service',
      `Approve the service request for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          onPress: async () => {
            try {
              addNotification({
                title: 'Service Approved',
                message: `Service request for ${service.serviceType} has been approved.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to approve service');
            }
          }
        },
      ]
    );
  };

  // Get recent service requests that need admin attention
  const pendingServices = serviceRequests
    .filter(req => ['PENDING', 'QUOTE_SENT'].includes(req.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get urgent services
  const urgentServices = serviceRequests
    .filter(req => req.priority === 'URGENT' && req.status !== 'COMPLETED')
    .slice(0, 3);


  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };
  
  const renderWelcomeHeader = () => (
    <Animated.View 
      style={[
        styles.welcomeHeader, 
        { backgroundColor: theme.colors.primary },
        { paddingTop: insets.top + 20 }, // ensures space for status bar
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.welcomeContent}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: '#fff' }]}>
            Welcome back, {user?.firstName}! 👋
          </Text>
          <Text style={[styles.subGreeting, { color: 'rgba(255,255,255,0.8)' }]}>
            Here's what's happening with your platform
          </Text>
        </View>
        
        <View style={styles.todayWidget}>
          <Text style={[styles.todayNumber, { color: '#fff' }]}>
            {dashboardData.todayServices}
          </Text>
          <Text style={[styles.todayLabel, { color: 'rgba(255,255,255,0.8)' }]}>
            Today's Services
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <Animated.View 
      style={[styles.quickActionsContainer, { opacity: fadeAnim }]}
    >
      <Text style={[styles.sectionTitle, theme.typography.h5]}>
        Quick Actions
      </Text>
      
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: theme.colors.primary }]}
          onPress={handleViewSystemOverview}
        >
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionIconText}>📊</Text>
          </View>
          <Text style={[styles.quickActionTitle, { color: '#fff' }]}>
            System Overview
          </Text>
          <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            View detailed metrics
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: theme.colors.secondary }]}
          onPress={handleViewUserManagement}
        >
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionIconText}>👥</Text>
          </View>
          <Text style={[styles.quickActionTitle, { color: '#fff' }]}>
            Manage Users
          </Text>
          <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            Add, edit, or remove users
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: theme.colors.success }]}
          onPress={handleViewReports}
        >
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionIconText}>📈</Text>
          </View>
          <Text style={[styles.quickActionTitle, { color: '#fff' }]}>
            Reports
          </Text>
          <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            Generate insights
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.quickActionCard, { backgroundColor: theme.colors.warning }]}
          onPress={handleViewSettings}
        >
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionIconText}>⚙️</Text>
          </View>
          <Text style={[styles.quickActionTitle, { color: '#fff' }]}>
            Settings
          </Text>
          <Text style={[styles.quickActionSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
            Configure platform
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderKeyMetrics = () => (
    <Animated.View 
      style={[styles.metricsContainer, { opacity: fadeAnim }]}
    >
      <Text style={[styles.sectionTitle, theme.typography.h5]}>
        Key Metrics
      </Text>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Total Users"
          value={dashboardData.totalUsers.toString()}
          icon="👥"
          color={theme.colors.primary}
          trend={`+${dashboardData.weeklyGrowth}% this week`}
          size="medium"
          style={styles.metricCard}
          onPress={handleViewUserManagement}
        />
        
        <MetricCard
          title="Active Mechanics"
          value={dashboardData.totalMechanics.toString()}
          icon="🔧"
          color={theme.colors.secondary}
          trend="All available"
          size="medium"
          style={styles.metricCard}
        />
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          title="Active Services"
          value={dashboardData.activeServices.toString()}
          icon="⚙️"
          color={theme.colors.warning}
          trend={dashboardData.activeServices > 0 ? "In progress" : "All caught up"}
          size="medium"
          style={styles.metricCard}
        />
        
        <MetricCard
          title="Total Revenue"
          value={`R ${dashboardData.totalRevenue.toFixed(0)}`}
          icon="💰"
          color={theme.colors.success}
          trend={`+${Math.round(dashboardData.weeklyGrowth * 0.8)}% this month`}
          size="medium"
          style={styles.metricCard}
        />
      </View>
    </Animated.View>
  );

  const renderServiceOverview = () => (
    <Animated.View 
      style={[styles.metricsContainer, { opacity: fadeAnim }]}
    >
      <Text style={[styles.sectionTitle, theme.typography.h5]}>
        Service Overview
      </Text>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Pending Quotes"
          value={dashboardData.pendingQuotes.toString()}
          icon="📋"
          color={theme.colors.warning}
          trend={dashboardData.pendingQuotes > 0 ? "Needs attention" : "All processed"}
          size="small"
          style={styles.metricCard}
        />
        
        <MetricCard
          title="Completed Today"
          value={dashboardData.todayServices.toString()}
          icon="✅"
          color={theme.colors.success}
          trend="Today's progress"
          size="small"
          style={styles.metricCard}
        />
        
        <MetricCard
          title="Total Completed"
          value={dashboardData.completedServices.toString()}
          icon="🎯"
          color={theme.colors.info}
          trend="All time"
          size="small"
          style={styles.metricCard}
        />
      </View>
    </Animated.View>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading admin dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Welcome Header */}
        {renderWelcomeHeader()}

        {/* Improved Quick Actions */}
        {renderQuickActions()}

        {/* Enhanced Key Metrics */}
        {renderKeyMetrics()}

        {/* Service Overview */}
        {renderServiceOverview()}

        {/* Urgent Services Alert */}
        {urgentServices.length > 0 && (
          <Animated.View 
            style={[styles.urgentSection, { opacity: fadeAnim }]}
          >
            <View style={[styles.urgentHeader, { backgroundColor: theme.colors.error + '20' }]}>
              <Text style={[styles.urgentTitle, { color: theme.colors.error }]}>
                🚨 Urgent Services ({urgentServices.length})
              </Text>
            </View>
            
            {urgentServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleServicePress}
                onApprove={handleApproveService}
                userRole="ADMIN"
                showAdminActions={true}
              />
            ))}
          </Animated.View>
        )}

        {/* Pending Services Requiring Attention */}
        <Animated.View 
          style={[styles.section, { opacity: fadeAnim }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Pending Services ({pendingServices.length})
            </Text>
            {serviceRequests.length > 5 && (
              <TouchableOpacity onPress={handleViewAllServices}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All ({serviceRequests.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {pendingServices.length > 0 ? (
            pendingServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={handleServicePress}
                onApprove={handleApproveService}
                userRole="ADMIN"
                showAdminActions={true}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={styles.emptyStateIcon}>✅</Text>
              <Text style={[styles.emptyStateText, theme.typography.body2]}>
                All caught up!
              </Text>
              <Text style={[styles.emptyStateSubtext, theme.typography.caption]}>
                No pending services require your attention
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Enhanced System Health */}
        <Animated.View 
          style={[styles.section, { opacity: fadeAnim }]}
        >
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            System Health
          </Text>
          
          <View style={[styles.healthCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.healthGrid}>
              <View style={styles.healthItem}>
                <View style={[styles.healthIndicator, { backgroundColor: theme.colors.success }]} />
                <View style={styles.healthInfo}>
                  <Text style={[styles.healthTitle, theme.typography.body2]}>
                    Database
                  </Text>
                  <Text style={[styles.healthStatus, theme.typography.caption]}>
                    Operational (99.9%)
                  </Text>
                </View>
              </View>
              
              <View style={styles.healthItem}>
                <View style={[styles.healthIndicator, { backgroundColor: theme.colors.success }]} />
                <View style={styles.healthInfo}>
                  <Text style={[styles.healthTitle, theme.typography.body2]}>
                    API Response
                  </Text>
                  <Text style={[styles.healthStatus, theme.typography.caption]}>
                    120ms (Excellent)
                  </Text>
                </View>
              </View>
              
              <View style={styles.healthItem}>
                <View style={[styles.healthIndicator, { backgroundColor: theme.colors.warning }]} />
                <View style={styles.healthInfo}>
                  <Text style={[styles.healthTitle, theme.typography.body2]}>
                    Storage
                  </Text>
                  <Text style={[styles.healthStatus, theme.typography.caption]}>
                    78% used (Good)
                  </Text>
                </View>
              </View>
              
              <View style={styles.healthItem}>
                <View style={[styles.healthIndicator, { backgroundColor: theme.colors.info }]} />
                <View style={styles.healthInfo}>
                  <Text style={[styles.healthTitle, theme.typography.body2]}>
                    Active Users
                  </Text>
                  <Text style={[styles.healthStatus, theme.typography.caption]}>
                    {dashboardData.totalUsers + dashboardData.totalMechanics} online
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    flexGrow: 1,  // ensures it fills screen height
  },

  // Enhanced Welcome Header
  welcomeHeader: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
    lineHeight: 22,
  },
  todayWidget: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  todayNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  todayLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Improved Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: (width - 60) / 2, // Responsive width
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Enhanced Metrics
  metricsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
  },

  // Enhanced Sections
  section: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Urgent Services
  urgentSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  urgentHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Enhanced Empty States
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Enhanced System Health
  healthCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  healthGrid: {
    gap: 16,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  healthInfo: {
    flex: 1,
  },
  healthTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  healthStatus: {
    opacity: 0.7,
  },
});

export default AdminDashboard;