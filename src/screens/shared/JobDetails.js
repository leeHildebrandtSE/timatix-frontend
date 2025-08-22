// src/screens/shared/JobDetails.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { SERVICE_STATUS } from '../../utils/constants';

const JobDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params;
  
  const { user } = useAuth();
  const { 
    serviceRequests, 
    updateServiceRequest,
    addNotification,
    isLoading,
    setLoading 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [job, setJob] = useState(null);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      
      // Find job in local state
      const foundJob = serviceRequests.find(s => s.id === jobId);
      if (foundJob) {
        setJob(foundJob);
      } else {
        Alert.alert('Error', 'Job not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading job details:', error);
      Alert.alert('Error', 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobDetails();
    setRefreshing(false);
  };

  const handleStartJob = () => {
    Alert.alert(
      'Start Job',
      `Start working on ${job.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: async () => {
            try {
              const updatedJob = {
                ...job,
                status: SERVICE_STATUS.IN_PROGRESS,
                startedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              updateServiceRequest(updatedJob);
              setJob(updatedJob);
              
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

  const handleCompleteJob = () => {
    Alert.alert(
      'Complete Job',
      `Mark ${job.serviceType} as completed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          onPress: async () => {
            try {
              const updatedJob = {
                ...job,
                status: SERVICE_STATUS.COMPLETED,
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              updateServiceRequest(updatedJob);
              setJob(updatedJob);
              
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

  const handleCreateQuote = () => {
    navigation.navigate('CreateQuote', { jobId: job.id });
  };

  const handleViewQuote = () => {
    if (job.quote?.id) {
      navigation.navigate('QuoteDetails', { 
        serviceId: job.id, 
        quoteId: job.quote.id 
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return theme.colors.error;
      case 'HIGH': return '#FF8C00';
      case 'NORMAL': return theme.colors.primary;
      case 'LOW': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading job details..." />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, theme.typography.h6]}>
            Job not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Job Header */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.serviceType, theme.typography.h4]}>
                {job.serviceType}
              </Text>
              <Text style={[styles.vehicleInfo, theme.typography.body2]}>
                {job.vehicle ? 
                  `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}` :
                  'Vehicle information not available'
                }
              </Text>
              {job.vehicle?.licensePlate && (
                <Text style={[styles.licensePlate, theme.typography.caption]}>
                  License: {job.vehicle.licensePlate}
                </Text>
              )}
            </View>
            
            <View style={styles.headerRight}>
              <StatusBadge status={job.status} size="large" />
              {job.priority && (
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(job.priority) }]}>
                  <Text style={styles.priorityText}>{job.priority}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Job Details */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h5]}>
            Job Details
          </Text>
          
          <View style={styles.detailGrid}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Scheduled Date:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {formatDate(job.preferredDate)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Scheduled Time:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {formatTime(job.preferredTime)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Location:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {job.location || 'Workshop'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Estimated Duration:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {job.estimatedDuration ? `${job.estimatedDuration} minutes` : 'Not set'}
              </Text>
            </View>
            
            {job.startedAt && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, theme.typography.body2]}>Started At:</Text>
                <Text style={[styles.detailValue, theme.typography.body2]}>
                  {formatDate(job.startedAt)} {formatTime(job.startedAt)}
                </Text>
              </View>
            )}
            
            {job.completedAt && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, theme.typography.body2]}>Completed At:</Text>
                <Text style={[styles.detailValue, theme.typography.body2]}>
                  {formatDate(job.completedAt)} {formatTime(job.completedAt)}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, theme.typography.body2]}>Request Date:</Text>
              <Text style={[styles.detailValue, theme.typography.body2]}>
                {formatDate(job.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {job.description && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Problem Description
            </Text>
            <Text style={[styles.description, theme.typography.body2]}>
              {job.description}
            </Text>
          </View>
        )}

        {/* Additional Notes */}
        {job.notes && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Additional Notes
            </Text>
            <Text style={[styles.notes, theme.typography.body2]}>
              {job.notes}
            </Text>
          </View>
        )}

        {/* Quote Information */}
        {job.quote && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Quote Information
            </Text>
            
            <View style={styles.quoteInfo}>
              <View style={styles.quoteHeader}>
                <Text style={[styles.quoteAmount, theme.typography.h4]}>
                  {formatCurrency(job.quote.totalAmount)}
                </Text>
                <Button
                  title="View Quote"
                  onPress={handleViewQuote}
                  variant="outline"
                  size="small"
                />
              </View>
              
              <View style={styles.quoteMeta}>
                <Text style={[styles.quoteDate, theme.typography.caption]}>
                  Quote created: {formatDate(job.quote.createdAt)}
                </Text>
                <Text style={[styles.quoteStatus, theme.typography.caption]}>
                  Status: {job.quote.status || 'Sent'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Client Information */}
        {job.client && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, theme.typography.h5]}>
              Client Information
            </Text>
            
            <View style={styles.clientInfo}>
              <Text style={[styles.clientName, theme.typography.h6]}>
                {job.client.name}
              </Text>
              <Text style={[styles.clientContact, theme.typography.body2]}>
                📧 {job.client.email}
              </Text>
              <Text style={[styles.clientContact, theme.typography.body2]}>
                📞 {job.client.phone}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {job.status === SERVICE_STATUS.PENDING_QUOTE && (
            <Button
              title="Create Quote"
              onPress={handleCreateQuote}
              style={styles.actionButton}
            />
          )}
          
          {job.status === SERVICE_STATUS.CONFIRMED && (
            <Button
              title="Start Job"
              onPress={handleStartJob}
              variant="success"
              style={styles.actionButton}
            />
          )}
          
          {job.status === SERVICE_STATUS.IN_PROGRESS && (
            <Button
              title="Complete Job"
              onPress={handleCompleteJob}
              variant="success"
              style={styles.actionButton}
            />
          )}
          
          {job.quote && (
            <Button
              title="View Quote"
              onPress={handleViewQuote}
              variant="outline"
              style={styles.actionButton}
            />
          )}
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
  },
  section: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  serviceType: {
    marginBottom: 4,
  },
  vehicleInfo: {
    opacity: 0.8,
    marginBottom: 2,
  },
  licensePlate: {
    opacity: 0.6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  detailGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    flex: 1,
    opacity: 0.8,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  description: {
    lineHeight: 22,
  },
  notes: {
    lineHeight: 22,
    fontStyle: 'italic',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  quoteInfo: {
    gap: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  quoteMeta: {
    gap: 4,
  },
  quoteDate: {
    opacity: 0.7,
  },
  quoteStatus: {
    opacity: 0.7,
  },
  clientInfo: {
    gap: 4,
  },
  clientName: {
    marginBottom: 8,
  },
  clientContact: {
    opacity: 0.8,
    marginBottom: 4,
  },
  actions: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    // Button styles applied inline
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 24,
  },
});

export default JobDetails;