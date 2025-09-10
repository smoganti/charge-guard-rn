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
    <View style={styles.contentPadding}>
        <Feather name={icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(24, 28, 36, 0.55)', // glossy, more transparent
    borderRadius: 16,
    marginBottom: theme.spacing.m,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    flex: 1,
    marginHorizontal: theme.spacing.s / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  contentPadding: {
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 2,
  },
});