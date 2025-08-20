import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserManagement = ({ navigation }) => {
  const { user: currentUser } = useAuth();
  const { users, setUsers, isLoading, setLoading, addNotification } = useApp();
  const { theme } = useTheme();
  
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'

  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'CLIENT',
    isActive: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, selectedRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      // const allUsers = await userService.getAllUsers();
      // setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phoneNumber?.includes(query)
      );
    }

    // Filter by role
    if (selectedRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'CLIENT',
      isActive: true,
    });
    setSelectedUser(null);
    setModalMode('create');
    setShowUserModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setUserForm(user);
    setModalMode('view');
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm(user);
    setModalMode('edit');
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // API call to delete user
              // await userService.deleteUser(user.id);
              
              // Update local state
              setUsers(users.filter(u => u.id !== user.id));
              
              addNotification({
                title: 'User Deleted',
                message: `${user.firstName} ${user.lastName} has been deleted.`,
                type: 'success',
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          }
        },
      ]
    );
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const newStatus = !user.isActive;
      const action = newStatus ? 'activate' : 'deactivate';
      
      Alert.alert(
        `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
        `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: action.charAt(0).toUpperCase() + action.slice(1),
            onPress: async () => {
              try {
                // API call to toggle user status
                // await userService.updateUserStatus(user.id, newStatus);
                
                // Update local state
                const updatedUsers = users.map(u => 
                  u.id === user.id ? { ...u, isActive: newStatus } : u
                );
                setUsers(updatedUsers);
                
                addNotification({
                  title: `User ${action.charAt(0).toUpperCase() + action.slice(1)}d`,
                  message: `${user.firstName} ${user.lastName} has been ${action}d.`,
                  type: 'success',
                });
              } catch (error) {
                Alert.alert('Error', `Failed to ${action} user`);
              }
            }
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update user status');
    }
  };

  const handleSaveUser = async () => {
    try {
      // Validate form
      if (!userForm.firstName || !userForm.lastName || !userForm.email) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      if (modalMode === 'create') {
        // API call to create user
        // const newUser = await userService.createUser(userForm);
        
        // Mock new user
        const newUser = {
          id: Date.now().toString(),
          ...userForm,
          createdAt: new Date().toISOString(),
        };
        
        setUsers([...users, newUser]);
        
        addNotification({
          title: 'User Created',
          message: `${userForm.firstName} ${userForm.lastName} has been created.`,
          type: 'success',
        });
      } else if (modalMode === 'edit') {
        // API call to update user
        // await userService.updateUser(selectedUser.id, userForm);
        
        // Update local state
        const updatedUsers = users.map(u => 
          u.id === selectedUser.id ? { ...u, ...userForm } : u
        );
        setUsers(updatedUsers);
        
        addNotification({
          title: 'User Updated',
          message: `${userForm.firstName} ${userForm.lastName} has been updated.`,
          type: 'success',
        });
      }

      setShowUserModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save user');
    }
  };

  const renderUserCard = ({ item: user }) => (
    <View style={[styles.userCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, theme.typography.h6]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={[styles.userEmail, theme.typography.body2]}>
            {user.email}
          </Text>
          <Text style={[styles.userPhone, theme.typography.caption]}>
            {user.phoneNumber || 'No phone number'}
          </Text>
        </View>
        
        <View style={styles.userBadges}>
          <View style={[
            styles.roleBadge, 
            { backgroundColor: getRoleColor(user.role) }
          ]}>
            <Text style={styles.roleBadgeText}>{user.role}</Text>
          </View>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: user.isActive ? theme.colors.success : theme.colors.error }
          ]}>
            <Text style={styles.statusBadgeText}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleViewUser(user)}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => handleEditUser(user)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: user.isActive ? theme.colors.warning : theme.colors.success 
          }]}
          onPress={() => handleToggleUserStatus(user)}
        >
          <Text style={styles.actionButtonText}>
            {user.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => handleDeleteUser(user)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return theme.colors.error;
      case 'MECHANIC': return theme.colors.warning;
      case 'CLIENT': return theme.colors.primary;
      default: return theme.colors.secondary;
    }
  };

  const renderUserModal = () => (
    <Modal
      visible={showUserModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, theme.typography.h4]}>
            {modalMode === 'create' ? 'Create User' : 
             modalMode === 'edit' ? 'Edit User' : 'User Details'}
          </Text>
          <TouchableOpacity onPress={() => setShowUserModal(false)}>
            <Text style={[styles.modalClose, { color: theme.colors.primary }]}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, theme.typography.body2]}>First Name *</Text>
            <TextInput
              style={[styles.formInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }]}
              value={userForm.firstName}
              onChangeText={(text) => setUserForm(prev => ({ ...prev, firstName: text }))}
              placeholder="Enter first name"
              editable={modalMode !== 'view'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, theme.typography.body2]}>Last Name *</Text>
            <TextInput
              style={[styles.formInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }]}
              value={userForm.lastName}
              onChangeText={(text) => setUserForm(prev => ({ ...prev, lastName: text }))}
              placeholder="Enter last name"
              editable={modalMode !== 'view'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, theme.typography.body2]}>Email *</Text>
            <TextInput
              style={[styles.formInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }]}
              value={userForm.email}
              onChangeText={(text) => setUserForm(prev => ({ ...prev, email: text }))}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={modalMode !== 'view'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, theme.typography.body2]}>Phone Number</Text>
            <TextInput
              style={[styles.formInput, { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }]}
              value={userForm.phoneNumber}
              onChangeText={(text) => setUserForm(prev => ({ ...prev, phoneNumber: text }))}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              editable={modalMode !== 'view'}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, theme.typography.body2]}>Role *</Text>
            <View style={styles.roleButtons}>
              {['CLIENT', 'MECHANIC', 'ADMIN'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    userForm.role === role && { backgroundColor: theme.colors.primary },
                    modalMode === 'view' && styles.disabledButton,
                  ]}
                  onPress={() => modalMode !== 'view' && setUserForm(prev => ({ ...prev, role }))}
                  disabled={modalMode === 'view'}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      userForm.role === role && { color: '#fff' },
                      { color: theme.colors.text },
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {selectedUser && (
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, theme.typography.body2]}>Created At</Text>
              <Text style={[styles.formValue, theme.typography.body2]}>
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}

          {modalMode !== 'view' && (
            <Button
              title={modalMode === 'create' ? 'Create User' : 'Save Changes'}
              onPress={handleSaveUser}
              style={styles.saveButton}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading users..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, theme.typography.h3]}>
          User Management
        </Text>
        <Button
          title="+ Add User"
          onPress={handleCreateUser}
          style={styles.addButton}
        />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
            }]}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleFilters}>
          {['ALL', 'CLIENT', 'MECHANIC', 'ADMIN'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleFilter,
                selectedRole === role && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.roleFilterText,
                  selectedRole === role && { color: '#fff' },
                  { color: theme.colors.text },
                ]}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* User Count */}
      <View style={styles.userCount}>
        <Text style={[styles.userCountText, theme.typography.body2]}>
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.userList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, theme.typography.body1]}>
              No users found
            </Text>
            <Text style={[styles.emptyStateSubtext, theme.typography.body2]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />

      {renderUserModal()}
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
    borderColor: '#E0E0E0',
  },
  roleFilters: {
    flexDirection: 'row',
  },
  roleFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  roleFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  userCount: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  userCountText: {
    opacity: 0.7,
  },
  userList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    marginBottom: 2,
    opacity: 0.8,
  },
  userPhone: {
    opacity: 0.6,
  },
  userBadges: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    marginBottom: 8,
  },
  emptyStateSubtext: {
    opacity: 0.6,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    flex: 1,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  formInput: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formValue: {
    opacity: 0.7,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  roleButtonText: {
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButton: {
    marginTop: 24,
  },
});

export default UserManagement;