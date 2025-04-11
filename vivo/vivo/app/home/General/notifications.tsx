import React, { useState, useEffect } from 'react';
import { Button, View, Text, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// 👇 Notification handler to show notifications even in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [generatedMessage, setGeneratedMessage] = useState<string>('');

  // ✅ Set up permissions and notification listener
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission not granted for notifications');
        return;
      }
    };

    setupNotifications();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // ✅ Fetch message from Gemini API and return it
  const fetchGeminiMessage = async (): Promise<string | null> => {
    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDmgd67c4lWZtjBPB99TUsETlJtqmhcUx4',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: 'one line of motivational quote to fight addictions' },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Response error:', data);
        throw new Error('Network response was not ok');
      }

      const newMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (newMessage) {
        setGeneratedMessage(newMessage); // update state for UI
        return newMessage;
      }

      return null;
    } catch (error) {
      console.error('Error fetching Gemini API message:', error);
      return null;
    }
  };

  // ✅ Send local notification with given message
  const sendNotification = async (message: string) => {
    console.log('Sending notification:', message);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Generated Message',
        body: message,
      },
      trigger: {
        seconds: 5,
        repeats: false,
      }, // Send immediately
    });
  };

  // ✅ Button press handler
  const handleButtonPress = async () => {
    const message = await fetchGeminiMessage();
    if (message) {
      await sendNotification(message);
    } else {
      console.log('No message generated');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Button title="Generate & Send Notification" onPress={handleButtonPress} />
      {generatedMessage ? (
        <Text style={{ marginTop: 20, fontSize: 16, textAlign: 'center' }}>
          Generated Message: {generatedMessage}
        </Text>
      ) : null}
    </View>
  );
}
