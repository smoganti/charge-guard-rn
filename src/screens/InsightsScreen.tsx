import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme';
import GlassCard from '../components/GlassCard';
import ScreenBackground from '../components/ScreenBackground';

const { BatteryStatsModule } = NativeModules;
const { width, height } = Dimensions.get('window');

export const InsightsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [allAppStats, setAllAppStats] = useState([]);
  const [showSystemApps, setShowSystemApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const toggleAnim = useRef(new Animated.Value(showSystemApps ? 1 : 0)).current;
  const animatedWidths = useRef(new Map()).current;

  useEffect(() => {
    checkAndRequestPermission();
  }, []);

  const checkAndRequestPermission = async () => {
    try {
      // For PACKAGE_USAGE_STATS, we need to direct users to system settings
      const appOps = await NativeModules.BatteryStatsModule.checkUsageStatsPermission();
      if (appOps) {
        setHasPermission(true);
        loadAppUsageStats();
      } else {
        Alert.alert(
          "Permission Required",
          "ChargeGuard needs access to battery usage stats. Please enable it in Settings.",
          [
            {
              text: "Open Settings",
              onPress: () => {
                NativeModules.BatteryStatsModule.openUsageSettings();
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      }
    } catch (err) {
      console.warn(err);
      Alert.alert(
        "Error",
        "Could not check permission status. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const loadAppUsageStats = async (includeSystem = showSystemApps) => {
    setLoading(true);
    try {
      const stats = await BatteryStatsModule.getAppUsageStats(includeSystem);
      // Deduplicate and aggregate by packageName
      const statsWithIds = (stats || []).map((s) => ({
        ...s,
        id: `${s.packageName}`,
      }));
      const aggregated = new Map();
      statsWithIds.forEach((s) => {
        if (!s || !s.packageName) return;
        const key = s.packageName;
        const existing = aggregated.get(key);
        if (!existing) {
          aggregated.set(key, { ...s });
        } else {
          existing.powerUsage = (existing.powerUsage || 0) + (s.powerUsage || 0);
          existing.usageTime = Math.max(existing.usageTime || 0, s.usageTime || 0);
          if (s.icon) existing.icon = s.icon;
          if (s.appName) existing.appName = s.appName;
        }
      });
      let results = Array.from(aggregated.values());
      results.sort((a, b) => (b.powerUsage || 0) - (a.powerUsage || 0));
      setAllAppStats(results.map((r) => ({ ...r, id: r.packageName })));
      // Animate power bars
      const maxPower = results.length > 0 ? Math.max(...results.map(r => r.powerUsage || 0)) : 1;
      results.forEach(item => {
        const key = item.packageName;
        const targetPercent = maxPower > 0 ? ((item.powerUsage || 0) / maxPower) * 100 : 0;
        let av = animatedWidths.get(key);
        if (!av) {
          av = new Animated.Value(0);
          animatedWidths.set(key, av);
        }
        Animated.timing(av, {
          toValue: targetPercent,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      });
    } catch (error) {
      console.error('Error loading app stats:', error);
      Alert.alert('Error', 'Failed to load app statistics');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowSystemApps = useCallback(() => {
    const next = !showSystemApps;
    setShowSystemApps(next);
    Animated.sequence([
      Animated.timing(toggleAnim, { toValue: next ? 1 : 0, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
    ]).start();
    loadAppUsageStats(next);
  }, [showSystemApps, toggleAnim]);

  const showAppDetails = async (packageName: string) => {
    try {
      const details = await BatteryStatsModule.getDetailedAppStats(packageName);
      setSelectedApp(details);
    } catch (error) {
      console.error('Error loading app details:', error);
      Alert.alert('Error', 'Failed to load app details');
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  };

  const renderAppItem = ({ item }) => {
    const av = animatedWidths.get(item.packageName) || new Animated.Value(0);
    const widthInterpolate = av.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });
    return (
      <TouchableOpacity
        onPress={() => showAppDetails(item.packageName)}
        style={styles.appItem}>
        <View style={styles.appHeader}>
          <View style={[styles.appIcon, !item.icon && styles.appIconPlaceholder]}>
            {item.icon ? (
              <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.appIconImage} />
            ) : (
              <Text style={styles.appIconLetter}>{item.appName ? item.appName.charAt(0).toUpperCase() : '?'}</Text>
            )}
          </View>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>{item.appName}</Text>
            <Text style={styles.packageName}>{item.packageName}</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.powerUsage}>{(item.powerUsage || 0).toFixed(1)}mAh</Text>
            <Text style={styles.usageTime}>{formatDuration(item.usageTime || 0)}</Text>
          </View>
        </View>
        <Animated.View style={[styles.powerBar, { width: widthInterpolate, backgroundColor: theme.colors.primary }]} />
      </TouchableOpacity>
    );
  };

  const renderAppDetails = () => {
    if (!selectedApp) return null;

    return (
      <GlassCard style={styles.detailsCard}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedApp(null)}>
          <Icon name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.detailsHeader}>
            <View style={[styles.detailsIcon, !selectedApp.icon && styles.appIconPlaceholder]}>
              {selectedApp.icon ? (
                <Image 
                  source={{ uri: `data:image/png;base64,${selectedApp.icon}` }}
                  style={styles.appIconImage}
                />
              ) : (
                <Text style={styles.appIconLetter}>
                  {selectedApp.appName.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          <View>
            <Text style={styles.detailsName}>{selectedApp.appName}</Text>
            <Text style={styles.detailsPackage}>{selectedApp.packageName}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Icon name="flash-on" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>
              {selectedApp.powerUsage.toFixed(1)}mAh
            </Text>
            <Text style={styles.statLabel}>Total Power Usage</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="access-time" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>
              {formatDuration(selectedApp.usageTime)}
            </Text>
            <Text style={styles.statLabel}>Active Usage</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="storage" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>
              {(selectedApp.cpuTimeMs / 1000).toFixed(1)}s
            </Text>
            <Text style={styles.statLabel}>CPU Time</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="notifications" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{selectedApp.wakelocksCount}</Text>
            <Text style={styles.statLabel}>Wakelocks</Text>
          </View>
        </View>

        <View style={styles.usageBreakdown}>
          <Text style={styles.breakdownTitle}>Usage Breakdown</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Foreground</Text>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${(selectedApp.foregroundPowerUsage / selectedApp.powerUsage) * 100}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={styles.breakdownValue}>
              {(selectedApp.foregroundPowerUsage || 0).toFixed(1)}mAh
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Background</Text>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${(selectedApp.backgroundPowerUsage / selectedApp.powerUsage) * 100}%`,
                    backgroundColor: theme.colors.secondary,
                  },
                ]}
              />
            </View>
            <Text style={styles.breakdownValue}>
              {(selectedApp.backgroundPowerUsage || 0).toFixed(1)}mAh
            </Text>
          </View>
        </View>
      </GlassCard>
    );
  };

  if (!hasPermission) {
    return (
      <ScreenBackground>
        <View style={styles.loadingContainer}>
          <Icon name="lock" size={48} color={theme.colors.textSecondary} />
          <Text style={[styles.loadingText, { marginTop: 16 }]}>
            Permission Required
          </Text>
          <Text style={styles.permissionText}>
            ChargeGuard needs access to battery usage stats to show you detailed app consumption data.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={checkAndRequestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading app statistics...</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>App Power Usage</Text>
          {(() => {
            const bg = showSystemApps ? theme.colors.primary : theme.colors.elevation3;
            const border = showSystemApps ? 'transparent' : theme.colors.border;
            const tint = showSystemApps ? theme.colors.text : theme.colors.textSecondary;
            return (
              <TouchableOpacity
                onPress={toggleShowSystemApps}
                accessibilityRole="button"
                accessibilityLabel={showSystemApps ? 'Hide system apps' : 'Show system apps'}
                activeOpacity={0.85}
                style={[styles.systemToggle, { backgroundColor: bg, borderColor: border }]}
              >
                <Animated.View style={{ transform: [{ scale: toggleAnim.interpolate({ inputRange: [0,1], outputRange: [1, 1.08] }) }]}}>
                  <Icon
                    name={showSystemApps ? 'visibility' : 'visibility-off'}
                    size={16}
                    color={tint}
                    style={{ marginRight: 8 }}
                  />
                </Animated.View>
                <Text style={[styles.systemToggleText, { color: tint }]}>
                  {showSystemApps ? 'Showing system' : 'Show system'}
                </Text>
              </TouchableOpacity>
            );
          })()}
        </View>
        <FlatList
          data={allAppStats}
          renderItem={renderAppItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          onRefresh={() => loadAppUsageStats(showSystemApps)}
          refreshing={loading}
        />
        {renderAppDetails()}
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  systemToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    // backgroundColor and borderColor are applied inline to reuse theme toggles
  },
  systemToggleActive: {
  },
  appHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: theme.colors.elevation2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    appIconPlaceholder: {
      backgroundColor: theme.colors.elevation3,
    },
    appIconImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    appIconLetter: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
  },
  appInfo: {
    flex: 1,
    marginLeft: 12,
  },
  appName: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  packageName: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  powerUsage: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  usageTime: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  powerBar: {
    height: 4,
    borderRadius: 2,
  },
  detailsCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    padding: 20,
    borderRadius: 20,
    maxHeight: height * 0.7,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: theme.colors.elevation2,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
  },
  detailsName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsPackage: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: theme.colors.elevation2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  usageBreakdown: {
    backgroundColor: theme.colors.elevation2,
    padding: 16,
    borderRadius: 12,
  },
  breakdownTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  breakdownItem: {
    marginBottom: 12,
  },
  breakdownLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  breakdownBar: {
    height: 8,
    backgroundColor: theme.colors.elevation3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownValue: {
    color: theme.colors.text,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default InsightsScreen;