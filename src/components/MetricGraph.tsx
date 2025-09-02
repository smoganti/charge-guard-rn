import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../theme';

type MetricGraphProps = {
  title: string;
  data: number[];
};

export const MetricGraph: React.FC<MetricGraphProps> = ({ title, data }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: data.length > 0 ? data : [0],
            },
          ],
        }}
        width={Dimensions.get('window').width - theme.spacing.m * 2 - theme.spacing.s * 2}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const chartConfig = {
  backgroundColor: theme.colors.primary,
  backgroundGradientFrom: theme.colors.primary,
  backgroundGradientTo: '#1E90FF',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
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
  chart: {
    borderRadius: 16,
  },
});
