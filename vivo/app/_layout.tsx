import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useFonts} from "expo-font"
import { useEffect } from "react"
import {SplashScreen, Stack} from "expo-router"



const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'left',
    top: 0,
    position: 'fixed',
    fontFamily: 'HeadingNow',
    color: '#91c4f6',
  },
});

export default function Layout() {
    const [fontsLoaded] = useFonts( {
        "HeadingNow":require("../assets/fonts/HeadingNowTrial-68Heavy.ttf"),
        "SpaceMono":require("../assets/fonts/SpaceMono-Regular.ttf")
    })
useEffect(()=>{
    if(fontsLoaded){SplashScreen.hideAsync()}},[fontsLoaded])
        if(!fontsLoaded){return null}
    return  <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
        title: 'DOPA RECOVERY',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerText
        }} 
      />
      <Stack.Screen 
        name="signin" 
        options={{ 
        title: 'DOPA RECOVERY',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerText
        }} 
      />
      <Stack.Screen 
        name="home" 
        options={{ 
        title: 'DOPA RECOVERY',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerText
        }} 
      />
    </Stack>
    
    
  ;}