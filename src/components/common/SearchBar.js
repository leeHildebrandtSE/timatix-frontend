import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme, useGlobalStyles } from '../../context/ThemeContext';

const SearchBar = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onClear,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const globalStyles = useGlobalStyles();
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onChangeText) onChangeText('');
    if (onClear) onClear();
  };

  const containerStyles = [
    globalStyles.searchBarContainer,
    isFocused && globalStyles.searchBarFocused,
    style
  ];

  return (
    <View style={containerStyles}>
      <Text style={globalStyles.searchIcon}>🔍</Text>
      
      <TextInput
        style={[globalStyles.searchInput, theme.typography.body2]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textLight}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {value && (
        <TouchableOpacity onPress={handleClear} style={globalStyles.searchClearButton}>
          <Text style={globalStyles.searchClearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;