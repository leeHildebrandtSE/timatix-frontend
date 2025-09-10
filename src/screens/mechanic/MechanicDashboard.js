// src/screens/mechanic/MechanicDashboard.js - Refactored version
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, View, Text, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';
import { 
  withScreenWrapper,
  WelcomeHeader,
  SectionContainer,
  QuickActionsGrid,
  MetricsGrid,
  EmptyState
} from '../../hoc/withScreenLayout';
import ServiceCard from '../../components/cards/ServiceCard';
import Button from '../../components/common/Button';
import { SERVICE_STATUS } from '../../utils/constants';
import { serviceRequestsService } from '../../services/serviceRequestsService';

const MechanicDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const { serviceRequests, setServiceRequests, isLoading, setLoading, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  
  const [refreshing, setRefreshing] = useState(false);
  const [mechanicStats, setMechanicStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    monthlyEarnings: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

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
      
      // Mock data fallback
      const mockJobs = [
        {
          id: '1',
          serviceType: 'Oil Change',
          status: SERVICE_STATUS.CONFIRMED,
          preferredDate: '2025-01-25',
          preferredTime: '10:00',
          notes: 'Regular maintenance due',
          vehicle: { id: '1', make: 'Toyota', model: 'Corolla', year: 2020 },
          client: { id: 'c1', name: 'John Doe', phone: '+27 11 123 4567' },
          assignedMechanic: { id: user.id, name: user.firstName + ' ' + user.lastName },
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
          vehicle: { id: '2', make: 'BMW', model: 'X3', year: 2019 },
          client: { id: 'c2', name: 'Jane Smith', phone: '+27 11 234 5678' },
          quote: { id: 'q1', totalAmount: 850.00, status: 'APPROVED' },
          assignedMechanic: { id: user.id, name: user.firstName + ' ' + user.lastName },
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
    const mechanicJobs = serviceRequests.filter(req => req.assignedMechanic?.id === user.id);
    const totalJobs = mechanicJobs.length;
    const activeJobs = mechanicJobs.filter(req => 
      [SERVICE_STATUS.CONFIRMED, SERVICE_STATUS.IN_PROGRESS].includes(req.status)
    ).length;
    const pendingJobs = mechanicJobs.filter(req => req.status === SERVICE_STATUS.PENDING_QUOTE).length;
    const completedJobs = mechanicJobs.filter(req => req.status === SERVICE_STATUS.COMPLETED).length;
    const monthlyEarnings = mechanicJobs
      .filter(req => 
        req.status === SERVICE_STATUS.COMPLETED && 
        req.quote?.totalAmount &&
        new Date(req.completedAt || req.createdAt).getMonth() === new Date().getMonth()
      )
      .reduce((sum, req) => sum + (req.quote.totalAmount * 0.7), 0);

    setMechanicStats({ totalJobs, activeJobs, pendingJobs, completedJobs, monthlyEarnings });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleViewAllJobs = () => navigation.navigate('JobList');
  const handleJobPress = (job) => navigation.navigate('JobDetails', { jobId: job.id });

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

  const handleCreateQuote = (job) => navigation.navigate('CreateQuote', { jobId: job.id });

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

  // Today's schedule
  const todayJobs = assignedJobs.filter(job => {
    const jobDate = new Date(job.preferredDate);
    const today = new Date();
    return jobDate.toDateString() === today.toDateString();
  });

  // Quick actions configuration
  const quickActions = [
    {
      title: 'View All Jobs',
      subtitle: 'Manage assignments',
      icon: '🔧',
      color: theme.colors.primary,
      onPress: handleViewAllJobs
    },
    {
      title: 'Quote Management',
      subtitle: 'Create & manage quotes',
      icon: '💰',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('QuoteManagement')
    }
  ];

  // Metrics configuration
  const metrics = [
    {
      title: 'Total Jobs',
      value: mechanicStats.totalJobs.toString(),
      icon: '🔧',
      color: theme.colors.primary,
      size: 'small'
    },
    {
      title: 'Active Jobs',
      value: mechanicStats.activeJobs.toString(),
      icon: '⚙️',
      color: theme.colors.warning,
      size: 'small'
    },
    {
      title: 'Pending Quotes',
      value: mechanicStats.pendingJobs.toString(),
      icon: '📋',
      color: theme.colors.info,
      size: 'small'
    },
    {
      title: 'Completed',
      value: mechanicStats.completedJobs.toString(),
      icon: '✅',
      color: theme.colors.success,
      size: 'small'
    },
    {
      title: 'Monthly Earnings',
      value: `R ${mechanicStats.monthlyEarnings.toFixed(0)}`,
      icon: '💰',
      color: theme.colors.success,
      size: 'large'
    }
  ];

  const renderJobCard = (job, index) => (
    <View key={job.id} style={index < assignedJobs.length - 1 ? { marginBottom: 16 } : {}}>
      <ServiceCard service={job} onPress={handleJobPress} userRole="MECHANIC" />
      
      {/* Job Actions */}
      <View style={[globalStyles.cardActions, { paddingHorizontal: 16, marginTop: 8 }]}>
        {job.status === SERVICE_STATUS.PENDING_QUOTE && (
          <Button
            title="Create Quote"
            onPress={() => handleCreateQuote(job)}
            size="small"
          />
        )}
        {job.status === SERVICE_STATUS.CONFIRMED && (
          <Button
            title="Start Job"
            onPress={() => handleStartJob(job)}
            size="small"
            variant="success"
          />
        )}
        {job.status === SERVICE_STATUS.IN_PROGRESS && (
          <Button
            title="Complete Job"
            onPress={() => handleCompleteJob(job)}
            size="small"
            variant="success"
          />
        )}
      </View>

      {/* Client Info */}
      {job.client && (
        <View style={[globalStyles.cardHeader, { paddingHorizontal: 16, paddingTop: 8, marginBottom: 0 }]}>
          <Text style={[globalStyles.opacity70, { fontSize: 12, fontWeight: '600' }]}>
            Client:
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>
            {job.client.name}
          </Text>
          <Text style={[globalStyles.opacity70, { fontSize: 12 }]}>
            {job.client.phone}
          </Text>
        </View>
      )}
    </View>
  );

  const renderTodaySchedule = () => (
    <SectionContainer title="Today's Schedule" background>
      {todayJobs.length > 0 ? (
        todayJobs.map((job) => (
          <View key={job.id} style={[globalStyles.cardHeader, { marginBottom: 12 }]}>
            <Text style={[{ fontSize: 14, fontWeight: '600' }]}>
              {job.preferredTime}
            </Text>
            <Text style={[{ flex: 1, marginLeft: 12, fontSize: 14 }]}>
              {job.serviceType} - {job.vehicle.make} {job.vehicle.model}
            </Text>
            <Text style={[globalStyles.opacity70, { fontSize: 12 }]}>
              {job.client?.name}
            </Text>
          </View>
        ))
      ) : (
        <Text style={[globalStyles.textCenter, globalStyles.opacity60, { paddingVertical: 16 }]}>
          No jobs scheduled for today
        </Text>
      )}
    </SectionContainer>
  );

  const renderJobsEmptyState = () => (
    <EmptyState
      icon="🔧"
      title="No jobs assigned yet"
      subtitle="Check back later for new assignments"
    />
  );

  return (
    <ScrollView
      style={globalStyles.scrollView}
      contentContainerStyle={globalStyles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
      <WelcomeHeader
        user={user}
        subtitle="Manage your assigned jobs and quotes"
        rightWidget={
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[globalStyles.greeting, { color: 'rgba(255,255,255,0.9)', fontSize: 18 }]}>
              ☀️ 24°C
            </Text>
            <Text style={[globalStyles.subGreeting, { fontSize: 14 }]}>
              Cape Town
            </Text>
          </View>
        }
      />

      {/* Quick Actions */}
      <QuickActionsGrid 
        actions={quickActions}
        style={{ paddingTop: 32 }}
      />

      {/* Performance Metrics */}
      <SectionContainer title="Your Performance">
        <MetricsGrid metrics={metrics} />
      </SectionContainer>

      {/* Your Jobs */}
      <SectionContainer 
        title={`Your Jobs${assignedJobs.length > 5 ? ` (${assignedJobs.length})` : ''}`}
      >
        {assignedJobs.length > 5 && (
          <TouchableOpacity onPress={handleViewAllJobs} style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
            <Text style={[{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }]}>
              View All
            </Text>
          </TouchableOpacity>
        )}
        
        {assignedJobs.length > 0 ? (
          assignedJobs.map((job, index) => renderJobCard(job, index))
        ) : (
          renderJobsEmptyState()
        )}
      </SectionContainer>

      {/* Today's Schedule */}
      {renderTodaySchedule()}
    </ScrollView>
  );
};

// Export with screen wrapper
export default withScreenWrapper(MechanicDashboard, {
  layout: 'dashboard',
  loading: true,
  refresh: false // We handle refresh manually
});