import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { ChargeCard } from '../components/ChargeCard';
import { MetricCard } from '../components/MetricCard';
import { MetricGraph } from '../components/MetricGraph';
import { NativeModules, NativeEventEmitter } from 'react-native';
import ScreenBackground from '../components/ScreenBackground'; // Import the component

const { ChargerStats } = NativeModules;
const eventEmitter = new NativeEventEmitter(ChargerStats);

interface BatteryStats {
  isCharging: boolean;
  batteryLevel: number;
  eta: number;
  power: number;
  temperature: number;
  voltage: number;
  current: number;
  score: number;
}

const DashboardScreen = () => {
  const [stats, setStats] = useState<BatteryStats | null>(null);
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [powerHistory, setPowerHistory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const initBatteryStats = async () => {
      try {
        if (ChargerStats && typeof ChargerStats.setDebugMode === 'function') {
          try {
            await ChargerStats.setDebugMode(isDebugMode);
          } catch (e) {
            console.warn('Failed to set debug mode on ChargerStats native module', e);
          }
        }

        const initialStats = await (ChargerStats && typeof ChargerStats.getBatteryStats === 'function'
          ? ChargerStats.getBatteryStats()
          : Promise.reject(new Error('ChargerStats.getBatteryStats not available')));
        setStats(initialStats);
        setTempHistory([initialStats.temperature]);
        setPowerHistory([initialStats.power]);
        setError(null);
      } catch (err) {
        setError('Failed to load battery stats');
        console.error('Battery stats error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initBatteryStats();
    ChargerStats.startBatteryMonitoring();

    // Re-initialize when debug mode changes
    if (isDebugMode) {
      console.log('Debug mode enabled - reinitializing battery monitoring');
    }

    const chargerListener = eventEmitter.addListener(
      'onChargerStatusChanged',
      (event: { data: BatteryStats; showPopup: boolean }) => {
        if (isDebugMode) {
          console.log('Battery Event received:', event);
        }
        setStats(event.data);
        setTempHistory((prev) => [...prev, Number(event.data.temperature)].slice(-30));
        setPowerHistory((prev) => [...prev, event.data.power].slice(-30));
        setError(null);
      }
    );

    return () => {
      ChargerStats.stopBatteryMonitoring();
      chargerListener.remove();
    };
  }, [isDebugMode]);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>ChargeGuard</Text>
          <TouchableOpacity
            style={[styles.debugButton, isDebugMode && styles.debugButtonActive]}
            onPress={() => setIsDebugMode(!isDebugMode)}>
            <Text style={styles.debugButtonText}>
              {isDebugMode ? 'Debug: ON' : 'Debug: OFF'}
            </Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading battery stats...</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setIsLoading(true);
                setError(null);
                ChargerStats.getBatteryStats()
                  .then((newStats: BatteryStats) => {
                    setStats(newStats);
                    setTempHistory([newStats.temperature]);
                    setPowerHistory([newStats.power]);
                  })
                  .catch((err: Error) => setError('Failed to load battery stats'))
                  .finally(() => setIsLoading(false));
              }}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ChargeCard
              isCharging={stats?.isCharging ?? false}
              batteryLevel={stats?.batteryLevel ?? 0}
              eta={stats?.eta ?? -1}
              voltage={stats?.voltage}
              current={stats?.current}
              temperature={stats?.temperature}
              score={stats?.score}
            />
            <View style={styles.metricsContainer}>
              <MetricCard icon="zap" title="Power" value={stats ? `${stats.power.toFixed(2)} W` : '--'} />
              <MetricCard icon="thermometer" title="Temperature" value={stats ? `${stats.temperature.toFixed(1)} °C` : '--'} />
            </View>
            <MetricGraph title="Temperature (°C) - Last 5 Mins" data={tempHistory} />
            <MetricGraph title="Power (W) - Last 5 Mins" data={powerHistory} />
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  debugButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.elevation2,
  },
  debugButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  debugButtonText: {
    color: theme.colors.text,
    fontSize: 12,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
    color: theme.colors.text,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: theme.spacing.m,
    color: theme.colors.text,
    fontSize: 16,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderRadius: 8,
  },
  retryText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;