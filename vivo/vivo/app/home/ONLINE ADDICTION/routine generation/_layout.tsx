import {SplashScreen, Stack} from "expo-router"
import {useFonts} from "expo-font"
import { useEffect } from "react"
export default function RootLayout(){
    const [fontsLoaded] = useFonts( {
        "HeadingNow":require("../../../../assets/fonts/HeadingNowTrial-68Heavy.ttf"),
        "SpaceMono":require("../../../../assets/fonts/SpaceMono-Regular.ttf")
    })
useEffect(()=>{
    if(fontsLoaded){SplashScreen.hideAsync()}},[fontsLoaded])
        if(!fontsLoaded){return null}
    return <Stack screenOptions={{headerShown:false}} />
}