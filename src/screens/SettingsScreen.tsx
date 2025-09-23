import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenBackground from '../components/ScreenBackground';
import GlassCard from '../components/GlassCard';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  // State for various settings
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [optimalChargeLimit, setOptimalChargeLimit] = useState(80); // Example app-specific setting

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: () => console.log('User logged out') }, // Implement actual logout logic
      ],
      { cancelable: true }
    );
  };

  const navigateTo = (screenName: string) => {
    // @ts-ignore - Type checking for navigation can be complex, ignoring for example
    navigation.navigate(screenName);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {/* General Settings */}
        <GlassCard style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Light Mode</Text>
            <Switch
              onValueChange={setIsDarkModeEnabled}
              value={isDarkModeEnabled}
            />
          </View>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigateTo('LanguageSelection')}>
            <Text style={styles.settingText}>App Language</Text>
            <Text style={styles.settingValue}>English &gt;</Text>
          </TouchableOpacity>
        </View>
        </GlassCard>

        {/* Notifications */}
        <GlassCard style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Receive Notifications</Text>
            <Switch
              onValueChange={setReceiveNotifications}
              value={receiveNotifications}
            />
          </View>
          {/* Add more specific notification toggles here */}
        </View>
        </GlassCard>

        {/* Account Settings */}
        <GlassCard style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigateTo('ProfileEdit')}>
            <Text style={styles.settingText}>Edit Profile</Text>
            <Text style={styles.settingValue}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigateTo('ChangePassword')}>
            <Text style={styles.settingText}>Change Password</Text>
            <Text style={styles.settingValue}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <Text style={[styles.settingText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
        </GlassCard>

        {/* Privacy & Security */}
        <GlassCard style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Use Biometric Authentication</Text>
            <Switch onValueChange={setUseBiometrics} value={useBiometrics} />
          </View>
        </View>
        </GlassCard>

        {/* About */}
        <GlassCard style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={[styles.settingItem, styles.settingText]}>
            App Version: 1.0.0
          </Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => console.log('Open Terms')}>
            <Text style={styles.settingText}>Terms of Service</Text>
            <Text style={styles.settingValue}>&gt;</Text>
          </TouchableOpacity>
        </View>
        </GlassCard>
      </ScrollView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden', // Ensures border radius applies to children
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
  card: {
    marginBottom: 0,
  },
  settingValue: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
