import AsyncStorage from '@react-native-async-storage/async-storage';
import { center } from '@shopify/react-native-skia';
import React, { useRef, useState } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, StyleSheet, View, TouchableOpacity,Image, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

const App: React.FC = () => {
  
  const [load, setLoad] = useState<boolean>(true); // Default AI name
  const webViewRef = useRef(null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [nexdns,setnexdns]=useState('')
 


  const [backgroundpic, s] = useState('');
      const [color, setcolor] = useState('');
      const [color1, setcolor1] = useState('');


      AsyncStorage.getItem('nextdns').then((value) => {
        console.log(value);
    setnexdns(String(value))})
    AsyncStorage.getItem('backgroundcolor').then((value) => {
        console.log(value);
    setcolor(String(value))})
    AsyncStorage.getItem('backgroundpic').then((value) => {
      console.log(value);
    s(String(value))})
    AsyncStorage.getItem('accents').then((value) => {
      console.log(value);
    setcolor1(String(value))})
   const initialUrl = 'https://api.nextdns.io/profiles/'+nexdns;
  const targetUrl = 'https://my.nextdns.io/3285a4/setup';
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: color,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      borderRadius: 8,
      fontSize: 16,
      color: '#333',
      backgroundColor: color1,
    },
    userMessage: {
      fontSize: 18,
      padding: 10,
      backgroundColor: '#91c4f6',
      borderRadius: 8,
      marginVertical: 4,
      fontFamily: 'Arial',
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    aiMessage: {
      fontSize: 18,
      padding: 10,
      backgroundColor: '#f1adc4',
      borderRadius: 8,
      marginVertical: 4,
      fontFamily: 'Courier New',
      color: '#00000',
      fontWeight: 'normal',
      textAlign: 'left',
    },
    boldText: {
      fontWeight: 'bold',
      color: '#000', // Make bold text black or customize the color
    },
    italicText: {
      fontStyle: 'italic',
      color: '#000', // Make italic text grey or customize the color
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    error: {
      color: 'red',
      marginTop: 12,
      fontSize: 14,
    },
  });
  
  // Function to parse Markdown and convert it into React Native components



  const saveCookies = async () => {
    if (webViewRef.current) {
      const cookiesString = await webViewRef.current.injectJavaScript(`
        document.cookie
      `);
    
         
    }
  };

  const handleNavigationStateChange = (navState) => {
    if (navState.url === initialUrl && !navState.loading && !initialLoadComplete) {
      console.log('Initial page loaded.');
      setInitialLoadComplete(true);
      // Call the function to save cookies and redirect
      saveCookies();
    } else if (navState.url === targetUrl) {
      console.log('Successfully redirected to the target page.');
      // You can now interact with the target page with the saved cookies
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={{ uri: backgroundpic }}
        style={StyleSheet.absoluteFill}
      />

    
 <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden', zIndex: 1 }}>
 <WebView
      ref={webViewRef}
      source={{ uri: targetUrl }}
      onNavigationStateChange={handleNavigationStateChange}
    />
</View>
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
