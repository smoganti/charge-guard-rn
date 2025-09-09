import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InsightsScreen: React.FC = () => (
  <View style={styles.wrap}>
    <Text style={styles.title}>Insights</Text>
    <Text style={styles.sub}>Charging insights and trends will appear here.</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  sub: { color: '#666' },
});

export default InsightsScreen;
