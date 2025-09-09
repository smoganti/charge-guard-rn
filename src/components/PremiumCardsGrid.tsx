import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';


const PremiumCardsGrid: React.FC = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.grid}>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>🛡️</Text>
        <View style={styles.cardHeaderTextWrap}>
          <Text style={styles.cardTitle}>Safety Score</Text>
          <Text style={styles.cardSubtitle}>Real-time monitoring</Text>
        </View>
      </View>
      <View style={styles.cardMetricRow}>
        <Text style={styles.cardMetricMain}>96</Text>
        <Text style={styles.cardMetricSub}>/100</Text>
      </View>
      <Text style={styles.cardMetricStatus}>Excellent</Text>
    </View>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>✓</Text>
        <View style={styles.cardHeaderTextWrap}>
          <Text style={styles.cardTitle}>Charger Status</Text>
          <Text style={styles.cardSubtitle}>Authenticity verified</Text>
        </View>
      </View>
      <Text style={styles.cardMetricStatus}>Genuine</Text>
      <View style={styles.cardMetricRow}>
        <Text style={styles.cardSubtitle}>Power Delivery</Text>
        <Text style={styles.cardMetricMain}>89%</Text>
      </View>
    </View>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>⚡</Text>
        <View style={styles.cardHeaderTextWrap}>
          <Text style={styles.cardTitle}>Charging Speed</Text>
          <Text style={styles.cardSubtitle}>Optimized performance</Text>
        </View>
      </View>
      <View style={styles.cardMetricRow}>
        <Text style={styles.cardMetricStatus}>Fast</Text>
        <Text style={styles.cardMetricMain}>94%</Text>
      </View>
    </View>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>📊</Text>
        <View style={styles.cardHeaderTextWrap}>
          <Text style={styles.cardTitle}>Voltage Stability</Text>
          <Text style={styles.cardSubtitle}>Current fluctuation</Text>
        </View>
      </View>
      <View style={styles.cardMetricRow}>
        <Text style={styles.cardMetricMain}>98%</Text>
        <Text style={styles.cardMetricStatus}>Stable</Text>
      </View>
    </View>
  </ScrollView>
);


const styles = StyleSheet.create({
  grid: {
    paddingVertical: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    minWidth: 140,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  cardHeaderTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  cardSubtitle: {
    color: '#888',
    fontSize: 12,
  },
  cardMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardMetricMain: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  cardMetricSub: {
    fontSize: 14,
    color: '#888',
    marginLeft: 2,
  },
  cardMetricStatus: {
    color: '#10b981',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 2,
  },
});

export default PremiumCardsGrid;
