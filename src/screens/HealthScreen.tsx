import React from 'react';
import {View, Text, StyleSheet, ScrollView, ViewStyle} from 'react-native';
import {useBattery} from '../context/BatteryContext';
import GlassCard from '../components/GlassCard';
import BatteryCircle from '../components/BatteryCircle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScreenBackground from '../components/ScreenBackground'; // Import the new component

const HealthScreen = () => {
  const {batteryData} = useBattery();

  // ... (keep all your existing interfaces and functions like getHealthStatus, etc.)
  interface HealthStatus {
    text: string;
    color: string;
  }
  type Priority = 'high' | 'medium' | 'low';

  interface Recommendation {
    id: number;
    icon: string;
    title: string;
    description: string;
    priority: Priority;
  }

  const getHealthStatus = (health: number): HealthStatus => {
    if (health >= 90) return {text: 'Excellent', color: '#10b981'};
    if (health >= 80) return {text: 'Good', color: '#3b82f6'};
    if (health >= 70) return {text: 'Fair', color: '#f59e0b'};
    return {text: 'Poor', color: '#ef4444'};
  };

  const healthStatus = getHealthStatus(batteryData.health);

  const recommendations: Recommendation[] = [
    {
      id: 1,
      icon: 'device-thermostat',
      title: 'Temperature Management',
      description: 'Keep your device cool during charging to extend battery life',
      priority: 'high',
    },
    {
      id: 2,
      icon: 'battery-charging-full',
      title: 'Charging Habits',
      description: 'Avoid letting battery drain completely. Charge between 20-80%',
      priority: 'medium',
    },
    {
      id: 3,
      icon: 'nights-stay',
      title: 'Overnight Charging',
      description: 'Use optimized charging to reduce battery aging',
      priority: 'low',
    },
  ];

  const priorityStyles: Record<Priority, ViewStyle> = {
    high: {backgroundColor: 'rgba(239, 68, 68, 0.2)'},
    medium: {backgroundColor: 'rgba(245, 158, 11, 0.2)'},
    low: {backgroundColor: 'rgba(59, 130, 246, 0.2)'},
  };


  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Battery Health</Text>

        {/* Health Overview */}
        <GlassCard style={styles.card}>
          <View style={styles.healthHeader}>
            <BatteryCircle
              percentage={batteryData.health}
              size={100}
              strokeWidth={8}
              color={healthStatus.color}
              showPercentage={false}
            />
            <View style={styles.healthInfo}>
              <Text style={styles.healthPercentage}>{batteryData.health}%</Text>
              <Text style={[styles.healthStatus, {color: healthStatus.color}]}>
                {healthStatus.text}
              </Text>
              <Text style={styles.healthSubtext}>Battery Health</Text>
            </View>
          </View>
        </GlassCard>

        {/* Health Metrics */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Health Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metric}>
              <Icon name="autorenew" size={24} color="#3b82f6" />
              <Text style={styles.metricLabel}>Charge Cycles</Text>
              <Text style={styles.metricValue}>{batteryData.cycleCount}</Text>
              <Text style={styles.metricSubtext}>out of ~500</Text>
            </View>
            <View style={styles.metric}>
              <Icon name="battery-std" size={24} color="#10b981" />
              <Text style={styles.metricLabel}>Capacity</Text>
              <Text style={styles.metricValue}>{batteryData.capacity}mAh</Text>
              <Text style={styles.metricSubtext}>Design capacity</Text>
            </View>
            <View style={styles.metric}>
              <Icon name="trending-up" size={24} color="#f59e0b" />
              <Text style={styles.metricLabel}>Efficiency</Text>
              <Text style={styles.metricValue}>94%</Text>
              <Text style={styles.metricSubtext}>Current efficiency</Text>
            </View>
            <View style={styles.metric}>
              <Icon name="schedule" size={24} color="#8b5cf6" />
              <Text style={styles.metricLabel}>Age</Text>
              <Text style={styles.metricValue}>8 months</Text>
              <Text style={styles.metricSubtext}>Estimated</Text>
            </View>
          </View>
        </GlassCard>

        {/* Battery Tips */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Optimization Tips</Text>
          {recommendations.map(tip => (
            <View key={tip.id} style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Icon name={tip.icon} size={20} color="#10b981" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
              <View
                style={[styles.priorityBadge, priorityStyles[tip.priority]]}>
                <Text style={styles.priorityText}>
                  {tip.priority.toUpperCase()}
                </Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Health History */}
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Health Trend</Text>
          <View style={styles.trendContainer}>
            <Text style={styles.trendText}>
              Your battery health has remained stable over the past month
            </Text>
            <View style={styles.trendChart}>
              <View style={styles.trendLine} />
              <View style={[styles.trendPoint, {left: '20%'}]} />
              <View style={[styles.trendPoint, {left: '40%'}]} />
              <View style={[styles.trendPoint, {left: '60%'}]} />
              <View style={[styles.trendPoint, {left: '80%'}]} />
            </View>
            <View style={styles.trendLabels}>
              <Text style={styles.trendLabel}>1 month ago</Text>
              <Text style={styles.trendLabel}>Today</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenBackground>
  );
};

// All the styles remain the same, except we no longer need the 'container' style.
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 0,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthInfo: {
    marginLeft: 20,
  },
  healthPercentage: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  healthStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  healthSubtext: {
    color: '#b0b0b0',
    fontSize: 14,
    marginTop: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metric: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  metricLabel: {
    color: '#b0b0b0',
    fontSize: 12,
    marginTop: 8,
  },
  metricValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  metricSubtext: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tipDescription: {
    color: '#b0b0b0',
    fontSize: 12,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityhigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  prioritymedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  prioritylow: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  trendContainer: {
    alignItems: 'center',
  },
  trendText: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  trendChart: {
    width: '100%',
    height: 60,
    position: 'relative',
    marginBottom: 10,
  },
  trendLine: {
    position: 'absolute',
    top: 30,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: '#10b981',
    borderRadius: 1,
  },
  trendPoint: {
    position: 'absolute',
    top: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: '10%',
  },
  trendLabel: {
    color: '#64748b',
    fontSize: 12,
  },
});

export default HealthScreen;