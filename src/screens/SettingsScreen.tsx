import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenBackground from '../components/ScreenBackground';

const SettingsScreen: React.FC = () => (
  <ScreenBackground>
    <View style={styles.wrap}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sub}>App settings will appear here.</Text>
    </View>
  </ScreenBackground>
);

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#fff' },
  sub: { color: '#b0b0b0', fontSize: 16, textAlign: 'center' },
});

export default SettingsScreen;