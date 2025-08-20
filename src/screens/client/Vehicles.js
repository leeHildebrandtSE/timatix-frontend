// Vehicles Component
function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await apiService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
      Alert.alert('Error', 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      await apiService.createVehicle(newVehicle);
      setShowAddModal(false);
      setNewVehicle({
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        vin: '',
      });
      loadVehicles();
      Alert.alert('Success', 'Vehicle added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add vehicle');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadVehicles} />
        }
      >
        {vehicles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No vehicles found</Text>
            <Text style={styles.emptyStateSubtext}>Add your first vehicle to get started</Text>
          </View>
        ) : (
          vehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.vehicleCard}>
              <Text style={styles.vehicleTitle}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
              <Text style={styles.vehicleDetails}>
                License: {vehicle.licensePlate || 'Not provided'}
              </Text>
              <Text style={styles.vehicleDetails}>
                VIN: {vehicle.vin || 'Not provided'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Vehicle</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Make *"
              value={newVehicle.make}
              onChangeText={(text) => setNewVehicle(prev => ({ ...prev, make: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Model *"
              value={newVehicle.model}
              onChangeText={(text) => setNewVehicle(prev => ({ ...prev, model: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Year *"
              value={newVehicle.year}
              onChangeText={(text) => setNewVehicle(prev => ({ ...prev, year: text }))}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="License Plate"
              value={newVehicle.licensePlate}
              onChangeText={(text) => setNewVehicle(prev => ({ ...prev, licensePlate: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="VIN"
              value={newVehicle.vin}
              onChangeText={(text) => setNewVehicle(prev => ({ ...prev, vin: text }))}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddVehicle}>
              <Text style={styles.buttonText}>Add Vehicle</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}