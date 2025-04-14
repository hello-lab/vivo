import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
export default  function HomeScren() {
    const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const server = 'https://vivo.niyogi.hackclub.app';
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
  const [generatedmsg, setGeneratedMessage]=useState('')
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
        setGeneratedMessage(newMessage.split("")); // update state for UI
        console.log('Generated message:', newMessage);
        return newMessage;
      }

      return null;
    } catch (error) {
      console.error('Error fetching Gemini API message:', error);
      return null;
    }
  };
AsyncStorage.getItem('backgroundcolor').then((value) => {
    console.log(value);
setcolor(String(value))})
AsyncStorage.getItem('backgroundpic').then((value) => {
  console.log(value);
s(String(value))})
AsyncStorage.getItem('accents').then((value) => {
  console.log(value);
setcolor1(String(value))})
const styles = StyleSheet.create({
  fullh:{
    height: '100%', borderColor: 'red',
    flex:1
  },
  btn1:{
    position: 'absolute',
    bottom: 0, 
    right: 0,
    padding: 16,
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
  flexGrow:1,
   backgroundColor: color,
    padding: 16,
    flexDirection:'column'
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
    marginTop:10,
  },
  btn:{
    height: 80,
    width: 150,
    backgroundColor: '#91c4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#1e5175',
    borderWidth: 2,
    flexDirection:'row'
    },
  bttn:{
    height: 80,
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

 useEffect(() => {
 
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
                  { text: 'one line of motivational quote to fight addictions or ask user to drink water or meditate, no markup formatting' },
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
   fetchGeminiMessage()
    async function fetchData() {
      try{
  AsyncStorage.getItem('username').then((value) => {
    console.log(value);
    setUsername(String(value));
  })
      AsyncStorage.getItem('email').then((value) => {
        console.log(value);
    setEmail(String(value))})}
  catch (error) {
    
  }
  }

    fetchData();}, []);
  return (
   
    <SafeAreaView style={styles.fullh}>
      
    <ScrollView contentContainerStyle={styles.container}>
       <Image 
             source={{ uri: backgroundpic }}
             style={StyleSheet.absoluteFill}
           />
      <Text style={styles.title}>Welcome, {username}!</Text>
          <View style={{ alignItems: 'center',backgroundColor:color,padding:5,borderRadius:30,alignSelf:'center' ,width:'100%',marginBottom:5}}>
                 <Text style={{ 
                                 fontSize: 55, 
                                 fontFamily: 'HeadingNow',
                                 color: color1 || '#000'
                               }}>
                                 
                                 {generatedmsg}
                               </Text>
                  
                             </View>
          <View style={styles.btns}>
            <TouchableOpacity 
              style={styles.bttn}
              onPress={() => router.push('/home/General/aichat')}>
              <Text style={styles.btnText}>AI CHAT</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.btn}
              onPress={() => router.push('/home/General/appointment')}>
              <Text style={styles.btnText}>Therapist Appointment</Text>
            </TouchableOpacity>
            


            
          </View>
          <View style={styles.btns}>
            
            <TouchableOpacity 
              style={styles.btn}
              onPress={() => router.push('/home/General/chat room')}>
              <Text style={styles.btnText}>Forum Discussion</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bttn}
              onPress={() => router.push('/home/General/dailyjournal')}>
              <Text style={styles.btnText}>Journal</Text>
            </TouchableOpacity>


            
          </View>
          <View style={styles.btns}>
            <TouchableOpacity 
              style={styles.bttn}
              onPress={() => router.push('/home/General/heartrate3')}>
              <Text style={styles.btnText}>Stress Detector</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.btn}
              onPress={() => router.push('/home/General/profile')}>
              <Text style={styles.btnText}>Profile</Text>
            </TouchableOpacity>
            


            
          </View>
          <View style={styles.btns}>
            
            <TouchableOpacity 
              style={styles.btn}
              onPress={() => router.push('/home/General/theme')}>
              <Text style={styles.btnText}>Theme</Text>
            </TouchableOpacity>
           
            <TouchableOpacity 
              style={styles.bttn}
              onPress={() => router.push('/home/General/webusage copy')}>
              <Text style={styles.btnText}>Web Usage</Text>
            </TouchableOpacity>

            
          </View>
    </ScrollView>
    </SafeAreaView>
  );
}



