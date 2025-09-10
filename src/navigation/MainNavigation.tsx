import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

// Import screens with default exports
import DashboardScreen from '../screens/DashboardScreen';
import HealthScreen from '../screens/HealthScreen';
import InsightsScreen from '../screens/InsightsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GlassTabBar from '../components/GlassTabBar';

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props: BottomTabBarProps) => <GlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name="dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen
          name="health"
          component={HealthScreen}
          options={{
            tabBarLabel: 'Health',
          }}
        />
        <Tab.Screen
          name="insights"
          component={InsightsScreen}
          options={{
            tabBarLabel: 'Insights',
          }}
        />
        <Tab.Screen
          name="settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;