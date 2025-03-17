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
          drawerLabel: 'Alcohol Addiction Dashboard',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Alcohol Addiction',
        }}
      />
      <Drawer.Screen
        name="bank integration" // This is the name of the page and must match the url from root
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
        name="Money Saved" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: 'Money Saved',
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
          title: 'Money Saved',
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