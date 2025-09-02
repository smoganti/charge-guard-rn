#import "ChargerStats.h"
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h> // Added

@implementation ChargerStats

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onChargerStatusChanged"];
}

RCT_EXPORT_METHOD(startBatteryMonitoring)
{
  [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(batteryStateDidChange:) name:UIDeviceBatteryStateDidChangeNotification object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(batteryLevelDidChange:) name:UIDeviceBatteryLevelDidChangeNotification object:nil];
  
  // Request notification permissions
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound)
                      completionHandler:^(BOOL granted, NSError *_Nullable error) {
    if (granted) {
      NSLog(@"Notification permissions granted.");
    } else {
      NSLog(@"Notification permissions denied.");
    }
  }];

  // Send initial status
  [self sendBatteryStatusEvent];
}

RCT_EXPORT_METHOD(stopBatteryMonitoring)
{
  [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceBatteryStateDidChangeNotification object:nil];
  [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceBatteryLevelDidChangeNotification object:nil];
  [[UIDevice currentDevice] setBatteryMonitoringEnabled:NO];
}

- (void)batteryStateDidChange:(NSNotification *)notification
{
  [self sendBatteryStatusEvent];
}

- (void)batteryLevelDidChange:(NSNotification *)notification
{
  [self sendBatteryStatusEvent];
}

- (void)sendBatteryStatusEvent
{
  UIDevice *device = [UIDevice currentDevice];
  float batteryLevel = device.batteryLevel * 100; // 0.0 to 1.0, convert to percentage
  UIDeviceBatteryState batteryState = device.batteryState;
  
  BOOL isCharging = (batteryState == UIDeviceBatteryStateCharging || batteryState == UIDeviceBatteryStateFull);
  
  // For simplicity, ETA is not directly available on iOS like Android. Send -1.
  // Power and temperature are also not directly available from UIDevice. Send dummy values.
  // In a real app, these would come from other sensors or estimations.
  
  NSDictionary *stats = @{
    @"batteryLevel": @(batteryLevel),
    @"isCharging": @(isCharging),
    @"temperature": @(25.0), // Dummy value
    @"power": @(1000.0), // Dummy value
    @"eta": @(-1), // Not directly available
  };
  
  BOOL showPopup = NO;
  // Check if app is in background
  if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
    if (isCharging) {
      // Schedule local notification
      UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
      content.title = @"Charger Connected!";
      content.body = [NSString stringWithFormat:@"Battery is at %.0f%% and charging.", batteryLevel];
      content.sound = [UNNotificationSound defaultSound];
      
      UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:1 repeats:NO];
      UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"ChargerConnected" content:content trigger:trigger];
      
      [[UNUserNotificationCenter currentNotificationCenter] addNotificationRequest:request withCompletionHandler:nil];
    }
  } else { // App is in foreground
    if (isCharging) {
      showPopup = YES;
    }
  }
  
  [self sendEventWithName:@"onChargerStatusChanged" body:@{@"data": stats, @"showPopup": @(showPopup)}];
}

@end
