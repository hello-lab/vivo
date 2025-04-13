import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { requestUsagePermission,getUsageLast24Hr,checkPackagePermission, getUsageCustomRange } from 'react-native-app-usage';
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';
import PieChartt from 'react-native-pie-chart'
export default  function HomeScren() {
    const router = useRouter();
  
    // ...
      interface AppUsageData {
        packageName: string;
        totalForegroundTime: number;
      }
      
             const [appUsage, setAppUsage] = useState<AppUsageData[]>([]);
             const [prevapp, setprevapp] = useState<AppUsageData[]>([]);
             const [loading, setLoading] = useState(true);
             const [commonapps, setcommonapps] = useState<{
               packageName: string;
               currentUsage: number;
               previousUsage: number;
             }[]>([]);
useEffect(() => {
  checkPackagePermission().then(permissionGranted=>{
    if(!permissionGranted)
    {
      requestUsagePermission() ;// If permission not granted then request for permission
    }
    else{
      getUsageCustomRange(String((new Date(new Date().setHours(0,0,0,500))).getTime()), String(new Date().getTime()), (data)=>{
       
    let allAppUsage=data;
        // Filter out system apps and apps with 0 usage time
        allAppUsage = data.filter(app => 
          app.totalForegroundTime > 0
        ).sort((a, b) => b.totalForegroundTime - a.totalForegroundTime)
        .reduce((unique, app) => {
          if (!unique.some(item => item.packageName === app.packageName)) {
            unique.push(app);
          }
          return unique;
        }, [])
        
        setAppUsage(allAppUsage)

        const newPieData = allAppUsage.map((app, index) => ({
          usage: app.totalForegroundTime,
          color: `hsl(${(index * 137.5) % 360}, 100%, 70%)`,
        }));
        setPieData(newPieData);

        const newSeries = allAppUsage.map((app, index) => ({
          name: app.packageName.split('.')[app.packageName.split('.').length - 1],
          value: app.totalForegroundTime,
          color: `hsl(${(index * 137.5) % 360}, 100%, 70%)`,
        }));
        setSeries(newSeries);
      })

      getUsageCustomRange(
        String(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0)),
        String(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(23, 59, 59, 999)),
        (data) => {
          let allAppUsage = data;
          // Filter out system apps and apps with 0 usage time
          allAppUsage = data.filter(app => 
            app.totalForegroundTime > 0
          ).sort((a, b) => b.totalForegroundTime - a.totalForegroundTime)
          .reduce((unique, app) => {
            if (!unique.some(item => item.packageName === app.packageName)) {
              unique.push(app);
            }
            return unique;
          }, [])
          
          setprevapp(allAppUsage)

          
        }

      )

      setcommonapps(()=> appUsage.map(currentApp => {
        const prevAppData = prevapp.find(prev => prev.packageName === currentApp.packageName);
        return {
          packageName: currentApp.packageName,
          currentUsage: currentApp.totalForegroundTime,
          previousUsage: prevAppData ? prevAppData.totalForegroundTime : 0
        };
      }).filter(app => app.previousUsage > 0))
    }
    
  }).catch(error=>{
    console.log('error==>',error);
  })
  
})

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const server = 'https://vivo.niyogi.hackclub.app';
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
  const [primary, setprimary] = useState('');
  const screenWidth = Dimensions.get("window").width;
  
          const [pieData, setPieData] = useState([]);
          const [series, setSeries] = useState([]);

          

const styles = StyleSheet.create({
  appUsageRow: {
    backgroundColor: color1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontFamily: 'HeadingNow',
  },
  headrow: {
    fontFamily: 'HeadingNow',
    backgroundColor: color1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  columnHeader: {
    fontSize: 16,
    
    color: primary,
    textAlign: 'center',
    fontFamily: 'HeadingNow',
  },
  appName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'monospace',
    
  },
  usageTime: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fullh:{
    height: '100%',
    borderColor: 'red',
   zIndex: 5, 
      borderRadius: 5,
      width: '95%',

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
    zIndex: 5,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'left',
    top: 0,
    position: 'fixed',
    fontFamily: 'HeadingNow',
    color: primary,
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
    setprimary(String(value));
  })
     function fetchData() {
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
   
    <SafeAreaView style={styles.container}>
      <Image 
             source={{ uri: backgroundpic }}
             style={StyleSheet.absoluteFill}
           />


  <>
    <ScrollView horizontal showsVerticalScrollIndicator>
      <View style={{ flexDirection: 'row', height: 100, alignItems: 'flex-end', paddingHorizontal: 10 }}>
        {commonapps.map((app, index) => (
          <View key={app.packageName} style={{ marginHorizontal: 5, width: 40 }}>
            <View style={{ 
              height: Math.min(180 * (app.currentUsage / (60 * 60 * 1000)), 180),
              backgroundColor: `hsl(${(index * 137.5) % 360}, 100%, 70%)`,
              width: '100%',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }} />
            <View style={{ 
              height: Math.min(180 * (app.previousUsage / (60 * 60 * 1000)), 180),
              backgroundColor: `hsl(${(index * 137.5) % 360}, 80%, 85%)`,
              width: '100%',
              marginTop: 2,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }} />
            <Text style={{ 
              fontSize: 10, 
              textAlign: 'center', 
              transform: [{ rotate: '-45deg' }],
              width: 60,
              
            }}>
              {app.packageName.split('.').pop()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  </>
    <ScrollView style={styles.fullh}>
     <Text style={styles.title}>Hey {username}<Text style={{color: color1,fontFamily:'monospace'

     }}> Time Saved:
  {commonapps.reduce((total, app) => total + (app.previousUsage - app.currentUsage), 0) > 0 ? 
      Math.ceil((commonapps.reduce((total, app) => total + (app.previousUsage - app.currentUsage), 0)/1000/60)) + ' minutes' : 
      'No time saved yet'}</Text>  </Text>
 
    <View style={styles.headrow}>
      <Text style={[styles.columnHeader, { flex: 2 }]}>Package Name</Text>
      <Text style={[styles.columnHeader, { flex: 1 }]}>Yesterday</Text>
      <Text style={[styles.columnHeader, { flex: 1 }]}>Today</Text>
    </View>
    {commonapps.map((app,index )=> (
      <View key={app.packageName} style={{...styles.appUsageRow, backgroundColor: `hsl(${(index * 137.5) % 360}, 80%, 85%)`,}}>
        
        <Text style={[styles.appName, { flex: 2 }]}>
          {app.packageName.split('.')[app.packageName.split('.').length - 1]}
        </Text>
        <Text style={[styles.usageTime, { flex: 1 }]}>
        {Math.ceil(((app.previousUsage /1000) % (60*60)) )}
        </Text>
        <Text style={[styles.usageTime, { flex: 1 }]}>
          {Math.ceil(((app.currentUsage/1000) % (60*60)) )}
        </Text>
      </View>
                ))}
    </ScrollView>
    </SafeAreaView>
  )
}

