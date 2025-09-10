import React, { useState, useCallback, useContext } from 'react';
import { ScrollView, RefreshControl, Text, View } from 'react-native';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import global from '../../styles/globalStyles';

const ClientDashboard = () => {
  const { theme } = useTheme();
  const { user, vehicles = [], services = [], refreshDashboard } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);

  const styles = global.createGlobalStyles(theme);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshDashboard();
    } catch (error) {
      console.error('Refresh failed', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshDashboard]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Welcome, {user?.name || 'Client'}</Text>
          <Text style={styles.subGreeting}>Here is your dashboard overview</Text>
        </View>
      </View>

      {/* Vehicles Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Vehicles</Text>
        {vehicles.length > 0 ? (
          vehicles.map((v) => (
            <View key={v.id} style={styles.card}>
              <Text>{v.make} {v.model}</Text>
              <Text>{v.licensePlate}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No vehicles added yet.</Text>
          </View>
        )}
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        {services.length > 0 ? (
          services.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text>{s.name}</Text>
              <Text>{s.description}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No services available.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ClientDashboard;
