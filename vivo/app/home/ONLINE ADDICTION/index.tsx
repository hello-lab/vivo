import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const server = 'http://192.168.29.29:3000/';
 useEffect(() => {
    async function fetchData() {
      try{
  await AsyncStorage.getItem('username').then((value) => {
    console.log(value);
    setUsername(String(value));
  })
      await AsyncStorage.getItem('email').then((value) => {
        console.log(value);
    setEmail(String(value))})}
  catch (error) {
    
  }
  }

    fetchData();}, []);
  return (
   
    <SafeAreaView style={styles.fullh}>
    <ScrollView contentContainerStyle={styles.container}>
     
      <Text style={styles.title}>Welcome, {username}!</Text>
     
      
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullh:{
    height: '100%', borderColor: 'red'
  },
image:{
  width: 320,
  height: 250,
 
  marginBottom: 16,
  borderRadius: 25

},
  container: {
   alignItems: 'center',
     borderColor: 'red',
    flex: 1,
   
    padding: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'left',
    top: 0,
    position: 'fixed',
    fontFamily: 'HeadingNow',
    color: '#91c4f6',
  },
  txt: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    top: 0,
    position: 'fixed',
    fontFamily: 'HeadingNow',
    color: 'black',
  },
  btns:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
  },
  btn:{
    height: 50,
    width: 150,
    backgroundColor: '#91c4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#1e5175',
    borderWidth: 2,
    },
  bttn:{
    height: 50,
    width: 150,
    backgroundColor: '#f1adc4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#ff51b5',
    borderWidth: 2,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'HeadingNow',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 320,
    borderRadius: 25
  },
});
