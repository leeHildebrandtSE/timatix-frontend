// Register Screen Component
function RegisterScreen({ onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'CLIENT',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.error);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.loginContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join Timatix today</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            secureTextEntry
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData('phoneNumber', text)}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={onNavigateToLogin}
          >
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}