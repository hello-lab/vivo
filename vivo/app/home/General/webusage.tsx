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
  const server = 'http://192.168.29.29:3000/';
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
const [nextdns, setnextdns] = useState('');

AsyncStorage.getItem('nextdns').then((value) => {
  setnextdns(String(value));
})
console.log('gvh',nextdns)

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
   alignItems: 'center',
     borderColor: 'red',
    flex: 1,
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
    width: '100%',
  },
  btn:{
    height: 50,
    width: 80,
    backgroundColor: '#91c4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#1e5175',
    borderWidth: 2,
    },
  bttn:{
    height: 50,
    width: 80,
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
   
    <SafeAreaView style={styles.fullh}>
     
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: backgroundpic }}
        style={StyleSheet.absoluteFill}
      /> 
      <TouchableOpacity 
        style={{zIndex:2,position:'absolute',backgroundColor:color1,padding:2,borderRadius:25,right:'1%'}}
        onPress={() => {
          Alert.alert(
            'Help',
            "Private DNS\nAndroid 9 or higher\n1. Go to Settings → Network & internet → Advanced → Private DNS.\n2. Select the Private DNS provider hostname option.\n3. Enter "+nextdns+".dns.nextdns.io and hit Save."
          );
        }}
      >
        <Text style={{color:'red'}}>❓</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Welcome, {username}!</Text>
      
      <View style={styles.btns}>
        {nextdns?<>
<View>
        <View style={{
          padding:20,
          backgroundColor:color1,
          flexDirection:'row',
          borderRadius:20,
          justifyContent:'center',
          alignItems:'center'
        }}
        >
          <Text style={styles.txt}>Add Blocker: </Text>
        <TouchableOpacity 
          style={styles.btn}
          onPress={async () => {
            try {
              const response = await fetch(`https://api.nextdns.io/profiles/${nextdns}/privacy/blocklists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': '4aad3419f4243db5f010cfc16edf13597ff8f449'
          },
          body: JSON.stringify({
            id: 'adguard-dns-filter'
          })
              });
              const data = await response.json();
              console.log(data)
              if (data) { Alert.alert('Error', 'Failed to add blocklist');
         
              }
            } catch (error) {
              console.log(error)
              Alert.alert('Success', 'Blocklist added successfully!');
            }
          }}
        >
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
        <Text>&nbsp;</Text>
        <TouchableOpacity 
          style={styles.bttn}
          onPress={async () => {
            try {
              const response = await fetch(`https://api.nextdns.io/profiles/${nextdns}/privacy/blocklists/adguard-dns-filter`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': '4aad3419f4243db5f010cfc16edf13597ff8f449'
          }
              });
              if (response.ok) {
          Alert.alert('Success', 'Blocklist removed successfully!');
              }
            } catch (error) {
              console.log(error)
              Alert.alert('Error', 'Failed to remove blocklist');
            }
          }}
        >
          <Text style={styles.btnText}>Remove</Text>
        </TouchableOpacity>
        
        </View>
        <View style={{
          padding:20,
          backgroundColor:color1,
          flexDirection:'row',
          borderRadius:20,
          justifyContent:'center',
          alignItems:'center',
          marginTop:10,
          maxWidth:'100%'
        }}
        >
          <View style={{maxWidth:'50%'}}><Text style={{...styles.txt,flexWrap:true }}>Social Media Blocker: </Text></View>
        <TouchableOpacity 
          style={styles.btn}
          onPress={async () => {
            try {
              const response = await fetch(`https://api.nextdns.io/profiles/${nextdns}/privacy/blocklists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': '4aad3419f4243db5f010cfc16edf13597ff8f449'
          },
          body: JSON.stringify({
            id: 'adguard-social-media-filter'
          })
              });
              const data = await response.json();
              if (data.success) {
          Alert.alert('Success', 'Blocklist added successfully!');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to add blocklist');
            }
          }}
        >
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
        <Text>&nbsp;</Text>
        <TouchableOpacity 
          style={styles.bttn}
          onPress={async () => {
            try {
              const response = await fetch(`https://api.nextdns.io/profiles/${nextdns}/privacy/blocklists/adguard-social-media-filter`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': '4aad3419f4243db5f010cfc16edf13597ff8f449'
          }
              });
              if (response.ok) {
          Alert.alert('Success', 'Blocklist removed successfully!');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove blocklist');
            }
          }}
        >
          <Text style={styles.btnText}>Remove</Text>
        </TouchableOpacity>
        
        </View>
        
        </View>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        </>
        
        
        
        
        
        : <TouchableOpacity 
          style={styles.btn}
          onPress={async () => {
            try {
              const response = await fetch('https://api.nextdns.io/profiles', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Api-Key': '4aad3419f4243db5f010cfc16edf13597ff8f449' // Replace with your NextDNS API key
                },
              });
              const data = await response.json().then(async (data) => {
              console.log(data.data.id);
              if (data.data.id) {
                await AsyncStorage.setItem('nextdns', data.data.id);
                setnextdns(data.data.id);
                Alert.alert('Success', 'NextDNS profile created!');
              }})
            } catch (error) {
              Alert.alert('Error', 'Failed to create NextDNS profile');
            }
          }}
        >
          <Text style={styles.btnText}>Create DNS Profile</Text>
        </TouchableOpacity>}
       

        
          
      </View>

      <View style={{ marginTop: 20 }}>
     
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

