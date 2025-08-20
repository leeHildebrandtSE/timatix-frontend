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