import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { ChargeCard } from '../components/ChargeCard';
import { MetricCard } from '../components/MetricCard';
import { MetricGraph } from '../components/MetricGraph';
import { useBattery } from '../context/BatteryContext';
import ScreenBackground from '../components/ScreenBackground'; // Import the component


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
  const { batteryData, refreshData } = useBattery();
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [powerHistory, setPowerHistory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // initialize histories from batteryData
    if (batteryData) {
      setTempHistory(prev => [...prev, Number(batteryData.temperature)].filter(n => !isNaN(n)).slice(-30));
      setPowerHistory(prev => [...prev, batteryData.power].filter(n => n != null).slice(-30));
    }
  }, [batteryData]);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>ChargeGuard</Text>
        </View>

        <ChargeCard
          isCharging={batteryData?.isCharging ?? false}
          batteryLevel={batteryData?.batteryLevel ?? 0}
          eta={batteryData?.eta ?? -1}
          voltage={batteryData?.voltage}
          current={batteryData?.current}
          temperature={batteryData?.temperature}
          score={batteryData?.score}
        />

        <View style={styles.metricsContainer}>
          <MetricCard icon="zap" title="Power" value={batteryData && batteryData.power != null ? `${Number(batteryData.power).toFixed(2)} W` : '--'} />
          <MetricCard icon="thermometer" title="Temperature" value={batteryData && batteryData.temperature != null ? `${Number(batteryData.temperature).toFixed(1)} °C` : '--'} />
        </View>

        <MetricGraph title="Temperature (°C) - Last 5 Mins" data={tempHistory} />
        <MetricGraph title="Power (W) - Last 5 Mins" data={powerHistory} />
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