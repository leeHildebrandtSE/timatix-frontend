import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getAssignedBookings } from '../../services/serviceRequests'; // API call
import { useNavigation } from '@react-navigation/native';

const WorkshopDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAssignedBookings(); // Fetch mechanic's jobs
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const renderBooking = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
    >
      <Text style={styles.vehicle}>{item.vehicle.make} {item.vehicle.model}</Text>
      <Text style={styles.service}>🔧 {item.serviceType}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.date}>📅 {new Date(item.serviceDate).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧰 Workshop Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : bookings.length === 0 ? (
        <Text style={styles.empty}>No assigned bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F2F2',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  empty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  vehicle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  service: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default WorkshopDashboard;