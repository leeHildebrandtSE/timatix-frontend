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

const ServiceRequests = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    serviceRequests, 
    setServiceRequests,
    addNotification,
    isLoading,
    setLoading 
  } = useApp();
  const { theme } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    loadServiceRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [serviceRequests, searchQuery, selectedStatus]);

  const loadServiceRequests = async () => {
    try {
      setLoading(true);
      const userRequests = await serviceRequestsService.getUserRequests();
      setServiceRequests(userRequests);
    } catch (error) {
      console.error('Error loading service requests:', error);
      Alert.alert('Error', 'Failed to load service requests');
      
      // Fallback to mock data for demo
      const mockRequests = [
        {
          id: '1',
          serviceType: 'Oil Change',
          selectedService: 'Oil Change',
          status: SERVICE_STATUS.PENDING_QUOTE,
          preferredDate: '2025-01-25',
          preferredTime: '10:00',
          notes: 'Regular maintenance due',
          vehicle: {
            id: '1',
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
          },
          createdAt: '2025-01-20T10:00:00Z',
          userId: user.id,
        },
        {
          id: '2',
          serviceType: 'Brake Service',
          selectedService: 'Brake Service',
          status: SERVICE_STATUS.QUOTE_SENT,
          preferredDate: '2025-01-28',
          preferredTime: '14:00',
          notes: 'Brake pads feel worn',
          vehicle: {
            id: '2',
            make: 'BMW',
            model: 'X3',
            year: 2019,
          },
          quote: {
            id: 'q1',
            totalAmount: 850.00,
            items: [
              { description: 'Brake pad replacement', amount: 600.00 },
              { description: 'Labor', amount: 250.00 },
            ],
          },
          assignedMechanic: {
            id: 'm1',
            name: 'Mike Smith',
          },
          createdAt: '2025-01-18T14:30:00Z',
          userId: user.id,
        },
        {
          id: '3',
          serviceType: 'General Maintenance',
          selectedService: 'General Maintenance',
          status: SERVICE_STATUS.COMPLETED,
          preferredDate: '2025-01-15',
          preferredTime: '09:00',
          notes: 'Full service check',
          vehicle: {
            id: '1',
            make: 'Toyota',
            model: 'Corolla',
            year: 2020,
          },
          quote: {
            id: 'q2',
            totalAmount: 450.00,
          },
          assignedMechanic: {
            id: 'm1',
            name: 'Mike Smith',
          },
          createdAt: '2025-01-10T11:00:00Z',
          completedAt: '2025-01-15T16:30:00Z',
          userId: user.id,
        },
      ];
      setServiceRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = serviceRequests;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.serviceType.toLowerCase().includes(query) ||
        request.vehicle?.make?.toLowerCase().includes(query) ||
        request.vehicle?.model?.toLowerCase().includes(query) ||
        request.notes?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredRequests(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServiceRequests();
    setRefreshing(false);
  };

  const handleCreateServiceRequest = () => {
    navigation.navigate('CreateServiceRequest');
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetails', { serviceId: service.id });
  };

  const handleViewQuote = (service) => {
    navigation.navigate('QuoteDetails', { 
      serviceId: service.id, 
      quoteId: service.quote?.id 
    });
  };

  const handleAcceptQuote = (service) => {
    Alert.alert(
      'Accept Quote',
      `Accept the quote of R ${service.quote?.totalAmount?.toFixed(2)} for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: async () => {
            try {
              await serviceRequestsService.acceptQuote(service.id);
              
              // Update local state
              const updatedRequests = serviceRequests.map(req =>
                req.id === service.id 
                  ? { ...req, status: SERVICE_STATUS.APPROVED }
                  : req
              );
              setServiceRequests(updatedRequests);
              
              addNotification({
                title: 'Quote Accepted',
                message: `Quote for ${service.serviceType} has been accepted.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to accept quote');
            }
          }
        },
      ]
    );
  };

  const handleDeclineQuote = (service) => {
    Alert.alert(
      'Decline Quote',
      `Decline the quote for ${service.serviceType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          style: 'destructive',
          onPress: async () => {
            try {
              await serviceRequestsService.declineQuote(service.id, 'Client declined quote');
              
              // Update local state
              const updatedRequests = serviceRequests.map(req =>
                req.id === service.id 
                  ? { ...req, status: SERVICE_STATUS.DECLINED }
                  : req
              );
              setServiceRequests(updatedRequests);
              
              addNotification({
                title: 'Quote Declined',
                message: `Quote for ${service.serviceType} has been declined.`,
                type: 'info',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to decline quote');
            }
          }
        },
      ]
    );
  };

  const getStatusOptions = () => {
    return [
      'ALL',
      SERVICE_STATUS.PENDING_QUOTE,
      SERVICE_STATUS.QUOTE_SENT,
      SERVICE_STATUS.APPROVED,
      SERVICE_STATUS.CONFIRMED,
      SERVICE_STATUS.IN_PROGRESS,
      SERVICE_STATUS.COMPLETED,
      SERVICE_STATUS.CANCELLED,
    ];
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading service requests..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.h3]}>
          Service Requests
        </Text>
        <Button
          title="+ New"
          onPress={handleCreateServiceRequest}
          style={styles.addButton}
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
            placeholder="Search service requests..."
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
          {getStatusOptions().map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusFilter,
                selectedStatus === status && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.statusFilterText,
                  selectedStatus === status && { color: '#fff' },
                  { color: theme.colors.text },
                ]}
              >
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Request Count */}
      <View style={styles.requestCount}>
        <Text style={[styles.requestCountText, theme.typography.body2]}>
          {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Service Requests List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={handleServicePress}
              onViewQuote={handleViewQuote}
              onAcceptQuote={handleAcceptQuote}
              onDeclineQuote={handleDeclineQuote}
              userRole="CLIENT"
            />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.emptyStateTitle, theme.typography.h6]}>
              {searchQuery || selectedStatus !== 'ALL' 
                ? 'No requests found' 
                : 'No service requests yet'
              }
            </Text>
            <Text style={[styles.emptyStateText, theme.typography.body2]}>
              {searchQuery || selectedStatus !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Create your first service request to get started'
              }
            </Text>
            {!searchQuery && selectedStatus === 'ALL' && (
              <Button
                title="Create Service Request"
                onPress={handleCreateServiceRequest}
                style={styles.emptyStateButton}
              />
            )}
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
  addButton: {
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
    flexDirection: 'row',
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  statusFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  requestCount: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  requestCountText: {
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.6,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
  },
});

export default ServiceRequests;