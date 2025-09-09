// App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BatteryProvider } from './src/context/BatteryContext';
import MainNavigation from './src/navigation/MainNavigation';

enableScreens();

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <BatteryProvider>
          <MainNavigation />
        </BatteryProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Keep this for the absolute positioning of the popup
  },
});

export default App;