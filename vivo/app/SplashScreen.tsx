// SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Video } from 'expo-av';

SplashScreen.preventAutoHideAsync();

export default function AnimatedSplash({ onAnimationEnd }: { onAnimationEnd: () => void }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();  // hide native splash
      onAnimationEnd();
    }, 6400); // duration of GIF animation

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      
      <View  style={{
                flex:1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',position:'absolute',
               top:'35%',
               left:'13%'
              }}>
      <Video
              ref={videoRef}
              source={require('../assets/images/splash.mp4')}
              style={{
                height: 512,
                width: 512,
               
              }}
              shouldPlay
              isLooping={true}
              isMuted
            /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%',

  },
  image: {
    width: 300,
    height: 300,
  },
});
