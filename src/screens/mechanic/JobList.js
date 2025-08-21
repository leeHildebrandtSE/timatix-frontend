import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import ServiceCard from '../../components/cards/ServiceCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SERVICE_STATUS } from '../../utils/constants';
import { serviceRequestsService } from '../../services/serviceRequests';

const JobList = ({ navigation }) => {
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
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [serviceRequests, searchQuery, selectedStatus, selectedPriority]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const assignedJobs = await serviceRequestsService.getAssignedRequests(user.id);
      setServiceRequests(assignedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', 'Failed to load jobs');
      
      // Fallback mock data
      const mockJobs = [
        {
          id: '1',
          serviceType: 'Oil Change',
          status: SERVICE_STATUS.CONFIRMED,
          priority: 'NORMAL',
          preferredDate: '2025-01-25',
          preferredTime: '10:00',
          notes: 'Regular maintenance due',
          vehicle: {
            id: '1',
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
            licensePlate: 'CA 123 GP',
          },
          client: {
            id: 'c1',
            name: 'John Doe',
            phone: '+27 11 123 4567',
            email: 'john.doe@email.com',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-20T10:00:00Z',
          estimatedDuration: 60,
          location: 'Workshop Bay 1',
        },
        {
          id: '2',
          serviceType: 'Brake Service',
          status: SERVICE_STATUS.IN_PROGRESS,
          priority: 'HIGH',
          preferredDate: '2025-01-24',
          preferredTime: '14:00',
          notes: 'Brake pads replacement needed - customer reports squeaking',
          vehicle: {
            id: '2',
            make: 'BMW',
            model: 'X3',
            year: 2019,
            licensePlate: 'CA 456 GP',
          },
          client: {
            id: 'c2',
            name: 'Jane Smith',
            phone: '+27 11 234 5678',
            email: 'jane.smith@email.com',
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
          startedAt: '2025-01-24T14:00:00Z',
          estimatedDuration: 120,
          location: 'Workshop Bay 2',
        },
        {
          id: '3',
          serviceType: 'Engine Diagnostic',
          status: SERVICE_STATUS.PENDING_QUOTE,
          priority: 'URGENT',
          preferredDate: '2025-01-26',
          preferredTime: '09:00',
          notes: 'Check engine light is on, car making strange noises',
          vehicle: {
            id: '3',
            make: 'Mercedes-Benz',
            model: 'C-Class',
            year: 2021,
            licensePlate: 'CA 789 GP',
          },
          client: {
            id: 'c3',
            name: 'Mike Johnson',
            phone: '+27 11 345 6789',
            email: 'mike.johnson@email.com',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-23T11:00:00Z',
          estimatedDuration: 90,
          location: 'Diagnostic Bay',
        },
        {
          id: '4',
          serviceType: 'Tire Replacement',
          status: SERVICE_STATUS.COMPLETED,
          priority: 'NORMAL',
          preferredDate: '2025-01-22',
          preferredTime: '11:00',
          notes: 'Replace all 4 tires - worn out',
          vehicle: {
            id: '4',
            make: 'Volkswagen',
            model: 'Golf',
            year: 2018,
            licensePlate: 'CA 321 GP',
          },
          client: {
            id: 'c4',
            name: 'Sarah Williams',
            phone: '+27 11 456 7890',
            email: 'sarah.williams@email.com',
          },
          quote: {
            id: 'q2',
            totalAmount: 1200.00,
            status: 'APPROVED',
          },
          assignedMechanic: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
          },
          createdAt: '2025-01-20T09:00:00Z',
          startedAt: '2025-01-22T11:00:00Z',
          completedAt: '2025-01-22T13:30:00Z',
          estimatedDuration: 150,
          actualDuration: 150,
          location: 'Workshop Bay 3',
        },
      ];
      
      setServiceRequests(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = serviceRequests.filter(req => req.assignedMechanic?.id === user.id);

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.serviceType.toLowerCase().includes(query) ||
        job.vehicle?.make?.toLowerCase().includes(query) ||
        job.vehicle?.model?.toLowerCase().includes(query) ||
        job.vehicle?.licensePlate?.toLowerCase().includes(query) ||
        job.client?.name?.toLowerCase().includes(query) ||
        job.notes?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    // Filter by priority
    if (selectedPriority !== 'ALL') {
      filtered = filtered.filter(job => job.priority === selectedPriority);
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { 'URGENT': 1, 'HIGH': 2, 'NORMAL': 3, 'LOW': 4 };
      const aPriority = priorityOrder[a.priority] || 5;
      const bPriority = priorityOrder[b.priority] || 5;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      return new Date(a.preferredDate) - new Date(b.preferredDate);
    });

    setFilteredJobs(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  const handleStartJob = async (job) => {
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
        message: `Started working on ${job.serviceType} for ${job.vehicle.make} ${job.vehicle.model}.`,
        type: 'success',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start job');
    }
  };

  const handleCompleteJob = async (job) => {
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
        message: `${job.serviceType} for ${job.vehicle.make} ${job.vehicle.model} has been completed.`,
        type: 'success',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to complete job');
    }
  };

  const handleCreateQuote = (job) => {
    navigation.navigate('CreateQuote', { jobId: job.id });
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

  const getStatusOptions = () => [
    'ALL',
    SERVICE_STATUS.PENDING_QUOTE,
    SERVICE_STATUS.CONFIRMED,
    SERVICE_STATUS.IN_PROGRESS,
    SERVICE_STATUS.COMPLETED,
  ];

  const getPriorityOptions = () => ['ALL', 'URGENT', 'HIGH', 'NORMAL', 'LOW'];

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading jobs..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.h3]}>
          My Jobs
        </Text>
        <Button
          title="Filters"
          variant="outline"
          size="small"
          onPress={() => {/* Could open filter modal */}}
          style={styles.filterButton}
        />
      </View>

      {/* Search and Filters */}
      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }]}
            placeholder="Search jobs, vehicles, clients..."
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Status Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
          {getStatusOptions().map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatus === status && { color: '#fff' },
                  { color: theme.colors.text },
                ]}
              >
                {status === 'ALL' ? 'All Status' : status.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Priority Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priorityFilters}>
          {getPriorityOptions().map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.filterChip,
                selectedPriority === priority && { backgroundColor: getPriorityColor(priority) },
              ]}
              onPress={() => setSelectedPriority(priority)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedPriority === priority && { color: '#fff' },
                  { color: theme.colors.text },
                ]}
              >
                {priority === 'ALL' ? 'All Priority' : priority}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Job Count */}
      <View style={styles.jobCount}>
        <Text style={[styles.jobCountText, theme.typography.body2]}>
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Jobs List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              {/* Priority Indicator */}
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(job.priority) }]}>
                <Text style={styles.priorityText}>{job.priority}</Text>
              </View>

              <ServiceCard
                service={job}
                onPress={handleJobPress}
                userRole="MECHANIC"
              />
              
              {/* Additional Job Info */}
              <View style={styles.jobDetails}>
                <View style={styles.jobDetailRow}>
                  <Text style={[styles.jobDetailLabel, theme.typography.caption]}>Client:</Text>
                  <Text style={[styles.jobDetailValue, theme.typography.body2]}>
                    {job.client?.name} • {job.client?.phone}
                  </Text>
                </View>
                
                <View style={styles.jobDetailRow}>
                  <Text style={[styles.jobDetailLabel, theme.typography.caption]}>Location:</Text>
                  <Text style={[styles.jobDetailValue, theme.typography.body2]}>
                    {job.location || 'Not assigned'}
                  </Text>
                </View>
                
                <View style={styles.jobDetailRow}>
                  <Text style={[styles.jobDetailLabel, theme.typography.caption]}>Duration:</Text>
                  <Text style={[styles.jobDetailValue, theme.typography.body2]}>
                    {job.estimatedDuration} minutes
                  </Text>
                </View>
              </View>

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

                <Button
                  title="View Details"
                  onPress={() => handleJobPress(job)}
                  size="small"
                  variant="outline"
                  style={styles.detailsButton}
                />
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.emptyStateTitle, theme.typography.h6]}>
              {searchQuery || selectedStatus !== 'ALL' || selectedPriority !== 'ALL'
                ? 'No jobs found' 
                : 'No jobs assigned yet'
              }
            </Text>
            <Text style={[styles.emptyStateText, theme.typography.body2]}>
              {searchQuery || selectedStatus !== 'ALL' || selectedPriority !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Check back later for new job assignments'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
  },
  filters: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  statusFilters: {
    marginBottom: 8,
  },
  priorityFilters: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobCount: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  jobCountText: {
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  jobCard: {
    marginBottom: 16,
    position: 'relative',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  jobDetails: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  jobDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  jobDetailLabel: {
    flex: 1,
    fontWeight: '600',
  },
  jobDetailValue: {
    flex: 2,
    textAlign: 'right',
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  detailsButton: {
    flex: 1,
  },
  emptyState: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    opacity: 0.6,
  },
});

export default JobList;