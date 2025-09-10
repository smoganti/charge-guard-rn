import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
// @ts-ignore - runtime import for vector icons
import Feather from 'react-native-vector-icons/Feather';
import { theme } from '../theme';

interface ChargeData {
  score: number;
  power: number;
  temperature: number;
  eta: number;
  isCharging: boolean;
}

const { ChargerStats } = NativeModules;
const eventEmitter = new NativeEventEmitter(ChargerStats);

const ChargeCardPopup: React.FC = () => {
  // ...existing code...

  const [visible, setVisible] = useState(false);
  const [chargeData, setChargeData] = useState<ChargeData | null>(null);

  const slideAnim = useRef(new Animated.Value(400)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const runCloseAnimation = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setChargeData(null);
    });
  }, [slideAnim]);

  // Helper to get charge status info for icon, color, title, description
  const getStatusInfo = useCallback((s: number) => {
    if (s >= 80)
      return {
        color: theme.colors.success,
        icon: 'shield',
        title: 'Healthy Charge',
        description: 'Optimal speed and temperature.',
      };
    if (s >= 50)
      return {
        color: theme.colors.warning,
        icon: 'alert-triangle',
        title: 'Average Charge',
        description: 'Speed or temp is not ideal.',
      };
    return {
      color: theme.colors.danger,
      icon: 'shield-off',
      title: 'Poor Charge',
      description: 'This may degrade battery health.',
    };
  }, []);

  // Manual close handler for popup
  const handleManualClose = useCallback(() => {
    slideAnim.stopAnimation();
    progressAnim.stopAnimation();
    runCloseAnimation();
  }, [slideAnim, progressAnim, runCloseAnimation]);

  if (!visible || !chargeData) {
    return null;
  }

  const {score, power, temperature, eta} = chargeData;
  const status = getStatusInfo(score);
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[styles.cardContainer, {transform: [{translateY: slideAnim}]}]}>
      <View style={[styles.card, {backgroundColor: status.color}]}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleManualClose}>
          <Feather name="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Header with Score and Status Icon */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardSubTitle}>Charge Score</Text>
            <Text style={styles.cardScore}>{score}</Text>
          </View>
          <Feather name={status.icon} size={48} color={theme.colors.text} />
        </View>

        {/* Status Title and Description */}
        <View>
          <Text style={styles.cardTitle}>{status.title}</Text>
          <Text style={styles.cardDescription}>{status.description}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Feather
              name="zap"
              size={18}
              color={theme.colors.text} // Changed to theme.colors.text
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{power}W</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather
              name="thermometer"
              size={18}
              color={theme.colors.text} // Changed to theme.colors.text
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{temperature}°C</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather
              name="clock"
              size={18}
              color={theme.colors.text} // Changed to theme.colors.text
              style={styles.detailIcon}
            />
            <Text style={styles.detailText}>{eta} min</Text>
          </View>
        </View>

        {/* Auto-hide Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, {width: progressBarWidth}]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  padding: 16,
  paddingBottom: 16, // reduced so tab bar can be tappable
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardSubTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    opacity: 0.8,
  },
  cardScore: {
    ...theme.typography.title,
    fontSize: 48,
    lineHeight: 50,
    color: theme.colors.text,
  },
  cardTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginRight: 40,
  },
  cardDescription: {
    ...theme.typography.body,
    color: theme.colors.text,
    opacity: 0.9,
    marginTop: 2,
    marginRight: 40,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    opacity: 0.9,
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  detailText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.text,
  },
});

export default ChargeCardPopup;
