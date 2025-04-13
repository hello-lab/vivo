import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
export default  function HomeScren() {
    const router = useRouter();
  const [therapists, setTherapists] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const server = 'https://vivo.niyogi.hackclub.app';
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
const [accents, setAccents] = useState('');
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch(`${server}therapists`);
        const data = await response.json();
        console.log(data)
        setTherapists(data);
      } catch (error) {
        console.error('Error fetching therapists:', error);
        //Alert.alert('Error', 'Failed to load therapists');
      }
    };

    fetchTherapists();
  }, []);


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
    height: '100%', borderColor: 'red'
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
  
     borderColor: 'red',
     flexGrow: 1,
   backgroundColor: color,
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

 useEffect(() => {
  
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
   
    <SafeAreaView style={{flex:1}}>
      
    <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled">
       <Image 
             source={{ uri: backgroundpic }}
             style={StyleSheet.absoluteFill}
           />
            <View style={{  width: '100%' }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 24, color: color1, fontFamily: 'HeadingNow' }}>Available Therapists</Text>
            </View>
            
            {therapists?.map((therapist) => (
              <TouchableOpacity 
              key={therapist.id}
              style={{ 
                backgroundColor: color1,
                padding: 15,
                borderRadius: 10,
                marginBottom: 15,
               // shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                elevation: 3,
              }}
              onPress={() => router.push(`/booking/${therapist.id}`)}
              >
              <View style={{ flexDirection: 'row' }}>
                <Image 
                source={{ uri: therapist.image || 'https://placeholderimage.com/default' }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
                />
                <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{therapist.name}</Text>
                <Text style={{ color: '#666' }}>{therapist.specialization}</Text>
                <Text style={{ color: '#91c4f6' }}>Rs{therapist.hourlyRate}/hour</Text>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Text>⭐ {therapist.rating}</Text>
                  <Text style={{ marginLeft: 10 }}>{therapist.availability}</Text>
                </View>
                </View>
              </View>
              </TouchableOpacity>
            ))}
            
            
            </View>
    </ScrollView>
    </SafeAreaView>
  );
}

