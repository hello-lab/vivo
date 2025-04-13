import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useFonts } from 'expo-font';
import * as Updates from 'expo-updates';
import { SplashScreen, Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 28,
    textAlign: 'left',
    fontFamily: 'HeadingNow',
    color: '#91c4f6',
  },
});

export default function Layout() {
  const [fontsLoaded] = useFonts({
    HeadingNow: require('../assets/fonts/HeadingNowTrial-68Heavy.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={ async () => {
                await Updates.reloadAsync();
              }}
            />
          }
        >
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: 'black',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'DOPA RECOVERY',
                headerStyle: styles.header,
                headerTitleStyle: styles.headerText,
              }}
            />
            <Stack.Screen
              name="signin"
              options={{
                title: 'DOPA RECOVERY',
                headerStyle: styles.header,
                headerTitleStyle: styles.headerText,
              }}
            />
            <Stack.Screen
              name="booking"
              options={{
                title: 'Booking',
                headerStyle: styles.header,
                headerTitleStyle: styles.headerText,
              }}
            />
            <Stack.Screen
              name="home"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
