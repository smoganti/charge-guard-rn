import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StatusCard = ({title, value, icon, color = '#10b981', style}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconContainer, {backgroundColor: `${color}20`}]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, {color}]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#b0b0b0',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StatusCard;