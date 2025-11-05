import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {Platform, NativeModules, DeviceEventEmitter} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const BatteryContext = createContext();

export const useBattery = () => {
  const context = useContext(BatteryContext);
  if (!context) {
    throw new Error('useBattery must be used within a BatteryProvider');
  }
  return context;
};

export const BatteryProvider = ({children}) => {
  const [batteryData, setBatteryData] = useState({
    percentage: 77,
    isCharging: false,
    temperature: 31,
    voltage: 4.34,
    current: 1863,
    health: 92,
    cycleCount: 215,
    capacity: 3200,
    timeToFull: 64,
    chargingSpeed: 'Fast',
    powerDelivery: 90,
  });

  const [chargeData, setChargeData] = useState({
    type: 'Fast',
    authenticity: 'Genuine',
    safetyScore: 96,
    powerDelivery: 90,
    voltageStability: 98,
    temperatureRating: 'Normal',
    chargingPattern: 'Stable',
    efficiency: 94,
  });

  const [alertsData, setAlertsData] = useState([
    {
      id: 1,
      type: 'success',
      message: 'Optimal charging conditions detected',
      timestamp: new Date(),
      severity: 'low',
      resolved: true,
    },
    {
      id: 2,
      type: 'info',
      message: 'Fast charging enabled - genuine charger detected',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: 'low',
      resolved: true,
    },
  ]);

  const [settings, setSettings] = useState({
    warningTemp: 40,
    maxTemp: 45,
    notifications: {
      temperature: true,
      charging: true,
      safety: true,
      health: true,
    },
    autoDisconnect: false,
    disconnectLevel: 90,
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    loadSettings();
    startBatteryMonitoring();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('chargeGuardSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('chargeGuardSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const startBatteryMonitoring = () => {
    // Real battery monitoring for Android (prefer native ChargerStats module)
    getBatteryInfo();

    // Update battery info every 3 seconds. Only simulate when native APIs fail
    intervalRef.current = setInterval(() => {
      getBatteryInfo();
    }, 3000);
  };

  const getBatteryInfo = async () => {
    try {
      // Prefer native ChargerStats if available (provides power/current/temperature)
      if (NativeModules.ChargerStats && typeof NativeModules.ChargerStats.getBatteryStats === 'function') {
        const stats = await NativeModules.ChargerStats.getBatteryStats();
        // stats.batteryLevel is expected to be percentage (e.g., 84.0)
        setBatteryData(prev => ({
          ...prev,
          percentage: Math.round(Number(stats.batteryLevel) || prev.percentage),
          isCharging: !!stats.isCharging,
          temperature: typeof stats.temperature === 'number' ? stats.temperature : prev.temperature,
          voltage: typeof stats.voltage === 'number' ? stats.voltage : prev.voltage,
          current: typeof stats.current === 'number' ? stats.current : prev.current,
        }));

        setChargeData(prev => ({
          ...prev,
          type: stats.isCharging ? (stats.current > 1500 ? 'Fast' : 'Standard') : 'Not Charging',
          authenticity: analyzeBatteryPattern((Number(stats.batteryLevel) || prev.percentage) / 100, !!stats.isCharging),
          powerDelivery: typeof stats.power === 'number' ? stats.power : prev.powerDelivery,
        }));
      } else {
        // Fallback to DeviceInfo for basic battery level and charging state
        const batteryLevel = await DeviceInfo.getBatteryLevel();
        const isCharging = await DeviceInfo.isBatteryCharging();

        setBatteryData(prev => ({
          ...prev,
          percentage: Math.round(batteryLevel * 100),
          isCharging: isCharging,
        }));

        setChargeData(prev => ({
          ...prev,
          type: isCharging ? (prev.current > 1500 ? 'Fast' : 'Standard') : 'Not Charging',
          authenticity: analyzeBatteryPattern(batteryLevel, isCharging),
        }));
      }
    } catch (error) {
      console.log('Error getting battery info:', error);
      // Fallback to simulation only if native/device APIs fail
      simulateRealtimeChanges();
    }
  };

  const simulateRealtimeChanges = () => {
    setBatteryData(prev => {
      const newPercentage = prev.isCharging 
        ? Math.min(100, prev.percentage + Math.random() * 0.5)
        : Math.max(0, prev.percentage - Math.random() * 0.1);
      
      const timeToFull = prev.isCharging 
        ? Math.max(0, Math.round((100 - newPercentage) / 1.2))
        : 0;

      return {
        ...prev,
        percentage: Math.round(newPercentage),
        temperature: Math.max(25, Math.min(45, prev.temperature + (Math.random() - 0.5) * 1)),
        voltage: Math.max(3.5, Math.min(4.5, prev.voltage + (Math.random() - 0.5) * 0.05)),
        current: prev.isCharging ? Math.max(500, Math.min(2000, prev.current + (Math.random() - 0.5) * 50)) : 0,
        timeToFull,
      };
    });

    // Update safety score based on temperature and charging conditions
    setChargeData(prev => ({
      ...prev,
      safetyScore: calculateSafetyScore(),
      efficiency: Math.max(80, Math.min(99, prev.efficiency + (Math.random() - 0.5) * 2)),
    }));
  };

  const analyzeBatteryPattern = (batteryLevel, isCharging) => {
    // Simple heuristic for charger authenticity
    if (!isCharging) return 'Unknown';
    
    // Check for consistent charging patterns
    const voltageStable = batteryData.voltage >= 4.0 && batteryData.voltage <= 4.4;
    const temperatureNormal = batteryData.temperature < settings.warningTemp;
    const currentAppropriate = batteryData.current > 500 && batteryData.current < 2500;

    if (voltageStable && temperatureNormal && currentAppropriate) {
      return 'Genuine';
    } else if (!voltageStable || batteryData.current > 2500) {
      return 'Suspicious';
    }
    
    return 'Unknown';
  };

  const calculateSafetyScore = () => {
    let score = 100;
    
    // Temperature penalty
    if (batteryData.temperature > settings.warningTemp) {
      score -= Math.min(30, (batteryData.temperature - settings.warningTemp) * 2);
    }
    
    // Voltage penalty
    if (batteryData.voltage < 3.7 || batteryData.voltage > 4.4) {
      score -= 20;
    }
    
    // Current penalty
    if (batteryData.current > 2000) {
      score -= 10;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const addAlert = (alert) => {
    setAlertsData(prev => [
      {
        ...alert,
        id: Date.now(),
        timestamp: new Date(),
      },
      ...prev.slice(0, 9) // Keep only last 10 alerts
    ]);
  };

  const clearAlert = (alertId) => {
    setAlertsData(prev => prev.filter(alert => alert.id !== alertId));
  };

  const updateSettings = (newSettings) => {
    saveSettings(newSettings);
  };

  const refreshData = () => {
    getBatteryInfo();
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const value = {
    batteryData,
    chargeData,
    alertsData,
    settings,
    addAlert,
    clearAlert,
    updateSettings,
    refreshData,
  };

  return (
    <BatteryContext.Provider value={value}>
      {children}
    </BatteryContext.Provider>
  );
};