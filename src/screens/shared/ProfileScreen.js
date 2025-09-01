// Enhanced Profile Screen with improved UI and photo upload
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
  Image,
  Dimensions,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProfileImagePicker from '../../components/common/ProfileImagePicker';
import { validateName, validatePhone, validateEmail, validatePassword } from '../../utils/validation';
import { formatDate } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const { clearNotifications, getUnreadNotificationCount } = useApp();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profileImage: user?.profileImage || null,
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
        profileImage: user.profileImage || null,
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleImageSelected = (imageUri) => {
    setProfileData(prev => ({
      ...prev,
      profileImage: imageUri,
    }));
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

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    
    try {
      setLoading(true);
      
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

  const renderProfileHeader = () => (
    <View style={[styles.profileHeader, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity 
          style={styles.profileImageWrapper}
          onPress={() => setShowImagePicker(true)}
          disabled={!isEditing}
        >
          {profileData.profileImage ? (
            <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.profileImageInitials, { color: theme.colors.primary }]}>
                {(profileData.firstName?.[0] || '') + (profileData.lastName?.[0] || '')}
              </Text>
            </View>
          )}
          {isEditing && (
            <View style={[styles.cameraIconContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileHeaderInfo}>
        <Text style={[styles.profileName, { color: '#fff' }]}>
          {profileData.firstName} {profileData.lastName}
        </Text>
        <Text style={[styles.profileRole, { color: 'rgba(255,255,255,0.8)' }]}>
          {user?.role}
        </Text>
        <View style={styles.memberSinceContainer}>
          <Text style={[styles.memberSinceText, { color: 'rgba(255,255,255,0.7)' }]}>
            Member since {user?.createdAt ? formatDate(user.createdAt).split(',')[1] : 'Unknown'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSection = (title, children, customStyle = {}) => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface }, customStyle]}>
      <Text style={[styles.sectionTitle, theme.typography.h6]}>
        {title}
      </Text>
      {children}
    </View>
  );

  const renderPreferenceRow = (label, value, onToggle, description = null) => (
    <View style={styles.preferenceContainer}>
      <View style={styles.preferenceRow}>
        <View style={styles.preferenceInfo}>
          <Text style={[styles.preferenceLabel, theme.typography.body1]}>{label}</Text>
          {description && (
            <Text style={[styles.preferenceDescription, theme.typography.caption]}>
              {description}
            </Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: theme.colors.primary }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#E0E0E0"
        />
      </View>
    </View>
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
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Profile Header */}
        {renderProfileHeader()}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {!isEditing ? (
            <Button
              title="✏️ Edit Profile"
              onPress={() => setIsEditing(true)}
              style={[styles.actionButton, styles.editButton]}
              variant="outline"
            />
          ) : (
            <View style={styles.editActions}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => {
                  setIsEditing(false);
                  setErrors({});
                  setProfileData({
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    email: user?.email || '',
                    phoneNumber: user?.phoneNumber || '',
                    profileImage: user?.profileImage || null,
                  });
                }}
                style={[styles.actionButton, styles.cancelButton]}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                loading={loading}
                disabled={loading}
                style={[styles.actionButton, styles.saveButton]}
              />
            </View>
          )}
        </View>

        {/* Personal Information */}
        {renderSection('Personal Information', (
          <View style={styles.inputsContainer}>
            <Input
              label="First Name"
              value={profileData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder="Enter your first name"
              editable={isEditing}
              error={errors.firstName}
              required
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Last Name"
              value={profileData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder="Enter your last name"
              editable={isEditing}
              error={errors.lastName}
              required
              containerStyle={styles.inputContainer}
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
              containerStyle={styles.inputContainer}
            />

            <Input
              label="Phone Number"
              value={profileData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              editable={isEditing}
              error={errors.phoneNumber}
              containerStyle={styles.inputContainer}
            />
          </View>
        ))}

        {/* Security Settings */}
        {renderSection('Security', (
          <View style={styles.securityContainer}>
            <TouchableOpacity
              style={[styles.securityOption, { borderColor: theme.colors.border }]}
              onPress={() => setShowChangePasswordModal(true)}
            >
              <View style={styles.securityOptionContent}>
                <View style={[styles.securityIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Text style={styles.securityIconText}>🔒</Text>
                </View>
                <View style={styles.securityOptionText}>
                  <Text style={[styles.securityOptionTitle, theme.typography.body1]}>
                    Change Password
                  </Text>
                  <Text style={[styles.securityOptionDescription, theme.typography.caption]}>
                    Update your account password
                  </Text>
                </View>
              </View>
              <Text style={[styles.chevron, { color: theme.colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* App Preferences */}
        {renderSection('Preferences', (
          <View style={styles.preferencesContainer}>
            {renderPreferenceRow(
              'Dark Mode', 
              isDark, 
              toggleTheme,
              'Switch between light and dark themes'
            )}
          </View>
        ))}

        {/* Notification Settings */}
        {renderSection('Notifications', (
          <View style={styles.preferencesContainer}>
            {renderPreferenceRow(
              'Service Updates', 
              notifications.serviceUpdates, 
              () => setNotifications(prev => ({ ...prev, serviceUpdates: !prev.serviceUpdates })),
              'Get notified about service progress'
            )}
            
            {renderPreferenceRow(
              'Quote Alerts', 
              notifications.quoteAlerts, 
              () => setNotifications(prev => ({ ...prev, quoteAlerts: !prev.quoteAlerts })),
              'Receive notifications for new quotes'
            )}
            
            {renderPreferenceRow(
              'Promotions', 
              notifications.promotions, 
              () => setNotifications(prev => ({ ...prev, promotions: !prev.promotions })),
              'Special offers and discounts'
            )}
            
            {renderPreferenceRow(
              'Reminders', 
              notifications.reminders, 
              () => setNotifications(prev => ({ ...prev, reminders: !prev.reminders })),
              'Maintenance and appointment reminders'
            )}

            <TouchableOpacity
              style={[styles.clearNotificationsButton, { backgroundColor: theme.colors.info + '10' }]}
              onPress={() => {
                clearNotifications();
                Alert.alert('Success', 'All notifications cleared');
              }}
            >
              <Text style={[styles.clearNotificationsText, { color: theme.colors.primary }]}>
                🔔 Clear All Notifications ({getUnreadNotificationCount()})
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Account Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="🚪 Sign Out"
            variant="outline"
            onPress={() => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', style: 'destructive', onPress: logout }
                ]
              );
            }}
            style={[styles.actionButton, styles.signOutButton]}
          />

          <Button
            title="🗑️ Delete Account"
            variant="danger"
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'This action cannot be undone. All your data will be permanently deleted.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete Forever', style: 'destructive', onPress: logout }
                ]
              );
            }}
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <ProfileImagePicker
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={handleImageSelected}
      />

      {/* Change Password Modal - keeping original modal structure */}
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
    paddingBottom: 40,
  },
  
  // Enhanced Profile Header
  profileHeader: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageInitials: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    fontSize: 16,
  },
  profileHeaderInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  memberSinceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberSinceText: {
    fontSize: 14,
  },

  // Action Buttons
  actionButtonsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  editButton: {
    borderWidth: 2,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },

  // Enhanced Sections
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '700',
    fontSize: 18,
  },

  // Input Styling
  inputsContainer: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },

  // Security Options
  securityContainer: {
    gap: 12,
  },
  securityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  securityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityIconText: {
    fontSize: 20,
  },
  securityOptionText: {
    flex: 1,
  },
  securityOptionTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  securityOptionDescription: {
    opacity: 0.7,
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },

  // Preferences
  preferencesContainer: {
    gap: 8,
  },
  preferenceContainer: {
    paddingVertical: 4,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceLabel: {
    fontWeight: '600',
    marginBottom: 2,
  },
  preferenceDescription: {
    opacity: 0.7,
    lineHeight: 16,
  },
  clearNotificationsButton: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearNotificationsText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Actions Section
  actionsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  signOutButton: {
    borderWidth: 2,
    borderRadius: 12,
  },
  deleteButton: {
    borderRadius: 12,
    marginBottom: 20,
  },
});

export default Profile;