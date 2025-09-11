// =============================================================================
// src/screens/admin/UserManagement.js - User Management Screen
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

const UserManagement = ({ navigation }) => {
  const { user: currentUser } = useAuth();
  const { users, updateUser, deleteUser, addNotification } = useApp();
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Users', count: users?.length || 0 },
    { id: 'client', label: 'Clients', count: users?.filter(u => u.role === 'client').length || 0 },
    { id: 'mechanic', label: 'Mechanics', count: users?.filter(u => u.role === 'mechanic').length || 0 },
    { id: 'admin', label: 'Admins', count: users?.filter(u => u.role === 'admin').length || 0 },
    { id: 'active', label: 'Active', count: users?.filter(u => u.status === 'active').length || 0 },
    { id: 'inactive', label: 'Inactive', count: users?.filter(u => u.status === 'inactive').length || 0 },
  ];

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = false;
    switch (selectedFilter) {
      case 'all':
        matchesFilter = true;
        break;
      case 'active':
        matchesFilter = user.status === 'active';
        break;
      case 'inactive':
        matchesFilter = user.status === 'inactive';
        break;
      default:
        matchesFilter = user.role === selectedFilter;
    }
    
    return matchesSearch && matchesFilter;
  }) || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh users data
    setRefreshing(false);
  };

  const handleUserAction = (action, userData) => {
    switch (action) {
      case 'edit':
        navigation.navigate('EditUser', { userId: userData.id });
        break;
      case 'activate':
        updateUserStatus(userData.id, 'active');
        break;
      case 'deactivate':
        updateUserStatus(userData.id, 'inactive');
        break;
      case 'delete':
        confirmDeleteUser(userData);
        break;
      case 'viewDetails':
        navigation.navigate('UserDetails', { userId: userData.id });
        break;
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await updateUser(userId, { status });
      addNotification(`User ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update user status');
    }
  };

  const confirmDeleteUser = (userData) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userData.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(userData.id);
              addNotification('User deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role) => {
    const roleColors = {
      client: theme.colors.primary,
      mechanic: theme.colors.success,
      admin: theme.colors.error,
    };
    return roleColors[role] || theme.colors.textSecondary;
  };

  const getStatusColor = (status) => {
    return status === 'active' ? theme.colors.success : theme.colors.textSecondary;
  };

  const renderUserCard = ({ item: user }) => (
    <View style={globalStyles.userListItem}>
      {/* User Header */}
      <View style={globalStyles.userListItemHeader}>
        <View style={[
          globalStyles.userListItemAvatar,
          { backgroundColor: getRoleColor(user.role) }
        ]}>
          <Text style={globalStyles.userListItemAvatarText}>
            {user.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        
        <View style={globalStyles.userListItemInfo}>
          <Text style={[globalStyles.userListItemName, { color: theme.colors.text }]}>
            {user.name || 'Unknown User'}
          </Text>
          <Text style={[globalStyles.userListItemEmail, { color: theme.colors.textSecondary }]}>
            {user.email || 'No email'}
          </Text>
        </View>
        
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <View style={[
            globalStyles.userListItemRole,
            { backgroundColor: getRoleColor(user.role) }
          ]}>
            <Text style={globalStyles.userListItemRoleText}>{user.role}</Text>
          </View>
          
          <View style={[
            globalStyles.statusBadge,
            globalStyles.statusBadgeSmall,
            { backgroundColor: getStatusColor(user.status) }
          ]}>
            <Text style={[globalStyles.statusBadgeText, globalStyles.statusBadgeTextSmall]}>
              {user.status || 'active'}
            </Text>
          </View>
        </View>
      </View>

      {/* User Stats */}
      <View style={globalStyles.userListItemStats}>
        <View style={globalStyles.userListItemStat}>
          <Text style={[globalStyles.userListItemStatValue, { color: theme.colors.text }]}>
            {user.role === 'client' ? (user.vehicleCount || 0) : 
             user.role === 'mechanic' ? (user.jobsCompleted || 0) : 
             (user.actionsPerformed || 0)}
          </Text>
          <Text style={globalStyles.userListItemStatLabel}>
            {user.role === 'client' ? 'Vehicles' : 
             user.role === 'mechanic' ? 'Jobs Done' : 
             'Actions'}
          </Text>
        </View>
        
        <View style={globalStyles.userListItemStat}>
          <Text style={[globalStyles.userListItemStatValue, { color: theme.colors.text }]}>
            {user.role === 'client' ? (user.serviceCount || 0) : 
             user.role === 'mechanic' ? (user.activeJobs || 0) : 
             (user.usersManaged || 0)}
          </Text>
          <Text style={globalStyles.userListItemStatLabel}>
            {user.role === 'client' ? 'Services' : 
             user.role === 'mechanic' ? 'Active' : 
             'Managed'}
          </Text>
        </View>
        
        <View style={globalStyles.userListItemStat}>
          <Text style={[globalStyles.userListItemStatValue, { color: theme.colors.text }]}>
            {user.lastActive ? 
              Math.floor((Date.now() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24)) : 
              '?'}
          </Text>
          <Text style={globalStyles.userListItemStatLabel}>
            Days Ago
          </Text>
        </View>
      </View>

      {/* User Actions */}
      <View style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderLight,
      }}>
        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.buttonSmall,
            { backgroundColor: theme.colors.primary, flex: 1 }
          ]}
          onPress={() => handleUserAction('viewDetails', user)}
        >
          <Text style={globalStyles.buttonText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            globalStyles.buttonBase,
            globalStyles.buttonSecondary,
            globalStyles.buttonSmall,
            { flex: 1 }
          ]}
          onPress={() => handleUserAction('edit', user)}
        >
          <Text style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}>
            Edit
          </Text>
        </TouchableOpacity>
        
        {user.status === 'active' ? (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSmall,
              { backgroundColor: theme.colors.warning, paddingHorizontal: 12 }
            ]}
            onPress={() => handleUserAction('deactivate', user)}
          >
            <Text style={globalStyles.buttonText}>⏸️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonSmall,
              { backgroundColor: theme.colors.success, paddingHorizontal: 12 }
            ]}
            onPress={() => handleUserAction('activate', user)}
          >
            <Text style={globalStyles.buttonText}>▶️</Text>
          </TouchableOpacity>
        )}
        
        {user.id !== currentUser.id && (
          <TouchableOpacity
            style={[
              globalStyles.buttonBase,
              globalStyles.buttonDanger,
              globalStyles.buttonSmall,
              { paddingHorizontal: 12 }
            ]}
            onPress={() => handleUserAction('delete', user)}
          >
            <Text style={globalStyles.buttonText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={globalStyles.userManagementContainer}>
      {/* Awesome Header */}
      <View style={[
        globalStyles.dashboardGradientHeader,
        {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundColor: '#667eea',
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
            👥
          </Text>
          <Text style={{
            fontSize: 80,
            color: '#fff',
            position: 'absolute',
            bottom: -10,
            left: -20,
            transform: [{ rotate: '-15deg' }],
          }}>
            👤
          </Text>
          <Text style={{
            fontSize: 60,
            color: '#fff',
            position: 'absolute',
            top: 30,
            left: '40%',
            transform: [{ rotate: '30deg' }],
          }}>
            🛡️
          </Text>
        </View>

        <View style={globalStyles.dashboardHeaderContent}>
          <View style={globalStyles.dashboardGreeting}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32, marginRight: 12 }}>👥</Text>
              <Text style={[globalStyles.dashboardGreetingText, { fontSize: 28 }]}>
                User Management
              </Text>
            </View>
            <Text style={globalStyles.dashboardGreetingSubtext}>
              Manage users, roles, and permissions across the platform
            </Text>
          </View>

          <TouchableOpacity
            style={[globalStyles.dashboardProfileButton, {
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }]}
            onPress={() => navigation.navigate('CreateUser')}
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
              {users?.length || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Total Users
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {users?.filter(u => u.status === 'active').length || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Active
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {users?.filter(u => u.role === 'mechanic').length || 0}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              Mechanics
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[globalStyles.searchBarContainer, { marginTop: 16 }]}>
        <Text style={globalStyles.searchIcon}>🔍</Text>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search users..."
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
      <View style={globalStyles.userFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 12, gap: 8 }}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  globalStyles.userFilterChip,
                  selectedFilter === filter.id && globalStyles.userFilterChipActive
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text style={[
                  globalStyles.userFilterChipText,
                  selectedFilter === filter.id && globalStyles.userFilterChipTextActive
                ]}>
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        style={globalStyles.userListContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
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
            <Text style={globalStyles.emptyStateIcon}>👥</Text>
            <Text style={globalStyles.emptyStateTitle}>No Users Found</Text>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery
                ? 'No users match your search criteria.'
                : 'No users found in this category.'
              }
            </Text>
            <TouchableOpacity
              style={[globalStyles.buttonBase, globalStyles.emptyStateButton]}
              onPress={() => navigation.navigate('CreateUser')}
            >
              <Text style={globalStyles.buttonText}>Add User</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default {
  SystemOverview,
  UserManagement,
};