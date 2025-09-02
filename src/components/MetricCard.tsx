import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import Feather from 'react-native-vector-icons/Feather';

type MetricCardProps = {
  title: string;
  value: string;
  icon: string; // Add icon prop
};

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    flex: 1,
    marginHorizontal: theme.spacing.s / 2,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.subtitle,
    fontSize: 16,
    marginBottom: theme.spacing.s,
    textAlign: 'center',
  },
  value: {
    ...theme.typography.body,
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});