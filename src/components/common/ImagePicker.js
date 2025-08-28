import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Modal,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 3;

const ImagePicker = ({
  images = [],
  onImagesChange,
  maxImages = 5,
  title = 'Photos',
  style,
}) => {
  const { theme } = useTheme();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddImage = () => {
    if (images.length >= maxImages) {
      Alert.alert(
        'Maximum Images',
        `You can only add up to ${maxImages} images.`
      );
      return;
    }

    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => pickImageFromCamera() },
        { text: 'Gallery', onPress: () => pickImageFromGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickImageFromCamera = () => {
    // Implementation would use expo-image-picker or react-native-image-picker
    console.log('Pick from camera');
    // Mock adding image
    const mockImage = {
      uri: `https://picsum.photos/300/200?random=${Date.now()}`,
      id: Date.now().toString(),
    };
    onImagesChange([...images, mockImage]);
  };

  const pickImageFromGallery = () => {
    // Implementation would use expo-image-picker or react-native-image-picker
    console.log('Pick from gallery');
    // Mock adding image
    const mockImage = {
      uri: `https://picsum.photos/300/200?random=${Date.now()}`,
      id: Date.now().toString(),
    };
    onImagesChange([...images, mockImage]);
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleRemoveImage = (index) => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            onImagesChange(newImages);
            setShowImageModal(false);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, theme.typography.h6]}>
        {title} ({images.length}/{maxImages})
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={image.id || index}
            onPress={() => handleImagePress(index)}
            style={styles.imageContainer}
          >
            <Image source={{ uri: image.uri }} style={styles.image} />
          </TouchableOpacity>
        ))}

        {images.length < maxImages && (
          <TouchableOpacity
            onPress={handleAddImage}
            style={[
              styles.addButton,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
            ]}
          >
            <Text style={[styles.addIcon, { color: theme.colors.primary }]}>+</Text>
            <Text style={[styles.addText, theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Image
              source={{ uri: images[selectedImageIndex]?.uri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <View style={styles.modalActions}>
              <Button
                title="Remove"
                variant="danger"
                onPress={() => handleRemoveImage(selectedImageIndex)}
                style={styles.modalButton}
              />
              <Button
                title="Close"
                variant="outline"
                onPress={() => setShowImageModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 12,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
  },
  addButton: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  addText: {
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default ImagePicker;