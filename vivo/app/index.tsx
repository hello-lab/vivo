import React, { useEffect ,useRef,useState} from 'react';
import { View, Text, StyleSheet, Button, Alert, Linking, ImageBackground,Image } from 'react-native';
import { useRouter } from 'expo-router';
import { NativeModules } from 'react-native';
import AnimatedSplash from './SplashScreen';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { AppBlockServiceStarter } = NativeModules;
const image = {uri: 'https://legacy.reactjs.org/logo-og.png'};
import notif from '../components/Notifs';
const Index = () => {
  const router = useRouter();
  const [username, setUsername] = useState(''); 
  const [showSplash, setShowSplash] = useState(true);
  notif()
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
       
       
       
        // Start background service
        AppBlockServiceStarter.startService();
        await AsyncStorage.getItem('backgroundcolor').then((value) => {
            if (!value) {
          AsyncStorage.setItem('backgroundcolor', '#192840');
          AsyncStorage.setItem('primary', '#91c4f6');
          AsyncStorage.setItem('secondary', 'rgb(107, 107, 107)');
          AsyncStorage.setItem('tertiary', '#192840');
          AsyncStorage.setItem('accents', 'white');
          AsyncStorage.setItem('backgroundpic', 'https://tmp.starryai.com/api/122102/8f5c442f-5a41-4b78-8700-d4f0185f0760.png');
          AsyncStorage.setItem('backgroundpics', JSON.stringify([]));
          AsyncStorage.setItem('apointments', JSON.stringify([]));
            AsyncStorage.setItem('journal', JSON.stringify([]));

        }
        })
      
      
        
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    requestPermissions();
  }, []);

  return  <>  {(showSplash)? <AnimatedSplash onAnimationEnd={() => setShowSplash(false)} />:
  <View style={styles.container}>
      
      <Text style={styles.text}>Welcome to Vivo</Text>
      <Button title="Sign In" onPress={() => router.push('/signin')} />
      <Button  title="help" onPress={() => router.push('/home/ONLINE ADDICTION/routine generation')} />

      
    </View>}</>}
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192840',
    alignContent:'center'
  },
  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    margin: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Index;
