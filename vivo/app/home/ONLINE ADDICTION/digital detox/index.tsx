import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { getInstalledApps } from 'react-native-get-app-list';
export default  function HomeScren() {
    const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const server = 'https://vivo.niyogi.hackclub.app';
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
const [color2,setcolor2]=useState('')
const [detox,setdetox]=useState([false,0])


    const [installedApps, setInstalledApps] = useState<{ label: string; value: string }[]>([]);
    const [selectedApps, setSelectedApps] = useState<string[]>([]);


AsyncStorage.getItem('detox').then((value) => {
  console.log(value);
 try{ 
  if (value)
setdetox(JSON.parse(value))}
catch{
  setdetox([false,0])

}
})
AsyncStorage.getItem('backgroundcolor').then((value) => {
    console.log(value);
setcolor(String(value))})
AsyncStorage.getItem('backgroundpic').then((value) => {
  console.log(value);
s(String(value))})
AsyncStorage.getItem('accents').then((value) => {
  console.log(value);
setcolor1(String(value))})
AsyncStorage.getItem('primary').then((value) => {
  console.log(value);
setcolor2(String(value))})
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
const [timeLeft, setTimeLeft] = useState(0); // 24 hours in seconds

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
  }, 1000);
if (detox.length!=0) {
  const now = new Date().getTime();
  const endTime = new Date(detox[1]).getTime();
  const difference = Math.floor((endTime - now) / 1000); // Convert milliseconds to seconds
  setTimeLeft(Math.max(0, difference)); // Ensure timeLeft doesn't go negative
}
  return () => clearInterval(timer);
}, [detox]);

const hours = Math.floor(timeLeft / 3600);
const minutes = Math.floor((timeLeft % 3600) / 60);
const seconds = timeLeft % 60;


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

    fetchData();}, [detox]);


    useEffect(() => {
            async function fetchData() {
                try {
                    // Fetch installed apps
                    getInstalledApps().then((apps) => {
                        const formattedApps = apps
                          .map((app: any) => app.packageName)
                          .filter((packageName: string) => packageName !== 'com.anonymous.vivo');
                        setInstalledApps(formattedApps);
                        console.log(formattedApps)

                });
                   
                    
                    
               
             //[{"label": "com.instagram.android", "value": "com.anonymous.vivo"}, {"label": "Facebook", "value": "com.facebook.katana"}]
            
    ///
                    
    
                   
                } catch (error) {
                    console.error("Error fetching installed apps:", error);
                }
            }
    
            fetchData();
        }, []);
    
        const saveRestrictedApps = async () => {
            try {
    
               
                  
                AsyncStorage.setItem("restrictedApps", JSON.stringify(installedApps));
                Alert.alert("Success", "Restricted apps saved!");
            } catch (error) {
                console.error("Error saving restricted apps:", error);
            }
        };
  return (
   
    <SafeAreaView style={styles.fullh}>
      
    <ScrollView contentContainerStyle={styles.container}>
       <Image 
             source={{ uri: backgroundpic }}
             style={StyleSheet.absoluteFill}
           />
      <Text style={styles.title}>Welcome, {username}!</Text>
        {detox[0]?
        <>
        <View 
        style={{padding:5,backgroundColor:color2,justifyContent: 'center',borderRadius:20}}
        > <Text style={{ 
          fontSize: 20, 
          fontFamily: 'HeadingNow',
          color: color1 || '#000'
        }}>
          TIME LEFT:
        </Text>
            <View style={{ alignItems: 'center',backgroundColor:color,padding:10,borderRadius:30,alignSelf:'center' }}>
              <Text style={{ 
                fontSize: 60, 
                fontFamily: 'monospace',
                color: color1 || '#000'
              }}>
                {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
              </Text>
            </View></View>
          <TouchableOpacity
            style={{
              backgroundColor: '#ff4444',
              padding: 15,
              borderRadius: 25,
              marginTop: 20,
              width: 150,
              alignItems: 'center'
            }}
            onPress={() => {
              console.log('1illkms')
              
                setdetox([false, 0]);
                AsyncStorage.setItem('detox', JSON.stringify([false, 0]));
                AsyncStorage.setItem("restrictedApps", JSON.stringify([]));
            console.log(timeLeft)
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'HeadingNow'
            }}>
              Stop Detox Day :(
            </Text>
          </TouchableOpacity></>:<>
          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              padding: 15,
              borderRadius: 25,
              marginTop: 20,
              width: 150,
              alignItems: 'center'
            }}
            onPress={() => {
              const endTime = new Date();
              endTime.setHours(endTime.getHours() + 24);
              setdetox([true, endTime.toISOString()]);
              AsyncStorage.setItem('detox', JSON.stringify([true, endTime.toISOString()]));
              saveRestrictedApps()
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'HeadingNow'
            }}>
              Start Detox Day
            </Text>
          </TouchableOpacity>
          
          </>}
    </ScrollView>
    </SafeAreaView>
  );
}

