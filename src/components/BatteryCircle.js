import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

const BatteryCircle = ({
  percentage = 0,
  size = 100,
  strokeWidth = 8,
  color = '#10b981',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  showPercentage = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [percentage, animatedValue]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [circumference, 0],
          })}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={[styles.percentageText, {fontSize: size * 0.2}]}>
            {Math.round(percentage)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    transform: [{rotate: '0deg'}],
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BatteryCircle;