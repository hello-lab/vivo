import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

// Define a task name
const TASK_NAME = 'BACKGROUND_TASK';

// Register the task that will execute at certain times
TaskManager.defineTask(TASK_NAME, async () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Check if it's the desired time (e.g., 2:18 AM)
  if (hour === 2 && minute === 35) {
    // Fire the action, e.g., sending a notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Motivational Message',
        body: 'You are stronger than you think!',
      },
      trigger: { seconds: 1 }, // Immediately after the task is triggered
    });

    console.log('Notification scheduled at 2:18 AM');
  }

  // Return success status to let the background fetch know it completed successfully
  return BackgroundFetch.Result.NewData;
});

const App = () => {
  useEffect(() => {
    // Request permissions for notifications
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Notification permissions not granted!');
      }
    };

    setupNotifications();

    // Register background fetch task
    const registerBackgroundFetch = async () => {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60 * 15, // Execute this task every 15 minutes
        stopOnTerminate: false,  // Keep running when the app is terminated
        startOnBoot: true, // Start task when the device is rebooted
      });
    };

    registerBackgroundFetch();
  }, []);

  return (
    <View>
      <Text>App running in the background to trigger tasks at specific times.</Text>
    </View>
  );
};

export default App;
