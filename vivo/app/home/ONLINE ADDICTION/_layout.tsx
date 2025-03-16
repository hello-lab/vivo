import {SplashScreen, Stack} from "expo-router"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
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
    </Drawer>
  </GestureHandlerRootView>
}