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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../../components/cards/MetricCard';
import ServiceCard from '../../components/cards/ServiceCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SERVICE_STATUS } from '../../utils/constants';
import { serviceRequestsService } from '../../services/serviceRequestsService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MechanicDashboard = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { 
    serviceRequests, 
    setServiceRequests,
    isLoading,
    setLoading,
    addNotification 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [mechanicStats, setMechanicStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    monthlyEarnings: 0,
  });

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const renderWelcomeHeader = () => (
      <View 
        style={[
          styles.welcomeHeader, 
          { backgroundColor: theme.colors.primary },
          { paddingTop: insets.top + 20 }, // ensures space for status bar
        ]}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: '#fff' }]}>
              Good {getTimeOfDayGreeting()}, {user?.firstName}! 👋
            </Text>
            <Text style={[styles.subGreeting, { color: 'rgba(255,255,255,0.8)' }]}>
              Manage your assigned jobs and quotes
            </Text>
          </View>
          
          <View style={styles.weatherWidget}>
            <Text style={[styles.weatherText, { color: 'rgba(255,255,255,0.9)' }]}>
              ☀️ 24°C
            </Text>
            <Text style={[styles.weatherLocation, { color: 'rgba(255,255,255,0.7)' }]}>
              Cape Town
            </Text>
          </View>
        </View>
      </View>
    );

  useEffect(() => {
    calculateMechanicStats();
  }, [serviceRequests]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const assignedJobs = await serviceRequestsService.getAssignedRequests(user.id);
      setServiceRequests(assignedJobs);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
      
      // Fallback to mock data for demo
      const mockJobs = [
        {
          id: '1',
          serviceType: 'Oil Change',
          status: SERVICE_STATUS.CONFIRMED,
          preferredDate: '2025-01-25',
          preferredTime: '10:00',
          notes: 'Regular maintenance due',
          vehicle: {
            id: '1',
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
          },
          client: {
            id: 'c1',
            name: 'John Doe',
            phone: '+27 11 123 4567',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-20T10:00:00Z',
          estimatedDuration: 60,
        },
        {
          id: '2',
          serviceType: 'Brake Service',
          status: SERVICE_STATUS.IN_PROGRESS,
          preferredDate: '2025-01-24',
          preferredTime: '14:00',
          notes: 'Brake pads replacement needed',
          vehicle: {
            id: '2',
            make: 'BMW',
            model: 'X3',
            year: 2019,
          },
          client: {
            id: 'c2',
            name: 'Jane Smith',
            phone: '+27 11 234 5678',
          },
          quote: {
            id: 'q1',
            totalAmount: 850.00,
            status: 'APPROVED',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-22T14:30:00Z',
          estimatedDuration: 120,
        },
      ];
      
      setServiceRequests(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const calculateMechanicStats = () => {
    const mechanicJobs = serviceRequests.filter(req => 
      req.assignedMechanic?.id === user.id
    );

    const totalJobs = mechanicJobs.length;
    const activeJobs = mechanicJobs.filter(req => 
      [SERVICE_STATUS.CONFIRMED, SERVICE_STATUS.IN_PROGRESS].includes(req.status)
    ).length;
    const pendingJobs = mechanicJobs.filter(req => 
      req.status === SERVICE_STATUS.PENDING_QUOTE
    ).length;
    const completedJobs = mechanicJobs.filter(req => 
      req.status === SERVICE_STATUS.COMPLETED
    ).length;

    const monthlyEarnings = mechanicJobs
      .filter(req => 
        req.status === SERVICE_STATUS.COMPLETED && 
        req.quote?.totalAmount &&
        new Date(req.completedAt || req.createdAt).getMonth() === new Date().getMonth()
      )
      .reduce((sum, req) => sum + (req.quote.totalAmount * 0.7), 0);

    setMechanicStats({
      totalJobs,
      activeJobs,
      pendingJobs,
      completedJobs,
      monthlyEarnings,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleViewAllJobs = () => {
    navigation.navigate('JobList');
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  const handleStartJob = (job) => {
    Alert.alert(
      'Start Job',
      `Start working on ${job.serviceType} for ${job.vehicle.make} ${job.vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: async () => {
            try {
              await serviceRequestsService.startWork(job.id);
              
              const updatedRequests = serviceRequests.map(req =>
                req.id === job.id 
                  ? { ...req, status: SERVICE_STATUS.IN_PROGRESS, startedAt: new Date().toISOString() }
                  : req
              );
              setServiceRequests(updatedRequests);
              
              addNotification({
                title: 'Job Started',
                message: `Started working on ${job.serviceType}.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to start job');
            }
          }
        },
      ]
    );
  };

  const handleCompleteJob = (job) => {
    Alert.alert(
      'Complete Job',
      `Mark ${job.serviceType} as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: async () => {
            try {
              await serviceRequestsService.completeWork(job.id, {
                completedAt: new Date().toISOString(),
                notes: 'Work completed successfully',
              });
              
              const updatedRequests = serviceRequests.map(req =>
                req.id === job.id 
                  ? { ...req, status: SERVICE_STATUS.COMPLETED, completedAt: new Date().toISOString() }
                  : req
              );
              setServiceRequests(updatedRequests);
              
              addNotification({
                title: 'Job Completed',
                message: `${job.serviceType} has been completed.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to complete job');
            }
          }
        },
      ]
    );
  };

  const handleCreateQuote = (job) => {
    navigation.navigate('CreateQuote', { jobId: job.id });
  };

  // Get current assigned jobs
  const assignedJobs = serviceRequests
    .filter(req => req.assignedMechanic?.id === user.id)
    .sort((a, b) => {
      const statusPriority = {
        [SERVICE_STATUS.IN_PROGRESS]: 1,
        [SERVICE_STATUS.CONFIRMED]: 2,
        [SERVICE_STATUS.PENDING_QUOTE]: 3,
      };
      return (statusPriority[a.status] || 4) - (statusPriority[b.status] || 4);
    })
    .slice(0, 5);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading workshop dashboard..." />
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

        {/* Welcome Header */}
        {renderWelcomeHeader()}

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, theme.typography.h3]}>
            Welcome, {user?.firstName}!
          </Text>
          <Text style={[styles.subGreeting, theme.typography.body2]}>
            Manage your assigned jobs and quotes
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button
            title="View All Jobs"
            onPress={handleViewAllJobs}
            style={styles.primaryAction}
          />
          <Button
            title="Quote Management"
            variant="outline"
            onPress={() => navigation.navigate('QuoteManagement')}
            style={styles.secondaryAction}
          />
        </View>

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Your Performance
          </Text>
          
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Jobs"
              value={mechanicStats.totalJobs.toString()}
              icon="🔧"
              color={theme.colors.primary}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Active Jobs"
              value={mechanicStats.activeJobs.toString()}
              icon="⚙️"
              color={theme.colors.warning}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Pending Quotes"
              value={mechanicStats.pendingJobs.toString()}
              icon="📋"
              color={theme.colors.info}
              size="small"
              style={styles.metricCard}
            />
            
            <MetricCard
              title="Completed"
              value={mechanicStats.completedJobs.toString()}
              icon="✅"
              color={theme.colors.success}
              size="small"
              style={styles.metricCard}
            />
          </View>

          <MetricCard
            title="Monthly Earnings"
            value={`R ${mechanicStats.monthlyEarnings.toFixed(0)}`}
            icon="💰"
            color={theme.colors.success}
            size="large"
            style={[styles.metricCard, styles.largeCard]}
          />
        </View>

        {/* Assigned Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Your Jobs
            </Text>
            {assignedJobs.length > 5 && (
              <TouchableOpacity onPress={handleViewAllJobs}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {assignedJobs.length > 0 ? (
            assignedJobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <ServiceCard
                  service={job}
                  onPress={handleJobPress}
                  userRole="MECHANIC"
                />
                
                {/* Job Actions */}
                <View style={styles.jobActions}>
                  {job.status === SERVICE_STATUS.PENDING_QUOTE && (
                    <Button
                      title="Create Quote"
                      onPress={() => handleCreateQuote(job)}
                      size="small"
                      style={styles.actionButton}
                    />
                  )}
                  
                  {job.status === SERVICE_STATUS.CONFIRMED && (
                    <Button
                      title="Start Job"
                      onPress={() => handleStartJob(job)}
                      size="small"
                      variant="success"
                      style={styles.actionButton}
                    />
                  )}
                  
                  {job.status === SERVICE_STATUS.IN_PROGRESS && (
                    <Button
                      title="Complete Job"
                      onPress={() => handleCompleteJob(job)}
                      size="small"
                      variant="success"
                      style={styles.actionButton}
                    />
                  )}
                </View>

                {/* Client Info */}
                {job.client && (
                  <View style={styles.clientInfo}>
                    <Text style={[styles.clientLabel, theme.typography.caption]}>
                      Client:
                    </Text>
                    <Text style={[styles.clientName, theme.typography.body2]}>
                      {job.client.name}
                    </Text>
                    <Text style={[styles.clientPhone, theme.typography.caption]}>
                      {job.client.phone}
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyStateText, theme.typography.body2]}>
                No jobs assigned yet
              </Text>
              <Text style={[styles.emptyStateSubtext, theme.typography.caption]}>
                Check back later for new assignments
              </Text>
            </View>
          )}
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Today's Schedule
          </Text>
          
          <View style={[styles.scheduleCard, { backgroundColor: theme.colors.surface }]}>
            {assignedJobs.filter(job => {
              const jobDate = new Date(job.preferredDate);
              const today = new Date();
              return jobDate.toDateString() === today.toDateString();
            }).length > 0 ? (
              assignedJobs
                .filter(job => {
                  const jobDate = new Date(job.preferredDate);
                  const today = new Date();
                  return jobDate.toDateString() === today.toDateString();
                })
                .map((job) => (
                  <View key={job.id} style={styles.scheduleItem}>
                    <Text style={[styles.scheduleTime, theme.typography.body2]}>
                      {job.preferredTime}
                    </Text>
                    <Text style={[styles.scheduleService, theme.typography.body2]}>
                      {job.serviceType} - {job.vehicle.make} {job.vehicle.model}
                    </Text>
                    <Text style={[styles.scheduleClient, theme.typography.caption]}>
                      {job.client?.name}
                    </Text>
                  </View>
                ))
            ) : (
              <Text style={[styles.noScheduleText, theme.typography.body2]}>
                No jobs scheduled for today
              </Text>
            )}
          </View>
        </View>
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
    paddingBottom: 24,
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
    opacity: 0.7,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
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
  largeCard: {
    minWidth: '100%',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    flex: 1,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobCard: {
    marginBottom: 16,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  actionButton: {
    paddingHorizontal: 20,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  clientLabel: {
    fontWeight: '600',
  },
  clientName: {
    fontWeight: '500',
  },
  clientPhone: {
    opacity: 0.7,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.8,
  },
  emptyStateSubtext: {
    textAlign: 'center',
    opacity: 0.6,
  },
  scheduleCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scheduleTime: {
    width: 60,
    fontWeight: '600',
  },
  scheduleService: {
    flex: 1,
    marginLeft: 12,
  },
  scheduleClient: {
    opacity: 0.7,
  },
  noScheduleText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 16,
  },
});

export default MechanicDashboard;