import React, { createContext, useContext, useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { ChargerStats } = NativeModules || {};
const chargerEmitter = ChargerStats ? new NativeEventEmitter(ChargerStats) : null;

const BatteryContext = createContext();

export const useBattery = () => {
  const context = useContext(BatteryContext);
  if (!context) throw new Error('useBattery must be used within a BatteryProvider');
  return context;
};

export const BatteryProvider = ({ children }) => {
  const [batteryData, setBatteryData] = useState({
    batteryLevel: 0,
    isCharging: false,
    temperature: null,
    voltage: null,
    current: null,
    eta: -1,
    power: null,
    score: null,
  });

  useEffect(() => {
    let sub = null;

    const init = async () => {
      try {
        if (ChargerStats && typeof ChargerStats.getBatteryStats === 'function') {
          const stats = await ChargerStats.getBatteryStats();
          if (stats) {
            setBatteryData(prev => ({
              ...prev,
              batteryLevel: Math.round(stats.batteryLevel || prev.batteryLevel || 0),
              isCharging: !!stats.isCharging,
              temperature: stats.temperature != null ? stats.temperature : prev.temperature,
              voltage: stats.voltage != null ? stats.voltage : prev.voltage,
              current: stats.current != null ? stats.current : prev.current,
              eta: stats.eta != null ? stats.eta : prev.eta,
              power: stats.power != null ? stats.power : prev.power,
              score: stats.score != null ? stats.score : prev.score,
            }));
          }
        }

        // start native monitoring which will emit events on changes
        ChargerStats && ChargerStats.startBatteryMonitoring && ChargerStats.startBatteryMonitoring();

        if (chargerEmitter) {
          sub = chargerEmitter.addListener('onChargerStatusChanged', (event) => {
            if (!event || !event.data) return;
            const d = event.data;
            setBatteryData(prev => ({
              ...prev,
              batteryLevel: Math.round(d.batteryLevel || prev.batteryLevel || 0),
              isCharging: typeof d.isCharging === 'boolean' ? d.isCharging : prev.isCharging,
              temperature: d.temperature != null ? d.temperature : prev.temperature,
              voltage: d.voltage != null ? d.voltage : prev.voltage,
              current: d.current != null ? d.current : prev.current,
              eta: d.eta != null ? d.eta : prev.eta,
              power: d.power != null ? d.power : prev.power,
              score: d.score != null ? d.score : prev.score,
            }));
          });
        }
      } catch (e) {
        // Best-effort: if native not available, nothing else to do here.
        console.warn('BatteryProvider init error', e);
      }
    };

    init();

    return () => {
      if (sub && typeof sub.remove === 'function') sub.remove();
      ChargerStats && ChargerStats.stopBatteryMonitoring && ChargerStats.stopBatteryMonitoring();
    };
  }, []);

  const refreshData = async () => {
    try {
      if (ChargerStats && typeof ChargerStats.getBatteryStats === 'function') {
        const stats = await ChargerStats.getBatteryStats();
        if (stats) {
          setBatteryData(prev => ({
            ...prev,
            batteryLevel: Math.round(stats.batteryLevel || prev.batteryLevel || 0),
            isCharging: !!stats.isCharging,
            temperature: stats.temperature != null ? stats.temperature : prev.temperature,
            voltage: stats.voltage != null ? stats.voltage : prev.voltage,
            current: stats.current != null ? stats.current : prev.current,
            eta: stats.eta != null ? stats.eta : prev.eta,
            power: stats.power != null ? stats.power : prev.power,
            score: stats.score != null ? stats.score : prev.score,
          }));
        }
        return true;
      }
    } catch (e) {
      console.warn('refreshData failed', e);
    }
    return false;
  };

  const value = {
    batteryData,
    refreshData,
  };

  return <BatteryContext.Provider value={value}>{children}</BatteryContext.Provider>;
};