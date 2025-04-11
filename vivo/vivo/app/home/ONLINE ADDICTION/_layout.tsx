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
        "HeadingNow":require("../../../assets/fonts/HeadingNowTrial-68Heavy.ttf"),
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
         ><Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Online Addiction Dashboard',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Online Addiction',
        }}
      />
      <Drawer.Screen
        name="restriction" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Apps Restriction',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Apps Restriction',
        }}
      />
      <Drawer.Screen
        name="digital detox" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Digital Detox',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Digital Detox',
        }}
      />
      <Drawer.Screen
        name="doomscroll notification" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Doomscroll Notification',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Dooscroll Notification',
        }}
      />
      <Drawer.Screen
        name="routine generation" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Routine Generation',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Routine Generation',
        }}
      />
      <Drawer.Screen
        name="time saved" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Time Saved',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Time Saved',
        }}
      />
      <Drawer.Screen
        name="usage analysis" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Usage Analysis',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Usage Analysis',
        }}
      />
      <Drawer.Screen
        name="Support Media" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Support Media',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Support Media',
        }}
      />
    </Drawer>
  </GestureHandlerRootView>
}