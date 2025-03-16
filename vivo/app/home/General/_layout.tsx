import {SplashScreen, Stack} from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router/tabs';
import { Drawer } from 'expo-router/drawer';
import {GestureHandlerRootView} from "react-native-gesture-handler"
import {useFonts} from "expo-font"
import { useEffect } from "react"
import { StyleSheet } from "react-native"
export default function RootLayout(){
    const [fontsLoaded] = useFonts( {
        "HeadingNow":require("../../../assets/fonts/HeadingNowTrial-68Heavy.ttf"),
        "SpaceMono":require("../../../assets/fonts/SpaceMono-Regular.ttf")
    })


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 28,
    
    textAlign: 'left',
    top: 0,
    position: 'fixed',
    fontFamily: 'HeadingNow',
    color: '#91c4f6',
  },
});    
useEffect(()=>{
    if(fontsLoaded){SplashScreen.hideAsync()}},[fontsLoaded])
        if(!fontsLoaded){return null}
    return  <GestureHandlerRootView style={{ flex: 1 }}>
         <Drawer>
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
  name="webusage" // This is the name of the page and must match the url from root
  options={{
    drawerLabel: 'Web Usage',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerText,
    title: 'Web Usage',
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
      </Drawer>


  </GestureHandlerRootView>}