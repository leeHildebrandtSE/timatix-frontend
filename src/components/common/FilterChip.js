// Input.js - FIXED VERSION (key parts)
// =============================================================================
const getInputContainerStyle = () => {
  let containerStyle = {
    ...styles.inputContainer,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  };

  if (isFocused) {
    containerStyle.borderColor = theme.colors.primary;
    containerStyle.borderWidth = 2;
  }

  if (error) {
    containerStyle.borderColor = theme.colors.error;
    containerStyle.borderWidth = 2;
  }

  if (!editable) {
    containerStyle.backgroundColor = theme.colors.disabled; // ✅ FIXED: Use disabled instead of borderLight
    containerStyle.opacity = 0.6;
  }

  return containerStyle;
};