import React from 'react';
import {View, StyleSheet} from 'react-native';

const GlassCard = ({children, style}) => {
  // The inner View has been removed.
  // Children are now direct descendants of the styled card.
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(24, 28, 36, 0.45)', // glossy, more transparent
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: '#38bdf8',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 20,
  },
  // The contentPadding style is no longer needed.
});

export default GlassCard;