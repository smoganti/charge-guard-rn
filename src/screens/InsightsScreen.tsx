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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DeviceInfo from 'react-native-device-info';

import { theme } from '../theme';
import GlassCard from '../components/GlassCard';
import ScreenBackground from '../components/ScreenBackground';

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
    if (impact > 20) return theme.colors.impact.high;
    if (impact > 10) return theme.colors.impact.medium;
    return theme.colors.impact.low;
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
    <GlassCard style={styles.summaryCard}>
      <View style={styles.summaryCardContent}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
      </View>
    </GlassCard>
  );

  const AppUsageCard = ({ app }: { app: AppUsageData }) => (
    <GlassCard style={styles.appCard}>
      <View style={styles.appCardContent}>
        <View style={styles.appInfo}>
          <View style={styles.appIconContainer}>
            <Icon name="android" size={32} color={theme.colors.textSecondary} />
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
                <View style={[styles.tag, { backgroundColor: theme.colors.category.system }]}>
                  <Text style={styles.tagText}>System</Text>
                </View>
              )}
              <View style={[styles.tag, { backgroundColor: getImpactColor(app.batteryImpact) }]}>
                <Text style={styles.tagText}>{getImpactLabel(app.batteryImpact)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Icon name="battery-charging-full" size={16} color={theme.colors.primary} />
            <Text style={styles.metricValue}>{app.batteryImpact.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Impact</Text>
          </View>
          
          <View style={styles.metric}>
            <Icon name="access-time" size={16} color={theme.colors.warning} />
            <Text style={styles.metricValue}>{formatUsageTime(app.usageTime)}</Text>
            <Text style={styles.metricLabel}>Usage</Text>
          </View>
          
          <View style={styles.metric}>
            <Icon name="thermostat" size={16} color={theme.colors.secondary} />
            <Text style={styles.metricValue}>{app.temperatureImpact.toFixed(1)}°C</Text>
            <Text style={styles.metricLabel}>Temp</Text>
          </View>
        </View>

        <Icon name="chevron-right" size={24} color={theme.colors.textMuted} />
      </View>
    </GlassCard>
  );

  return (
    <ScreenBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Icon name="insights" size={28} color={theme.colors.primary} />
            <Text style={styles.headerTitle}>App Insights</Text>
          </View>
          {summaryStats && (
            <View style={styles.batteryScore}>
              <Text style={styles.scoreText}>{summaryStats.batteryHealth}</Text>
              <Text style={styles.scoreLabel}>Health Score</Text>
            </View>
          )}
        </View>

        {/* Summary Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.summarySection}
          contentContainerStyle={styles.summaryContent}
        >
          <SummaryCard
            title="Total Apps"
            value={summaryStats?.totalApps || 0}
            icon="apps"
            color={theme.colors.primary}
          />
          <SummaryCard
            title="High Impact"
            value={summaryStats?.highImpactApps || 0}
            icon="warning"
            color={theme.colors.secondary}
          />
          <SummaryCard
            title="System Apps"
            value={summaryStats?.systemApps || 0}
            icon="system-update"
            color={theme.colors.accent}
          />
        </ScrollView>

        {/* Search Bar */}
        <GlassCard style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search apps..."
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        </GlassCard>

        {/* Controls */}
        <View style={styles.controlsSection}>
          <View style={styles.systemAppsToggle}>
            <Text style={styles.toggleLabel}>Show System Apps</Text>
            <Switch
              value={showSystemApps}
              onValueChange={setShowSystemApps}
              trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
              thumbColor={theme.colors.text}
            />
          </View>
          
          <TouchableOpacity style={styles.sortButton}>
            <Icon name="sort" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {/* App List */}
        <FlatList
          data={filteredApps}
          renderItem={({ item }) => <AppUsageCard app={item} />}
          keyExtractor={(item) => item.packageName}
          showsVerticalScrollIndicator={false}
          style={styles.appList}
          contentContainerStyle={styles.appListContent}
        />
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h1,
    marginLeft: theme.spacing.s,
  },
  batteryScore: {
    alignItems: 'center',
  },
  scoreText: {
    ...theme.typography.h2,
    color: theme.colors.success,
  },
  scoreLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  // Summary Section
  summarySection: {
    marginBottom: theme.spacing.l,
  },
  summaryContent: {
    paddingHorizontal: theme.spacing.xs,
  },
  summaryCard: {
    width: 100,
    marginRight: theme.spacing.s,
  },
  summaryCardContent: {
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  summaryValue: {
    ...theme.typography.h3,
    marginTop: theme.spacing.s,
  },
  summaryTitle: {
    ...theme.typography.caption,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },

  // Search Section
  searchContainer: {
    marginBottom: theme.spacing.m,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.text,
    marginLeft: theme.spacing.s,
  },

  // Controls Section
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  systemAppsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.s,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
  },
  sortText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },

  // App List
  appList: {
    flex: 1,
  },
  appListContent: {
    paddingBottom: theme.spacing.xxl,
  },
  appCard: {
    marginBottom: theme.spacing.s,
  },
  appCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },

  // App Info
  appInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  appIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    ...theme.typography.subtitle2,
    color: theme.colors.text,
    marginBottom: 2,
  },
  packageName: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xs,
  },
  tagsRow: {
    flexDirection: 'row',
  },
  tag: {
    ...theme.components.tag,
    marginRight: theme.spacing.xs,
  },
  tagText: {
    ...theme.typography.overline,
    fontSize: 10,
    color: theme.colors.text,
  },

  // Metrics
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  metric: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.s,
  },
  metricValue: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  metricLabel: {
    ...theme.typography.overline,
    fontSize: 10,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
});

export default InsightsScreen;