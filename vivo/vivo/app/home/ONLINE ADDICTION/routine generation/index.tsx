import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen(): JSX.Element {
    const [username, setUsername] = useState<string>('User');
   
     AsyncStorage.getItem('username').then((value) => {
        console.log(value);
        setUsername(String(value))})
    return (
        <SafeAreaView style={styles.fullh}>
            {/* Disable scrolling to prevent DropDownPicker conflict */}
            <View style={styles.container}>
              <View style={{backgroundColor: '#6d6e6b', width: '100%', padding: 12, display: 'flex', borderRadius:24}}>
                <Text style={styles.title2}>PLACEHOLDER </Text>
                <Text style={styles.title}> {username}!</Text>

                
                </View>
                
                
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
        fontSize: 45,
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
