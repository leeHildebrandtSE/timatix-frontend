import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { validateName, validatePhone, validateEmail, validatePassword } from '../../utils/validation';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const Profile = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const { clearNotifications, getUnreadNotificationCount } = useApp();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [notifications, setNotifications] = useState({
    serviceUpdates: true,
    quoteAlerts: true,
    promotions: false,
    reminders: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    const firstNameError = validateName(profileData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateName(profileData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const emailError = validateEmail(profileData.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validatePhone(profileData.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) newErrors.newPassword = passwordError;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    
    try {
      setLoading(true);
      
      // API call to update profile would go here
      // await userService.updateProfile(profileData);
      
      // Update local user data
      updateUser(profileData);
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      setLoading(true);
      
      // API call to change password would go here
      // await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowChangePasswordModal(false);
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'This will permanently delete your account and all associated data.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete Forever', 
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // API call to delete account would go here
                      // await userService.deleteAccount();
                      await logout();
                    } catch (error) {
                      Alert.alert('Error', 'Failed to delete account');
                    }
                  }
                },
              ]
            );
          }
        },
      ]
    );
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderChangePasswordModal = () => (
    <Modal
      visible={showChangePasswordModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, theme.typography.h4]}>
            Change Password
          </Text>
          <TouchableOpacity onPress={() => setShowChangePasswordModal(false)}>
            <Text style={[styles.modalClose, { color: theme.colors.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <Input
            label="Current Password"
            value={passwordData.currentPassword}
            onChangeText={(value) => handlePasswordInputChange('currentPassword', value)}
            placeholder="Enter current password"
            secureTextEntry
            error={passwordErrors.currentPassword}
            required
          />

          <Input
            label="New Password"
            value={passwordData.newPassword}
            onChangeText={(value) => handlePasswordInputChange('newPassword', value)}
            placeholder="Enter new password"
            secureTextEntry
            error={passwordErrors.newPassword}
            required
          />

          <Input
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChangeText={(value) => handlePasswordInputChange('confirmPassword', value)}
            placeholder="Confirm new password"
            secureTextEntry
            error={passwordErrors.confirmPassword}
            required
          />

          <Button
            title="Change Password"
            onPress={handleChangePassword}
            loading={loading}
            disabled={loading}
            style={styles.changePasswordButton}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (loading && !showChangePasswordModal) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LoadingSpinner message="Loading profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, theme.typography.h3]}>
            Profile
          </Text>
          {!isEditing ? (
            <Button
              title="Edit"
              variant="outline"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            />
          ) : (
            <View style={styles.editActions}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => {
                  setIsEditing(false);
                  setErrors({});
                  // Reset form data
                  setProfileData({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    phoneNumber: user?.phoneNumber || '',
                  });
                }}
                style={styles.cancelButton}
              />
              <Button
                title="Save"
                onPress={handleSaveProfile}
                loading={loading}
                disabled={loading}
                style={styles.saveButton}
              />
            </View>
          )}
        </View>

        {/* Profile Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Personal Information
          </Text>

          <Input
            label="First Name"
            value={profileData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            placeholder="Enter your first name"
            editable={isEditing}
            error={errors.firstName}
            required
          />

          <Input
            label="Last Name"
            value={profileData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            placeholder="Enter your last name"
            editable={isEditing}
            error={errors.lastName}
            required
          />

          <Input
            label="Email"
            value={profileData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={isEditing}
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            value={profileData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            editable={isEditing}
            error={errors.phoneNumber}
          />
        </View>

        {/* Account Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Account Information
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, theme.typography.body2]}>Role:</Text>
            <Text style={[styles.infoValue, theme.typography.body2]}>{user?.role}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, theme.typography.body2]}>Member since:</Text>
            <Text style={[styles.infoValue, theme.typography.body2]}>
              {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.changePasswordRow}
            onPress={() => setShowChangePasswordModal(true)}
          >
            <Text style={[styles.changePasswordText, { color: theme.colors.primary }]}>
              Change Password
            </Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Preferences
          </Text>

          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, theme.typography.body2]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, theme.typography.h6]}>
            Notifications
          </Text>

          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, theme.typography.body2]}>Service Updates</Text>
            <Switch
              value={notifications.serviceUpdates}
              onValueChange={() => handleNotificationToggle('serviceUpdates')}
              trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
              thumbColor={notifications.serviceUpdates ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, theme.typography.body2]}>Quote Alerts</Text>
            <Switch
              value={notifications.quoteAlerts}
              onValueChange={() => handleNotificationToggle('quoteAlerts')}
              trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
              thumbColor={notifications.quoteAlerts ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, theme.typography.body2]}>Promotions</Text>
            <Switch
              value={notifications.promotions}
              onValueChange={() => handleNotificationToggle('promotions')}
              trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
              thumbColor={notifications.promotions ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceRow}>
            <Text style={[styles.preferenceLabel, theme.typography.body2]}>Reminders</Text>
            <Switch
              value={notifications.reminders}
              onValueChange={() => handleNotificationToggle('reminders')}
              trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
              thumbColor={notifications.reminders ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.clearNotificationsRow}
            onPress={() => {
              clearNotifications();
              Alert.alert('Success', 'All notifications cleared');
            }}
          >
            <Text style={[styles.clearNotificationsText, { color: theme.colors.primary }]}>
              Clear All Notifications ({getUnreadNotificationCount()})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          />

          <Button
            title="Delete Account"
            variant="danger"
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>

      {renderChangePasswordModal()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 20,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 2,
    textAlign: 'right',
    opacity: 0.8,
  },
  changePasswordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    color: '#C0C0C0',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  preferenceLabel: {
    flex: 1,
  },
  clearNotificationsRow: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  clearNotificationsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  logoutButton: {
    marginBottom: 8,
  },
  deleteButton: {
    marginBottom: 20,
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
  changePasswordButton: {
    marginTop: 24,
  },
});

export default Profile;