// =============================================================================
// REFACTORED DETAIL AND FORM SCREENS WITH GLOBAL STYLES
// =============================================================================

// src/screens/shared/JobDetails.js - Job Details Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';
import { getStatusColor, getPriorityColor } from '../../styles/globalStyles';

const JobDetails = ({ route, navigation }) => {
  const { jobId } = route.params;
  const { user } = useAuth();
  const { serviceRequests, updateServiceRequest, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    const foundJob = serviceRequests?.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await updateServiceRequest(jobId, { 
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'completed' && { completedAt: new Date().toISOString() }),
      });
      setJob({ ...job, status: newStatus });
      addNotification(`Job status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update job status');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = () => {
    Alert.alert(
      'Complete Job',
      'Are you sure you want to mark this job as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: () => handleStatusUpdate('completed') }
      ]
    );
  };

  if (!job) {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent]}>
        <Text>Loading job details...</Text>
      </View>
    );
  }

  const statusColor = getStatusColor(job.status, theme.colors);
  const priorityColor = getPriorityColor(job.priority, theme.colors);

  return (
    <ScrollView style={globalStyles.jobDetailsContainer}>
      {/* Header */}
      <View style={globalStyles.jobDetailsHeader}>
        <Text style={[globalStyles.jobDetailsTitle, { color: theme.colors.text }]}>
          {job.serviceType}
        </Text>
        <Text style={[globalStyles.jobDetailsSubtitle, { color: theme.colors.textSecondary }]}>
          {job.vehicleInfo} • Job #{job.id.slice(-6)}
        </Text>
        
        <View style={globalStyles.jobDetailsStatusContainer}>
          <View style={[
            globalStyles.jobDetailsStatus,
            { backgroundColor: statusColor }
          ]}>
            <Text style={globalStyles.jobDetailsStatusText}>
              {job.status.replace('-', ' ')}
            </Text>
          </View>
          
          <View style={[
            globalStyles.jobDetailsPriority,
            { backgroundColor: priorityColor }
          ]}>
            <Text style={globalStyles.jobDetailsPriorityText}>
              {job.priority} priority
            </Text>
          </View>
        </View>
      </View>

      {/* Job Information */}
      <View style={globalStyles.jobDetailsSection}>
        <Text style={[globalStyles.jobDetailsSectionTitle, { color: theme.colors.text }]}>
          Job Information
        </Text>
        
        <View style={globalStyles.jobDetailsInfoGrid}>
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Service Type
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.serviceType}
            </Text>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Vehicle
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.vehicleInfo}
            </Text>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Client
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.clientName || 'Not assigned'}
            </Text>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Priority
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: priorityColor }]}>
              {job.priority}
            </Text>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Scheduled Date
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.scheduledDate || 'Not scheduled'}
            </Text>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Estimated Duration
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.estimatedDuration || '2-3 hours'}
            </Text>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Request Date
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          
          {job.assignedAt && (
            <View style={globalStyles.jobDetailsInfoRow}>
              <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
                Assigned Date
              </Text>
              <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
                {new Date(job.assignedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Problem Description */}
      {job.description && (
        <View style={globalStyles.jobDetailsSection}>
          <Text style={[globalStyles.jobDetailsSectionTitle, { color: theme.colors.text }]}>
            Problem Description
          </Text>
          <Text style={[globalStyles.jobDetailsDescription, { color: theme.colors.text }]}>
            {job.description}
          </Text>
        </View>
      )}

      {/* Special Instructions */}
      {job.specialInstructions && (
        <View style={globalStyles.jobDetailsSection}>
          <Text style={[globalStyles.jobDetailsSectionTitle, { color: theme.colors.text }]}>
            Special Instructions
          </Text>
          <Text style={[globalStyles.jobDetailsNotes, { color: theme.colors.textSecondary }]}>
            {job.specialInstructions}
          </Text>
        </View>
      )}

      {/* Client Contact Information */}
      {user?.role === 'mechanic' && job.clientContact && (
        <View style={[
          globalStyles.jobDetailsSection,
          { backgroundColor: theme.colors.info + '10', borderColor: theme.colors.info }
        ]}>
          <Text style={[globalStyles.jobDetailsSectionTitle, { color: theme.colors.info }]}>
            📞 Client Contact
          </Text>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Phone
            </Text>
            <TouchableOpacity onPress={() => {/* Call client */}}>
              <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.info }]}>
                {job.clientContact.phone || 'Not provided'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Email
            </Text>
            <TouchableOpacity onPress={() => {/* Email client */}}>
              <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.info }]}>
                {job.clientContact.email || 'Not provided'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Preferred Contact
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.contactMethod || 'Phone'}
            </Text>
          </View>
        </View>
      )}

      {/* Quote Information */}
      {job.quote && (
        <View style={[
          globalStyles.jobDetailsSection,
          { backgroundColor: theme.colors.success + '10', borderColor: theme.colors.success }
        ]}>
          <Text style={[globalStyles.jobDetailsSectionTitle, { color: theme.colors.success }]}>
            💰 Quote Information
          </Text>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Quote Amount
            </Text>
            <Text style={[
              globalStyles.jobDetailsInfoValue,
              { color: theme.colors.success, fontWeight: 'bold', fontSize: 18 }
            ]}>
              ${job.quote.amount}
            </Text>
          </View>
          
          <View style={globalStyles.jobDetailsInfoRow}>
            <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
              Quote Status
            </Text>
            <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
              {job.quote.status}
            </Text>
          </View>
          
          {job.quote.validUntil && (
            <View style={globalStyles.jobDetailsInfoRow}>
              <Text style={[globalStyles.jobDetailsInfoLabel, { color: theme.colors.textSecondary }]}>
                Valid Until
              </Text>
              <Text style={[globalStyles.jobDetailsInfoValue, { color: theme.colors.text }]}>
                {job.quote.validUntil}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Progress Information */}
      {job.progress !== undefined && job.status === 'in-progress' && (
        <View style={globalStyles.jobDetailsSection}>
          <Text style={[globalStyles.jobDetailsSectionTitle, { color: theme.colors.text }]}>
            Progress
          </Text>
          
          <View style={[
            globalStyles.serviceProgressBackground,
            { backgroundColor: theme.colors.border, marginBottom: 12 }
          ]}>
            <View style={[
              globalStyles.serviceProgressFill,
              { 
                width: `${job.progress}%`,
                backgroundColor: statusColor
              }
            ]} />
          </View>
          
          <Text style={[globalStyles.serviceProgressText, { color: theme.colors.textSecondary }]}>
            {job.progress}% Complete
          </Text>
          
          {job.progressNotes && (
            <Text style={[
              globalStyles.jobDetailsNotes,
              { color: theme.colors.text, marginTop: 12 }
            ]}>
              Latest Update: {job.progressNotes}
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={globalStyles.jobDetailsActions}>
        {/* Mechanic Actions */}
        {user?.role === 'mechanic' && (
          <>
            {job.status === 'pending' && !job.assignedMechanicId && (
              <TouchableOpacity
                style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
                onPress={() => handleStatusUpdate('assigned')}
              >
                <Text style={globalStyles.buttonText}>Accept Job</Text>
              </TouchableOpacity>
            )}
            
            {job.status === 'assigned' && job.assignedMechanicId === user.id && (
              <TouchableOpacity
                style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
                onPress={() => handleStatusUpdate('in-progress')}
              >
                <Text style={globalStyles.buttonText}>Start Job</Text>
              </TouchableOpacity>
            )}
            
            {job.status === 'in-progress' && job.assignedMechanicId === user.id && (
              <>
                <TouchableOpacity
                  style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
                  onPress={() => navigation.navigate('UpdateProgress', { jobId: job.id })}
                >
                  <Text style={globalStyles.buttonText}>Update Progress</Text>
                </TouchableOpacity>
                
                {!job.quote && (
                  <TouchableOpacity
                    style={[
                      globalStyles.buttonBase,
                      globalStyles.buttonSecondary,
                      globalStyles.detailsActionButton
                    ]}
                    onPress={() => navigation.navigate('CreateQuote', { jobId: job.id })}
                  >
                    <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
                      Create Quote
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[
                    globalStyles.buttonBase,
                    globalStyles.buttonSuccess,
                    globalStyles.detailsActionButtonLast
                  ]}
                  onPress={handleCompleteJob}
                >
                  <Text style={globalStyles.buttonText}>Complete Job</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
        
        {/* Client Actions */}
        {user?.role === 'client' && job.clientId === user.id && (
          <>
            {job.status === 'pending' && (
              <>
                <TouchableOpacity
                  style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
                  onPress={() => navigation.navigate('EditServiceRequest', { serviceId: job.id })}
                >
                  <Text style={globalStyles.buttonText}>Edit Request</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    globalStyles.buttonBase,
                    globalStyles.buttonDanger,
                    globalStyles.detailsActionButtonLast
                  ]}
                  onPress={() => handleStatusUpdate('cancelled')}
                >
                  <Text style={globalStyles.buttonText}>Cancel Job</Text>
                </TouchableOpacity>
              </>
            )}
            
            {job.quote && job.quote.status === 'pending' && (
              <>
                <TouchableOpacity
                  style={[globalStyles.buttonBase, globalStyles.detailsActionButton]}
                  onPress={() => handleStatusUpdate('quote-accepted')}
                >
                  <Text style={globalStyles.buttonText}>Accept Quote</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    globalStyles.buttonBase,
                    globalStyles.buttonSecondary,
                    globalStyles.detailsActionButtonLast
                  ]}
                  onPress={() => handleStatusUpdate('quote-rejected')}
                >
                  <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
                    Decline Quote
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
        
        {/* Admin Actions */}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={[globalStyles.buttonBase, globalStyles.detailsActionButtonLast]}
            onPress={() => navigation.navigate('JobManagement', { jobId: job.id })}
          >
            <Text style={globalStyles.buttonText}>Manage Job</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};