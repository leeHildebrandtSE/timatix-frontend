// Service Requests Component
function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceRequests();
  }, []);

  const loadServiceRequests = async () => {
    try {
      const data = await apiService.getServiceRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return '#FFA500';
      case 'IN_PROGRESS': return '#007AFF';
      case 'COMPLETED': return '#4CAF50';
      case 'CANCELLED': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Requests</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadServiceRequests} />
        }
      >
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No service requests</Text>
          </View>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestTitle}>
                  Request #{request.id}
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(request.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {request.status || 'Unknown'}
                  </Text>
                </View>
              </View>
              <Text style={styles.requestDescription}>
                {request.description || 'No description provided'}
              </Text>
              <Text style={styles.requestDate}>
                Created: {new Date(request.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}