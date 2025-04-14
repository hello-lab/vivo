import {SplashScreen, Stack} from "expo-router"
import { Drawer } from 'expo-router/drawer';
import {GestureHandlerRootView} from "react-native-gesture-handler"
import {useFonts} from "expo-font"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontStyle } from "@shopify/react-native-skia";
export default function RootLayout(){
    const [fontsLoaded] = useFonts( {
        //"HeadingNow":require("../../../assets/fonts/HeadingNowTrial-68Heavy.ttf"),
        "SpaceMono":require("../../../assets/fonts/SpaceMono-Regular.ttf")
    })



 const [backgroundcolor, setBackgroundcolor] = useState("");
  const [primarycolor, setPrimarycolor] = useState("");
  const [secondarycolor, setSecondarycolor] = useState("");
  const [tertiarycolor, setTertairycolor] = useState("");
  const [accentcolor, setAccentcolor] = useState("");
  AsyncStorage.getItem("backgroundcolor").then((value) => {
    setBackgroundcolor(String(value));
  });
  AsyncStorage.getItem("primary").then((value) => {
    setPrimarycolor(String(value));
  });
  AsyncStorage.getItem("secondary").then((value) => {
    setSecondarycolor(String(value));
  });
  AsyncStorage.getItem("tertiary").then((value) => {
    setTertairycolor(String(value));
  });
  AsyncStorage.getItem("accents").then((value) => {
    setAccentcolor(String(value));
  }); 
  const styles = StyleSheet.create({
    header: {
      backgroundColor: accentcolor,
    },
    headerText: {
      fontSize: 28,
      
      textAlign: 'left',
      top: 0,
      position: 'fixed',
      fontFamily: 'HeadingNow',
      color: primarycolor,
    },
  });   
  console.log(secondarycolor)
useEffect(()=>{
 
    if(fontsLoaded){SplashScreen.hideAsync()}},[fontsLoaded])
        if(!fontsLoaded){return null}
    return  <GestureHandlerRootView style={{ flex: 1 ,backgroundColor:'red'}}>
      
         <Drawer
          screenOptions={{ 
            drawerActiveTintColor: '#91c4f6',
            drawerInactiveTintColor: secondarycolor,
            drawerLabelStyle: {
            
              fontSize: 20,
              fontFamily: 'HeadingNow',
            },
               drawerStyle:{ backgroundColor: accentcolor, flex: 1,} }}
         >
    <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'General',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'DOPA RECOVERY',
        }}
      />
       <Drawer.Screen
        name="aichat" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'AI Chat',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'AI CHAT',
        }}
      /> <Drawer.Screen
      name="appointment" // This is the name of the page and must match the url from root
      options={{
        drawerLabel: 'Appointment',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerText,
        title: 'Appointment',
       
      }}
    /> <Drawer.Screen
    name="dailyjournal" // This is the name of the page and must match the url from root
    options={{
      drawerLabel: 'Daily Journal',
      headerStyle: styles.header,
      headerTitleStyle: styles.headerText,
      title: 'Daily Journal',
    }}
  /> <Drawer.Screen
  name="app usage" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'App Usage',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'App Usage',
  }}
/>
<Drawer.Screen
  name="webusage copy" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'Web Usage',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'Web Usage',
  }}
/>
<Drawer.Screen
  name="webusage" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'Web Usage',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'Web Usage',
    drawerItemStyle: { display: 'none' }
  }}
/>
<Drawer.Screen
  name="chat room" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'Forum',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'Forum Discussion',
  }}
/>
<Drawer.Screen
  name="profile" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'Profile',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'Profile',
  }}
/>
<Drawer.Screen
  name="theme" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'Theme',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'Theme',
  }}
/>
<Drawer.Screen
  name="heartrate3" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'Stress Detector',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'Stress Detector',
  }}
/>

      </Drawer>


  </GestureHandlerRootView>}