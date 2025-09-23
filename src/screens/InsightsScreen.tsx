import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DeviceInfo from 'react-native-device-info';

import { theme } from '../theme';
import GlassCard from '../components/GlassCard';
import ScreenBackground from '../components/ScreenBackground';

const { width, height } = Dimensions.get('window');

interface AppUsageData {
  name: string;
  packageName: string;
  batteryImpact: number;
  usageTime: number;
  temperatureImpact: number;
  isSystemApp: boolean;
  icon?: string;
}

interface SummaryStats {
  totalApps: number;
  highImpactApps: number;
  systemApps: number;
  batteryHealth: number;
}

const InsightsScreen = () => {
  const [showSystemApps, setShowSystemApps] = useState(false);
  const [sortBy, setSortBy] = useState<'batteryImpact' | 'usageTime' | 'temperatureImpact'>('batteryImpact');
  const [searchQuery, setSearchQuery] = useState('');
  const [appUsageData, setAppUsageData] = useState<AppUsageData[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsightsData();
  }, []);

  const loadInsightsData = async () => {
    try {
      // Mock data - replace with actual native module calls
      const mockData: AppUsageData[] = [
        {
          name: 'WhatsApp',
          packageName: 'com.whatsapp',
          batteryImpact: 18.5,
          usageTime: 145,
          temperatureImpact: 2.8,
          isSystemApp: false,
        },
        {
          name: 'Chrome',
          packageName: 'com.android.chrome',
          batteryImpact: 15.2,
          usageTime: 89,
          temperatureImpact: 2.3,
          isSystemApp: false,
        },
        {
          name: 'YouTube',
          packageName: 'com.google.android.youtube',
          batteryImpact: 24.6,
          usageTime: 134,
          temperatureImpact: 3.7,
          isSystemApp: false,
        },
        {
          name: 'Instagram',
          packageName: 'com.instagram.android',
          batteryImpact: 12.8,
          usageTime: 67,
          temperatureImpact: 1.9,
          isSystemApp: false,
        },
        {
          name: 'System UI',
          packageName: 'com.android.systemui',
          batteryImpact: 8.1,
          usageTime: 480,
          temperatureImpact: 0.5,
          isSystemApp: true,
        },
        {
          name: 'Android System',
          packageName: 'android',
          batteryImpact: 6.3,
          usageTime: 480,
          temperatureImpact: 0.3,
          isSystemApp: true,
        },
      ];

      setAppUsageData(mockData);
      setSummaryStats({
        totalApps: mockData.length,
        highImpactApps: mockData.filter(app => app.batteryImpact > 15).length,
        systemApps: mockData.filter(app => app.isSystemApp).length,
        batteryHealth: 85,
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = appUsageData
    .filter(app => {
      if (!showSystemApps && app.isSystemApp) return false;
      if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'batteryImpact':
          return b.batteryImpact - a.batteryImpact;
        case 'usageTime':
          return b.usageTime - a.usageTime;
        case 'temperatureImpact':
          return b.temperatureImpact - a.temperatureImpact;
        default:
          return 0;
      }
    });

  const getImpactColor = (impact: number) => {
    if (impact > 20) return '#FF4444';
    if (impact > 10) return '#FFD700';
    return '#00FF88';
  };

  const getImpactLabel = (impact: number) => {
    if (impact > 20) return 'High';
    if (impact > 10) return 'Medium';
    return 'Low';
  };

  const formatUsageTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const SummaryCard = ({ title, value, icon, color }: {
    title: string;
    value: number;
    icon: string;
    color: string;
  }) => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryCardContent}>
        <Icon name={icon} size={20} color={color} />
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
      </View>
    </View>
  );

  const AppUsageCard = ({ app }: { app: AppUsageData }) => (
    <TouchableOpacity style={styles.appCard}>
      <View style={styles.appCardContent}>
        <View style={styles.appInfo}>
          <View style={styles.appIconContainer}>
            <Icon name="android" size={24} color="#B3B3B3" />
          </View>
          
          <View style={styles.appDetails}>
            <Text style={styles.appName} numberOfLines={1}>
              {app.name}
            </Text>
            <Text style={styles.packageName} numberOfLines={1}>
              {app.packageName}
            </Text>
            <View style={styles.tagsRow}>
              {app.isSystemApp && (
                <View style={[styles.tag, { backgroundColor: '#8A2BE2' }]}>
                  <Text style={styles.tagText}>SYS</Text>
                </View>
              )}
              <View style={[styles.tag, { backgroundColor: getImpactColor(app.batteryImpact) }]}>
                <Text style={styles.tagText}>{getImpactLabel(app.batteryImpact).charAt(0)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Icon name="battery-charging-full" size={14} color="#00D4FF" />
            <Text style={styles.metricValue}>{app.batteryImpact.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.metric}>
            <Icon name="access-time" size={14} color="#FFD700" />
            <Text style={styles.metricValue}>{formatUsageTime(app.usageTime)}</Text>
          </View>
          
          <View style={styles.metric}>
            <Icon name="thermostat" size={14} color="#FF6B35" />
            <Text style={styles.metricValue}>{app.temperatureImpact.toFixed(1)}°C</Text>
          </View>
        </View>

        <Icon name="settings" size={20} color="#666666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Icon name="insights" size={24} color="#00D4FF" />
            <Text style={styles.headerTitle}>App Insights</Text>
          </View>
          {summaryStats && (
            <View style={styles.batteryScore}>
              <Text style={styles.scoreText}>{summaryStats.batteryHealth}</Text>
              <Text style={styles.scoreLabel}>Health Score</Text>
            </View>
          )}
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary Cards */}
          <View style={styles.summarySection}>
            <SummaryCard
              title="Total Apps"
              value={summaryStats?.totalApps || 0}
              icon="apps"
              color="#00D4FF"
            />
            <SummaryCard
              title="High Impact"
              value={summaryStats?.highImpactApps || 0}
              icon="warning"
              color="#FF6B35"
            />
            <SummaryCard
              title="System Apps"
              value={summaryStats?.systemApps || 0}
              icon="system-update"
              color="#8A2BE2"
            />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" size={18} color="#B3B3B3" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search apps..."
                placeholderTextColor="#666666"
              />
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsSection}>
            <View style={styles.systemAppsToggle}>
              <Text style={styles.toggleLabel}>Show System Apps</Text>
              <Switch
                value={showSystemApps}
                onValueChange={setShowSystemApps}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: '#00D4FF' }}
                thumbColor="#FFFFFF"
                style={styles.switch}
              />
            </View>
            
            <TouchableOpacity style={styles.sortButton}>
              <Icon name="sort" size={18} color="#B3B3B3" />
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {/* App List */}
          <View style={styles.appListContainer}>
            {filteredApps.map((app) => (
              <AppUsageCard key={app.packageName} app={app} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  batteryScore: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#B3B3B3',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for tab bar
  },

  // Summary Section
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(24, 28, 36, 0.45)',
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  summaryCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 11,
    color: '#B3B3B3',
    textAlign: 'center',
  },

  // Search Section
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 28, 36, 0.45)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Controls Section
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  systemAppsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#B3B3B3',
    marginRight: 8,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sortText: {
    fontSize: 14,
    color: '#B3B3B3',
    marginLeft: 4,
  },

  // App List
  appListContainer: {
    gap: 8,
  },
  appCard: {
    backgroundColor: 'rgba(24, 28, 36, 0.45)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  appCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  // App Info
  appInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  appIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  packageName: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  tagsRow: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Metrics
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  metric: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 40,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
});

export default InsightsScreen;