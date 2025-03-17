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
        name="Support Material" // This is the name of the page and must match the url from root
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