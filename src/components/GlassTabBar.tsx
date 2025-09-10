import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

interface TabItem {
  key: string;
  title: string;
  icon: string;
}

interface GlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const tabs: TabItem[] = [
  {key: 'dashboard', title: 'Dashboard', icon: 'home'},
  {key: 'health', title: 'Health', icon: 'favorite'},
  {key: 'insights', title: 'Insights', icon: 'analytics'},
  {key: 'settings', title: 'Settings', icon: 'settings'},
];

const GlassTabBar: React.FC<GlassTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <LinearGradient
      colors={['rgba(30, 58, 95, 0.9)', 'rgba(44, 78, 115, 0.85)']}
      style={styles.container}>
      <View style={styles.blur}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: tab.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.key);
            }
          };

          return (
            <TouchableOpacity
              key={tab.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={descriptors[tab.key]?.options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tab}>
              <Icon
                name={tab.icon}
                size={24}
                color={isFocused ? '#3b82f6' : '#64748b'}
              />
              <Text
                style={[
                  styles.label,
                  {color: isFocused ? '#3b82f6' : '#64748b'},
                ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  blur: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default GlassTabBar;
