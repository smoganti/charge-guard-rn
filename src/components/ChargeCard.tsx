import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Feather from 'react-native-vector-icons/Feather';

type ChargeCardProps = {
  isCharging: boolean;
  batteryLevel: number;
  eta: number;
};

export const ChargeCard: React.FC<ChargeCardProps> = ({ isCharging, batteryLevel, eta }) => {
  const formattedEta = eta !== -1 ? `${eta.toFixed(0)} min` : 'N/A';

  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.batteryContainer}>
          <AnimatedCircularProgress
            size={120}
            width={12}
            fill={batteryLevel}
            tintColor={isCharging ? theme.colors.primary : theme.colors.success}
            backgroundColor="#3d3d3d">
            {
              (fill: number) => (
                <Text style={styles.batteryLevelText}>
                  {`${Math.round(fill)}%`}
                </Text>
              )
            }
          </AnimatedCircularProgress>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Feather name={isCharging ? 'zap' : 'zap-off'} size={20} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{isCharging ? 'Charging' : 'Not Charging'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>ETA: {formattedEta}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryContainer: {
    marginRight: theme.spacing.l,
  },
  batteryLevelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.m,
    fontSize: 18,
  },
});