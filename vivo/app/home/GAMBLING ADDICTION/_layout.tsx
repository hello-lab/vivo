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
    fontSize: 25,
    
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
          drawerLabel: 'Gambling Addiction Dashboard',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Gambling Addiction',
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
        name="Bank Integration" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Bank Integration',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Bank Integration',
        }}
      />
      <Drawer.Screen
        name="location fencing" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Location Fencing',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Location Fencing',
        }}
      />
            <Drawer.Screen
        name="Support Material" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Support Material',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Support Material',
        }}
      />
      <Drawer.Screen
        name="webrestriction" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Web Restriction',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Web Restriction',
        }}
      />
      
    </Drawer>
  </GestureHandlerRootView>
}