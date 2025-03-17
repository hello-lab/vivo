import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen(): JSX.Element {
  
    return (
        <SafeAreaView style={styles.fullh}>
            {/* Disable scrolling to prevent DropDownPicker conflict */}
            <View style={styles.container}  >
              <View style={{backgroundColor: '#6d6e6b', width: '100%', padding: 12, display: 'flex', borderRadius:24}}>
                <Text style={styles.title2}> Placeholder </Text>

                
                </View>

                <View style={styles.contt}>
                
                {/* Wrap DropDownPicker inside a View */}
                <View style={{ width: "100%", zIndex: 1000 }}>
                   
                </View>
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
      fontSize: 49,
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
