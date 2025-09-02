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
              color: (opacity = 1) => `rgba(44, 217, 197, ${opacity})`, // Line color
              strokeWidth: 3,
            },
          ],
        }}
        width={Dimensions.get('window').width - theme.spacing.m * 4}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
      />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: theme.colors.card,
  backgroundGradientTo: theme.colors.card,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  propsForBackgroundLines: {
    strokeDasharray: '', // solid background lines
    stroke: theme.colors.border,
  },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});