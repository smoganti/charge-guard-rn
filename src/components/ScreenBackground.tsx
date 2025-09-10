import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

const ScreenBackground: React.FC<ScreenBackgroundProps> = ({children}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e3a5f', '#2c4e73']}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenBackground;