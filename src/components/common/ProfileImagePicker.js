// ProfileImagePicker Component
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const ProfileImagePicker = ({ visible, onClose, onImageSelected, currentImage = null }) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(currentImage);

  const pickImageFromLibrary = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const takePhoto = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 800,
      maxWidth: 800,
      quality: 0.8,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
      }
    });
  };

  const handleSaveImage = () => {
    if (selectedImage) {
      onImageSelected(selectedImage);
      onClose();
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSelectedImage(null);
            onImageSelected(null);
            onClose();
          },
        },
      ]
    );
  };

  const renderImagePreview = () => {
    if (selectedImage) {
      return (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity
            style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.imagePlaceholder, { borderColor: theme.colors.border }]}>
        <Text style={[styles.placeholderIcon, { color: theme.colors.textSecondary }]}>
          📷
        </Text>
        <Text style={[styles.placeholderText, theme.typography.body2, { color: theme.colors.textSecondary }]}>
          No image selected
        </Text>
      </View>
    );
  };

  const renderActionButton = (icon, title, onPress, style = {}) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        style
      ]}
      onPress={onPress}
    >
      <View style={[styles.actionButtonIcon, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={styles.actionButtonIconText}>{icon}</Text>
      </View>
      <Text style={[styles.actionButtonText, theme.typography.body1]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, theme.typography.h4]}>
              Choose Photo
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* Image Preview */}
          <View style={styles.previewSection}>
            {renderImagePreview()}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {renderActionButton('📱', 'Choose from Library', pickImageFromLibrary)}
            {renderActionButton('📷', 'Take Photo', takePhoto)}
            
            {selectedImage && (
              <>
                {renderActionButton(
                  '💾', 
                  'Save Photo', 
                  handleSaveImage,
                  { backgroundColor: theme.colors.primary }
                )}
                {renderActionButton(
                  '🗑️', 
                  'Remove Photo', 
                  handleRemoveImage,
                  { backgroundColor: theme.colors.error + '10' }
                )}
              </>
            )}
          </View>

          {/* Info Text */}
          <Text style={[styles.infoText, theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Choose a photo that represents you or your vehicle. Photos should be clear and appropriate.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: '60%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Image Preview
  previewSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    textAlign: 'center',
  },

  // Action Buttons
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonIconText: {
    fontSize: 20,
  },
  actionButtonText: {
    flex: 1,
    fontWeight: '600',
  },

  // Info Text
  infoText: {
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});

export default ProfileImagePicker;