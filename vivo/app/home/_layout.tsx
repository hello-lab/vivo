import {SplashScreen, Stack,useRouter} from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router/tabs';
import { Drawer } from 'expo-router/drawer';
import {useFonts} from "expo-font"
import { useEffect } from "react"
import { StyleSheet,View,Button,TouchableOpacity } from "react-native"
export default function RootLayout(){
    const [fontsLoaded] = useFonts( {
        "HeadingNow":require("../../assets/fonts/HeadingNowTrial-68Heavy.ttf"),
        "SpaceMono":require("../../assets/fonts/SpaceMono-Regular.ttf")
    })
    const router = useRouter();

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
    return  <View style={{ flex: 1 }}>
    <Tabs screenOptions={{ tabBarActiveTintColor: '#91c4f6' }}>
         
      <Tabs.Screen
        name="General"
        options={{
            headerStyle: styles.header,
            headerTitleStyle: styles.headerText,
            title: 'HOME',
            headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ONLINE ADDICTION"
        options={{
          title: 'ONLINE',
          headerShown: false,
          
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={32} name="mobile-phone" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ALCOHOL ADDICTION"
        options={{
          title: 'ALCOHOL',
          headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => <FontAwesome size={20} name="glass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="GAMBLING ADDICTION"
        options={{
          title: 'GAMBLING',
          headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => <MaterialCommunityIcons name="slot-machine-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="NICOTINE ADDICTION"
        options={{
          title: 'NICOTINE',
          headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => <MaterialCommunityIcons name="cigar" size={24} color={color} />,
        }}
      />
                 
    </Tabs> <View style={{
    position: 'absolute',
    bottom: 50, 
    right: 0,
    padding: 16,
  }}>
    ///
            <Button color="red" title=" S.O.S." onPress={() => router.push('/modal')} />
            </View>


    </View>

}