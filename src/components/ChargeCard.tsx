import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type ChargeCardProps = {
  isCharging: boolean;
  batteryLevel: number;
};

export const ChargeCard: React.FC<ChargeCardProps> = ({ isCharging, batteryLevel }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Charging Status</Text>
      <Text style={styles.status}>{isCharging ? 'Charging' : 'Not Charging'}</Text>
      <Text style={styles.batteryLevel}>{`Battery Level: ${batteryLevel.toFixed(0)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.s,
  },
  status: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  batteryLevel: {
    ...theme.typography.body,
  },
});
