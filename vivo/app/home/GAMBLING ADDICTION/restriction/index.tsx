import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInstalledApps } from 'react-native-get-app-list';
import DropDownPicker from "react-native-dropdown-picker";

export default function HomeScreen(): JSX.Element {
    const [username, setUsername] = useState<string>('User');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [installedApps, setInstalledApps] = useState<{ label: string; value: string }[]>([]);
    const [selectedApps, setSelectedApps] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch installed apps
                getInstalledApps().then((apps) => {
                    const formattedApps = apps.map((app: any) => ({
                        label: app.appName,
                        value: app.packageName, // Use packageName instead of versionName
                    }));
                    AsyncStorage.getItem('restrictedApps').then((restrictedApps) => {
                        const parsedRestrictedApps = JSON.parse(restrictedApps || '[]');
                        setSelectedApps(() => parsedRestrictedApps);
                        setInstalledApps(formattedApps);
                    }).catch((error) => {
                        console.error("Error fetching restricted apps:", error);
                    });
                }).catch((error) => {
                    console.error("Error fetching installed apps:", error);
                });
               
                
                
           
         //[{"label": "com.instagram.android", "value": "com.anonymous.vivo"}, {"label": "Facebook", "value": "com.facebook.katana"}]
        

                

               
            } catch (error) {
                console.error("Error fetching installed apps:", error);
            }
        }

        fetchData();
    }, []);

    const saveRestrictedApps = async () => {
        try {

           
              
            await AsyncStorage.setItem("restrictedApps", JSON.stringify(selectedApps));
            Alert.alert("Success", "Restricted apps saved!");
        } catch (error) {
            console.error("Error saving restricted apps:", error);
        }
    };
//h
    return (
        <SafeAreaView style={styles.fullh}>
            {/* Disable scrolling to prevent DropDownPicker conflict */}
            <View style={styles.container}  >
              <View style={{backgroundColor: '#6d6e6b', width: '100%', padding: 12, display: 'flex', borderRadius:24}}>
                <Text style={styles.title2}>THIS IS FOR YOUR BEST </Text>
                <Text style={styles.title}> {username}!</Text>

                
                </View>
                <Text style={styles.txt}>APPS TO BE RESTRICTED</Text>
                <View style={styles.contt}>
                
                {/* Wrap DropDownPicker inside a View */}
                <View style={{ width: "100%" }}>
                    <DropDownPicker
                        open={dropdownOpen}
                        setOpen={setDropdownOpen}
                        items={installedApps}
                        value={selectedApps}
                        setValue={setSelectedApps}
                        multiple={true}
                        placeholder="Select restricted apps"
                        mode="BADGE"
                        
                        searchable={true}
                    />
                </View>
                </View>

                <Button title="Save Restricted Apps" onPress={saveRestrictedApps} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    fullh: {
        height: '100%',
    },
    image: {
        width: 320,
        height: 250,
        marginBottom: 16,
        borderRadius: 25,
    },
    container: {
        alignItems: 'center',
        flex: 1,
        padding: 16,

    },
    contt: {
      alignItems: 'center',
      flex: 1,
      padding: 16,
      display: 'flex',
      justifyContent: 'space-between',
  },
    title: {
        fontSize: 28,
        marginBottom: 16,
        textAlign: 'left',
        fontFamily: 'HeadingNow',
        color: '#91c4f6',
    },
    title2: {
      fontSize: 58,
      marginBottom: 16,
      textAlign: 'left',
      fontFamily: 'HeadingNow',
      color: '#e2aef2',
  },
    txt: {
        fontSize: 20,
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'HeadingNow',
        color: '#99e0ac',
    },
});
