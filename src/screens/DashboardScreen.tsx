import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
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
  eta: string;
  power: number;
  temperature: number;
}

const DashboardScreen = () => {
  const [stats, setStats] = useState<BatteryStats | null>(null);
  const [tempHistory, setTempHistory] = useState<number[]>([]);
  const [powerHistory, setPowerHistory] = useState<number[]>([]);

  useEffect(() => {
    ChargerStats.startBatteryMonitoring();

    const statsListener = eventEmitter.addListener('onBatteryStatsChanged', (event: { data: BatteryStats }) => {
      setStats(event.data);
      setTempHistory((prev) => [...prev, Number(event.data.temperature)].slice(-30));
      setPowerHistory((prev) => [...prev, event.data.power].slice(-30));
    });

    const chargerListener = eventEmitter.addListener('onChargerStatusChanged', (event: { data: BatteryStats; showPopup: boolean }) => {
      if (event.data.isCharging) {
        setStats(event.data);
        setTempHistory((prev) => [...prev, Number(event.data.temperature)].slice(-30));
        setPowerHistory((prev) => [...prev, event.data.power].slice(-30));
      }
    });

    return () => {
      ChargerStats.stopBatteryMonitoring();
      statsListener.remove();
      chargerListener.remove();
    };
  }, []);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>ChargeGuard</Text>
        {stats && (
          <>
            <ChargeCard
              isCharging={stats.isCharging}
              batteryLevel={stats.batteryLevel}
              eta={Number(stats.eta)}
            />
            <View style={styles.metricsContainer}>
              <MetricCard icon="zap" title="Power" value={`${stats.power.toFixed(2)} mW`} />
              <MetricCard icon="thermometer" title="Temperature" value={`${stats.temperature.toFixed(1)} °C`} />
            </View>
            <MetricGraph title="Temperature (°C) - Last 5 Mins" data={tempHistory} />
            <MetricGraph title="Power (mW) - Last 5 Mins" data={powerHistory} />
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  // The ScrollView's content container gets the padding, not a background.
  container: {
    padding: theme.spacing.m,
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
});

export default DashboardScreen;