import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type MetricCardProps = {
  title: string;
  value: string;
};

export const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
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
    flex: 1,
    marginHorizontal: theme.spacing.s / 2,
  },
  title: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.s,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.secondary,
  },
});
