// Profile Component
function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <Text style={styles.profileRole}>Role: {user?.role}</Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{user?.phoneNumber || 'Not provided'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Member since:</Text>
          <Text style={styles.infoValue}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}