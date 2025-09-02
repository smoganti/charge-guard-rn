// App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { DashboardScreen } from './src/screens/DashboardScreen';
import ChargeCardPopup from './src/components/ChargeCardPopup';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <DashboardScreen />
      <ChargeCardPopup />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Keep this for the absolute positioning of the popup
  },
});

export default App;