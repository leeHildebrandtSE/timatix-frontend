// =============================================================================
// REFACTORED MECHANIC SCREENS WITH GLOBAL STYLES
// =============================================================================

// src/screens/mechanic/JobList.js - Job List Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';
import { getStatusColor, getPriorityColor } from '../../styles/globalStyles';

const JobList = ({ route, navigation }) => {
  const { filter: initialFilter } = route?.params || {};
  const { user } = useAuth();
  const { serviceRequests, updateServiceRequest, addNotification, isLoading } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(initialFilter || 'all');

  // Filter jobs assigned to this mechanic or available jobs
  const mechanicJobs = serviceRequests?.filter(job => 
    job.assignedMechanicId === user?.id || 
    (job.status === 'pending' && !job.assignedMechanicId)
  ) || [];

  const filters = [
    { id: 'all', label: 'All Jobs', count: mechanicJobs.length },
    { id: 'available', label: 'Available', count: mechanicJobs.filter(j => j.status === 'pending' && !j.assignedMechanicId).length },
    { id: 'assigned', label: 'Assigned', count: mechanicJobs.filter(j => j.status === 'assigned').length },
    { id: 'active', label: 'In Progress', count: mechanicJobs.filter(j => j.status === 'in-progress').length },
    { id: 'urgent', label: 'Urgent', count: mechanicJobs.filter(j => j.priority === 'urgent').length },
    { id: 'completed', label: 'Completed', count: mechanicJobs.filter(j => j.status === 'completed').length },
  ];

  const filteredJobs = mechanicJobs.filter(job => {
    const matchesSearch = job.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = false;
    switch (selectedFilter) {
      case 'all':
        matchesFilter = true;
        break;
      case 'available':
        matchesFilter = job.status === 'pending' && !job.assignedMechanicId;
        break;
      case 'assigned':
        matchesFilter = job.status === 'assigned';
        break;
      case 'active':
        matchesFilter = job.status === 'in-progress';
        break;
      case 'urgent':
        matchesFilter = job.priority === 'urgent';
        break;
      case 'completed':
        matchesFilter = job.status === 'completed';
        break;
      default:
        matchesFilter = job.status === selectedFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh jobs data
    setRefreshing(false);
  };

  const handleAcceptJob = async (jobId) => {
    Alert.alert(
      'Accept Job',
      'Are you sure you want to accept this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await updateServiceRequest(jobId, {
                status: 'assigned',
                assignedMechanicId: user.id,
                assignedAt: new Date().toISOString(),
              });
              addNotification('Job accepted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to accept job. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleStartJob = async (jobId) => {
    Alert.alert(
      'Start Job',
      'Are you ready to start working on this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              await updateServiceRequest(jobId, {
                status: 'in-progress',
                startedAt: new Date().toISOString(),
              });
              addNotification('Job started!');
            } catch (error) {
              Alert.alert('Error', 'Failed to start job. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderJobCard = ({ item: job }) => (
    <TouchableOpacity
      style={globalStyles.mechanicJobCard}
      onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
    >
      {/* Job Header */}
      <View style={globalStyles.mechanicJobHeader}>
        <View style={globalStyles.mechanicJobInfo}>
          <Text style={[globalStyles.mechanicJobTitle, { color: theme.colors.text }]}>
            {job.serviceType}
          </Text>
          <Text style={[globalStyles.mechanicJobClient, { color: theme.colors.textSecondary }]}>
            Client: {job.clientName || 'Unknown Client'}
          </Text>
          <Text style={[globalStyles.mechanicJobVehicle, { color: theme.colors.text }]}>
            {job.vehicleInfo}
          </Text>
        </View>
        
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <View style={[
            globalStyles.mechanicJobPriority,
            { backgroundColor: getPriorityColor(job.priority, theme.colors) }
          ]}>
            <Text style={globalStyles.mechanicJobPriorityText}>
              {job.priority}
            </Text>
          </View>
          
          <View style={[
            globalStyles.statusBadge,
            globalStyles.statusBadgeSmall,
            { backgroundColor: getStatusColor(job.status, theme.colors) }
          ]}>
            <Text style={[globalStyles.statusBadgeText, globalStyles.statusBadgeTextSmall]}>
              {job.status.replace('-', ' ')}
            </Text>
          </View>
        </View>
      </View>

      {/* Job Details */}
      <View style={globalStyles.mechanicJobDetails}>
        <View style={globalStyles.mechanicJobDetailRow}>
          <Text style={[globalStyles.mechanicJobDetailLabel, { color: theme.colors.textSecondary }]}>
            Scheduled:
          </Text>
          <Text style={[globalStyles.mechanicJobDetailValue, { color: theme.colors.text }]}>
            {job.scheduledDate || 'Not scheduled'}
          </Text>
        </View>
        
        <View style={globalStyles.mechanicJobDetailRow}>
          <Text style={[globalStyles.mechanicJobDetailLabel, { color: theme.colors.textSecondary }]}>
            Estimated:
          </Text>
          <Text style={[globalStyles.mechanicJobDetailValue, { color: theme.colors.text }]}>
            {job.estimatedDuration || '2-3 hours'}
          </Text>
        </View>
        
        {job.quote && (
          <View style={globalStyles.mechanicJobDetailRow}>
            <Text style={[globalStyles.mechanicJobDetailLabel, { color: theme.colors.textSecondary }]}>
              Quote:
            </Text>
            <Text style={[
              globalStyles.mechanicJobDetailValue,
              { color: theme.colors.success, fontWeight: 'bold' }
            ]}>
              ${job.quote.amount}
            </Text>
          </View>
        )}
      </View>

      {/* Job Description */}
      {job.description && (
        <View style={[
          globalStyles.serviceDescriptionContainer,
          { backgroundColor: theme.colors.surface }
        ]}>
          <Text style={[globalStyles.serviceDescription, { color: theme.colors.text }]}>
            {job.description}
          </Text>
        </View>
      )}

      {/* Job Actions */}
      <View style={globalStyles.mechanicJobActions}>
        {job.status === 'pending' && !job.assignedMechanicId && (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSmall,
              { backgroundColor: theme.colors.success, flex: 1, marginRight: 8 }
            ]}
            onPress={() => handleAcceptJob(job.id)}
          >
            <Text style={globalStyles.buttonText}>Accept Job</Text>
          </TouchableOpacity>
        )}
        
        {job.status === 'assigned' && job.assignedMechanicId === user.id && (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSmall,
              { backgroundColor: theme.colors.primary, flex: 1, marginRight: 8 }
            ]}
            onPress={() => handleStartJob(job.id)}
          >
            <Text style={globalStyles.buttonText}>Start Job</Text>
          </TouchableOpacity>
        )}
        
        {job.status === 'in-progress' && job.assignedMechanicId === user.id && (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSmall,
              { backgroundColor: theme.colors.warning, flex: 1, marginRight: 8 }
            ]}
            onPress={() => navigation.navigate('UpdateProgress', { jobId: job.id })}
          >
            <Text style={globalStyles.buttonText}>Update Progress</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.buttonSecondary,
            globalStyles.buttonSmall,
            { flex: 1 }
          ]}
          onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
        >
          <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.listContainer}>
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #FF9500 0%, #FF6B35 100%)',
          backgroundColor: '#FF9500',
          paddingTop: 60,
          paddingBottom: 30,
          position: 'relative',
          overflow: 'hidden',
        }
      ]}>
        {/* Background Pattern */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
        }}>
          <Text style={{
            fontSize: 120,
            color: '#fff',
            position: 'absolute',
            top: -20,
            right: -30,
            transform: [{ rotate: '15deg' }],
          }}>
            🔧
          </Text>
          <Text style={{
            fontSize: 80,
            color: '#fff',
            position: 'absolute',
            bottom: -10,
            left: -20,
            transform: [{ rotate: '-15deg' }],
          }}>
            📋
          </Text>
          <Text style={{
            fontSize: 60,
            color: '#fff',
            position: 'absolute',
            top: 30,
            left: '40%',
            transform: [{ rotate: '30deg' }],
          }}>
            ⚡
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>🔧</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                Job Queue
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Manage your assigned jobs and find new opportunities
            </Text>
          </View>

          <TouchableOpacity
            style={[globalStyles.dashboardProfileButton, {
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }]}
            onPress={() => navigation.navigate('CreateQuote')}
          >
            <Text style={[globalStyles.dashboardProfileIcon, { fontSize: 28 }]}>💰</Text>
          </TouchableOpacity>
        </View>

        {/* Header Stats */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          paddingHorizontal: 20,
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {mechanicQuotes.length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Total Quotes
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {mechanicQuotes.filter(q => q.status === 'pending').length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Pending
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {mechanicQuotes.filter(q => q.status === 'approved').length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Approved
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[globalStyles.searchBarContainer, { marginTop: 16 }]}>
        <Text style={globalStyles.searchIcon}>🔍</Text>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search quotes..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={globalStyles.searchClearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={globalStyles.searchClearIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        style={globalStyles.filtersScrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <View style={globalStyles.filterChipsContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                globalStyles.filterChipBase,
                globalStyles.filterChipMedium,
                selectedFilter === filter.id
                  ? globalStyles.filterChipDefaultActive
                  : globalStyles.filterChipDefault
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                globalStyles.filterChipText,
                selectedFilter === filter.id && globalStyles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View style={globalStyles.filterChipCountBadge}>
                  <Text style={globalStyles.filterChipCountText}>{filter.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Quotes List */}
      <FlatList
        data={filteredQuotes}
        renderItem={renderQuoteCard}
        keyExtractor={(item) => item.id}
        style={globalStyles.listContainer}
        contentContainerStyle={globalStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateIcon}>💰</Text>
            <Text style={globalStyles.emptyStateTitle}>No Quotes Found</Text>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery
                ? 'No quotes match your search criteria.'
                : 'You haven\'t created any quotes yet. Create your first quote to get started.'
              }
            </Text>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.emptyStateButton]}
              onPress={() => navigation.navigate('CreateQuote')}
            >
              <Text style={globalStyles.buttonText}>Create Quote</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default {
  JobList,
  QuoteManagement,
};