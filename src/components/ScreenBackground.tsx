import React from 'react';
import {StyleSheet, View} from 'react-native';

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

const ScreenBackground: React.FC<ScreenBackgroundProps> = ({children}) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default ScreenBackground;