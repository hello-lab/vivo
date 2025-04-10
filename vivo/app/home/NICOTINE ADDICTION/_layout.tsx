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
          drawerLabel: 'Nicotine Addiction Dashboard',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Nicotine Addiction',
        }}
      />
      <Drawer.Screen
        name="lung damage" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Lung Damage',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Lung Damage',
        }}
      />
      <Drawer.Screen
        name="Breathing Exercises" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Breathing Exercises',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Breathing Exercises',
        }}
      />
       <Drawer.Screen
        name="Money Saved Calculator" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Money Saved Calculator',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Money Saved ',
        }}
      />
       <Drawer.Screen
        name="Support Media" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Support Material',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Support Material',
        }}
      />
    </Drawer>
  </GestureHandlerRootView>
}