import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';
import { ChargeCard } from '../components/ChargeCard';
import { MetricCard } from '../components/MetricCard';
import { MetricGraph } from '../components/MetricGraph';
import { NativeModules, NativeEventEmitter } from 'react-native';

const { ChargerStats } = NativeModules;

export const DashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [powerHistory, setPowerHistory] = useState<number[]>([]);

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(ChargerStats);
    const eventListener = eventEmitter.addListener('onBatteryStatsChanged', (event) => {
      setStats(event);
      setTempHistory((prev) => [...prev, event.temperature].slice(-30));
      setPowerHistory((prev) => [...prev, event.power].slice(-30));
    });

    ChargerStats.startListening();

    return () => {
      eventListener.remove();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ChargeGuard</Text>
      {stats && (
        <>
          <ChargeCard isCharging={stats.isCharging} batteryLevel={stats.batteryLevel} />
          <View style={styles.metricsContainer}>
            <MetricCard title="Power" value={`${stats.power.toFixed(2)} mW`} />
            <MetricCard title="Temperature" value={`${stats.temperature.toFixed(1)} °C`} />
          </View>
          <MetricGraph title="Temperature (°C) - Last 5 Mins" data={tempHistory} />
          <MetricGraph title="Power (mW) - Last 5 Mins" data={powerHistory} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
});
