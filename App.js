import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// API Configuration
const getApiUrl = () => {
  // Use your actual IP address from ipconfig
  return 'http://172.21.5.129:8081/api';
};

// Auth Context
const AuthContext = createContext();

// Mock AsyncStorage for demo (replace with actual AsyncStorage in your app)
const MockStorage = {
  store: {},
  async setItem(key, value) {
    this.store[key] = value;
  },
  async getItem(key) {
    return this.store[key] || null;
  },
  async removeItem(key) {
    delete this.store[key];
  }
};

// API Service
const apiService = {
  baseURL: getApiUrl(),
  token: null,

  setToken(token) {
    this.token = token;
  },

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Auth endpoints
  async login(email, password) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Vehicle endpoints
  async getVehicles() {
    return this.request('/vehicles');
  },

  async createVehicle(vehicleData) {
    return this.request('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  // Service Request endpoints
  async getServiceRequests() {
    return this.request('/service-requests');
  },

  async createServiceRequest(requestData) {
    return this.request('/service-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Dashboard metrics
  async getDashboardMetrics() {
    return this.request('/metrics/dashboard');
  },

  // User endpoints
  async getUsers() {
    return this.request('/users');
  },
};

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await MockStorage.getItem('token');
      const userData = await MockStorage.getItem('user');
      
      if (token && userData) {
        apiService.setToken(token);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.token && response.user) {
        await MockStorage.setItem('token', response.token);
        await MockStorage.setItem('user', JSON.stringify(response.user));
        
        apiService.setToken(response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await MockStorage.removeItem('token');
    await MockStorage.removeItem('user');
    apiService.setToken(null);
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      if (response.token && response.user) {
        await MockStorage.setItem('token', response.token);
        await MockStorage.setItem('user', JSON.stringify(response.user));
        
        apiService.setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Login Screen Component
function LoginScreen({ onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  const fillDemoCredentials = (role) => {
    switch (role) {
      case 'client':
        setEmail('john.doe@email.com');
        setPassword('client123');
        break;
      case 'mechanic':
        setEmail('mike@timatix.com');
        setPassword('mechanic123');
        break;
      case 'admin':
        setEmail('admin@timatix.com');
        setPassword('admin123');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Timatix</Text>
          <Text style={styles.headerSubtitle}>Vehicle Service Management</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={onNavigateToRegister}
          >
            <Text style={styles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo Accounts:</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('client')}
            >
              <Text style={styles.demoButtonText}>Client</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('mechanic')}
            >
              <Text style={styles.demoButtonText}>Mechanic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('admin')}
            >
              <Text style={styles.demoButtonText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

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

// Dashboard Component
function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await apiService.getDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadDashboard} />
      }
    >
      <View style={styles.dashboardHeader}>
        <Text style={styles.welcomeText}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.roleText}>Role: {user?.role}</Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>
            {metrics?.totalServiceRequests || 0}
          </Text>
          <Text style={styles.metricLabel}>Service Requests</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>
            {metrics?.totalVehicles || 0}
          </Text>
          <Text style={styles.metricLabel}>Vehicles</Text>
        </View>

        {user?.role === 'ADMIN' && (
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>
              {metrics?.totalUsers || 0}
            </Text>
            <Text style={styles.metricLabel}>Users</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

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

// Tab Navigation Component
function TabNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vehicles':
        return <Vehicles />;
      case 'requests':
        return <ServiceRequests />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  const getTabsForRole = () => {
    const baseTabs = [
      { key: 'dashboard', title: 'Dashboard', icon: '📊' },
      { key: 'profile', title: 'Profile', icon: '👤' },
    ];

    if (user?.role === 'CLIENT') {
      return [
        baseTabs[0],
        { key: 'vehicles', title: 'Vehicles', icon: '🚗' },
        { key: 'requests', title: 'Requests', icon: '🔧' },
        baseTabs[1],
      ];
    } else if (user?.role === 'MECHANIC') {
      return [
        baseTabs[0],
        { key: 'requests', title: 'Jobs', icon: '🔧' },
        baseTabs[1],
      ];
    } else { // ADMIN
      return [
        baseTabs[0],
        { key: 'requests', title: 'All Requests', icon: '🔧' },
        baseTabs[1],
      ];
    }
  };

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
      
      <View style={styles.tabBar}>
        {getTabsForRole().map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.tabItemActive
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabTitle,
              activeTab === tab.key && styles.tabTitleActive
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Main App Component
export default function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <AuthContent
        showRegister={showRegister}
        setShowRegister={setShowRegister}
      />
    </AuthProvider>
  );
}

// Auth Content Component
function AuthContent({ showRegister, setShowRegister }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return showRegister ? (
      <RegisterScreen onNavigateToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />
    );
  }

  return <TabNavigation />;
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    padding: 10,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  demoSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  demoButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dashboardHeader: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#666',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,
  },
  metricCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
    margin: 5,
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  vehicleCard: {
    backgroundColor: 'white',
    padding: 15,
    margin: 15,
    borderRadius: 10,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vehicleDetails: {