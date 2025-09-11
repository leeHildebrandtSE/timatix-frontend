// =============================================================================
// src/screens/mechanic/QuoteManagement.js - Quote Management Screen
// =============================================================================

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

const QuoteManagement = ({ navigation }) => {
  const { user } = useAuth();
  const { quotes, updateQuote, deleteQuote, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter quotes created by this mechanic
  const mechanicQuotes = quotes?.filter(quote => quote.mechanicId === user?.id) || [];

  const filters = [
    { id: 'all', label: 'All Quotes', count: mechanicQuotes.length },
    { id: 'pending', label: 'Pending', count: mechanicQuotes.filter(q => q.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: mechanicQuotes.filter(q => q.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: mechanicQuotes.filter(q => q.status === 'rejected').length },
    { id: 'expired', label: 'Expired', count: mechanicQuotes.filter(q => q.status === 'expired').length },
  ];

  const filteredQuotes = mechanicQuotes.filter(quote => {
    const matchesSearch = quote.serviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.vehicleInfo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || quote.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh quotes data
    setRefreshing(false);
  };

  const handleDeleteQuote = (quoteId) => {
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuote(quoteId);
              addNotification('Quote deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete quote');
            }
          },
        },
      ]
    );
  };

  const getQuoteStatusColor = (status) => {
    const statusColors = {
      pending: theme.colors.warning,
      approved: theme.colors.success,
      rejected: theme.colors.error,
      expired: theme.colors.textSecondary,
    };
    return statusColors[status] || theme.colors.textSecondary;
  };

  const renderQuoteCard = ({ item: quote }) => (
    <TouchableOpacity
      style={globalStyles.quoteCard}
      onPress={() => navigation.navigate('QuoteDetails', { quoteId: quote.id })}
    >
      {/* Quote Header */}
      <View style={globalStyles.quoteHeader}>
        <View style={globalStyles.quoteInfo}>
          <Text style={[globalStyles.quoteNumber, { color: theme.colors.text }]}>
            Quote #{quote.quoteNumber || quote.id.slice(-6)}
          </Text>
          <Text style={[globalStyles.quoteClient, { color: theme.colors.textSecondary }]}>
            {quote.clientName || 'Unknown Client'}
          </Text>
          <Text style={[globalStyles.quoteVehicle, { color: theme.colors.text }]}>
            {quote.vehicleInfo}
          </Text>
        </View>
        
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <Text style={[globalStyles.quoteAmount, { color: theme.colors.primary }]}>
            ${quote.totalAmount || quote.amount}
          </Text>
          <View style={[
            globalStyles.quoteStatus,
            { backgroundColor: getQuoteStatusColor(quote.status) }
          ]}>
            <Text style={globalStyles.quoteStatusText}>
              {quote.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Quote Details */}
      <View style={globalStyles.quoteDetails}>
        <View style={globalStyles.quoteDetailRow}>
          <Text style={[globalStyles.quoteDetailLabel, { color: theme.colors.textSecondary }]}>
            Service:
          </Text>
          <Text style={[globalStyles.quoteDetailValue, { color: theme.colors.text }]}>
            {quote.serviceType}
          </Text>
        </View>
        
        <View style={globalStyles.quoteDetailRow}>
          <Text style={[globalStyles.quoteDetailLabel, { color: theme.colors.textSecondary }]}>
            Created:
          </Text>
          <Text style={[globalStyles.quoteDetailValue, { color: theme.colors.text }]}>
            {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        
        <View style={globalStyles.quoteDetailRow}>
          <Text style={[globalStyles.quoteDetailLabel, { color: theme.colors.textSecondary }]}>
            Valid Until:
          </Text>
          <Text style={[globalStyles.quoteDetailValue, { color: theme.colors.text }]}>
            {quote.validUntil || '30 days'}
          </Text>
        </View>
        
        {quote.items && (
          <View style={globalStyles.quoteDetailRow}>
            <Text style={[globalStyles.quoteDetailLabel, { color: theme.colors.textSecondary }]}>
              Items:
            </Text>
            <Text style={[globalStyles.quoteDetailValue, { color: theme.colors.text }]}>
              {quote.items.length} item{quote.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Quote Summary */}
      {quote.items && quote.items.length > 0 && (
        <View style={[
          globalStyles.serviceQuoteContainer,
          { backgroundColor: theme.colors.primary + '10' }
        ]}>
          <Text style={[globalStyles.serviceQuoteLabel, { color: theme.colors.text }]}>
            Quote Breakdown:
          </Text>
          {quote.items.slice(0, 2).map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {item.description}
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
                ${item.total || (item.quantity * item.price)}
              </Text>
            </View>
          ))}
          {quote.items.length > 2 && (
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}>
              +{quote.items.length - 2} more items...
            </Text>
          )}
        </View>
      )}

      {/* Quote Actions */}
      <View style={globalStyles.quoteActions}>
        {quote.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonSmall,
                { backgroundColor: theme.colors.primary, flex: 1, marginRight: 8 }
              ]}
              onPress={() => navigation.navigate('EditQuote', { quoteId: quote.id })}
            >
              <Text style={globalStyles.buttonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonSecondary,
                globalStyles.buttonSmall,
                { flex: 1, marginRight: 8 }
              ]}
              onPress={() => navigation.navigate('QuoteDetails', { quoteId: quote.id })}
            >
              <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
                View
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                globalStyles.buttonBase,
                globalStyles.buttonDanger,
                globalStyles.buttonSmall,
                { paddingHorizontal: 12 }
              ]}
              onPress={() => handleDeleteQuote(quote.id)}
            >
              <Text style={globalStyles.buttonText}>🗑️</Text>
            </TouchableOpacity>
          </>
        )}
        
        {quote.status !== 'pending' && (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSecondary,
              globalStyles.buttonSmall,
              { flex: 1 }
            ]}
            onPress={() => navigation.navigate('QuoteDetails', { quoteId: quote.id })}
          >
            <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
              View Details
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.listContainer}>
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #00B894 0%, #00A085 100%)',
          backgroundColor: '#00B894',
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
            💰
          </Text>
          <Text style={{
            fontSize: 80,
            color: '#fff',
            position: 'absolute',
            bottom: -10,
            left: -20,
            transform: [{ rotate: '-15deg' }],
          }}>
            📊
          </Text>
          <Text style={{
            fontSize: 60,
            color: '#fff',
            position: 'absolute',
            top: 30,
            left: '40%',
            transform: [{ rotate: '30deg' }],
          }}>
            💵
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>💰</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                My Quotes
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Manage your service quotes and track approvals
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
            <Text style={[globalStyles.dashboardProfileIcon, { fontSize: 28 }]}>➕</Text>
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
              {mechanicJobs.filter(j => j.status === 'assigned' || j.status === 'in-progress').length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Active Jobs
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {mechanicJobs.filter(j => j.status === 'pending' && !j.assignedMechanicId).length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Available
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {mechanicJobs.filter(j => j.priority === 'urgent').length}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Urgent
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[globalStyles.searchBarContainer, { marginTop: 16 }]}>
        <Text style={globalStyles.searchIcon}>🔍</Text>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search jobs..."
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

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
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
            <Text style={globalStyles.emptyStateIcon}>🔧</Text>
            <Text style={globalStyles.emptyStateTitle}>No Jobs Found</Text>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery
                ? 'No jobs match your search criteria.'
                : selectedFilter === 'available'
                  ? 'No jobs available at the moment. Check back later.'
                  : 'You don\'t have any jobs in this category.'
              }
            </Text>
            {selectedFilter === 'available' && (
              <TouchableOpacity
                style={[globalStyles.buttonBase, globalStyles.emptyStateButton]}
                onPress={handleRefresh}
              >
                <Text style={globalStyles.buttonText}>Refresh Jobs</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};