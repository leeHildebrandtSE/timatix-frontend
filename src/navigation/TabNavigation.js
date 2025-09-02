function TabNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  if (!user) return <LoadingScreen />;

  const tabs = useMemo(() => {
    const baseTabs = [
      { key: 'dashboard', title: 'Dashboard', icon: '📊' },
      { key: 'profile', title: 'Profile', icon: '👤' },
    ];

    switch (user.role) {
      case 'CLIENT':
        return [
          baseTabs[0],
          { key: 'vehicles', title: 'Vehicles', icon: '🚗' },
          { key: 'requests', title: 'Requests', icon: '🔧' },
          baseTabs[1],
        ];
      case 'MECHANIC':
        return [
          baseTabs[0],
          { key: 'requests', title: 'Jobs', icon: '🔧' },
          baseTabs[1],
        ];
      case 'ADMIN':
        return [
          baseTabs[0],
          { key: 'requests', title: 'All Requests', icon: '🔧' },
          baseTabs[1],
        ];
      default:
        return baseTabs;
    }
  }, [user.role]);

  const content = useMemo(() => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'vehicles': return <Vehicles />;
      case 'requests': return <ServiceRequests />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  }, [activeTab]);

  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabContent}>
        {content}
      </View>
      
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
            accessibilityLabel={tab.title}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabTitle, activeTab === tab.key && styles.tabTitleActive]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
