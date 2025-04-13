
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function notif() {
  const [generatedMessage, setGeneratedMessage] = useState<string>(''); 

  // ✅ Set up permissions and notification listener
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission not granted for notifications');
        return;
      }

     await scheduleNotificationAtTime(''); // Schedule the notification
    };
    setupNotifications();
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
        console.log('Generated message:', newMessage);
        return newMessage;
      }

      return null;
    } catch (error) {
      console.error('Error fetching Gemini API message:', error);
      return null;
    }
  };

  // ✅ Schedule notification for 2:18 AM local time
  const scheduleNotificationAtTime = async (message: string) => {
    await fetchGeminiMessage(); // Fetch the message before scheduling
  // const mess= generatedMessage;
//console.log('Time difference in seconds:', timeDifferenceInSeconds);
    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Motivational Message',
        body: generatedMessage,
      },
      trigger: {
        type: 'daily',
         hour: 21, 
        minute: 58,
      
      },
    });

    console.log('Notification scheduled for 2:18 AM every day');
  };

  // ✅ Start the process when the app is opened

  return 
}
