import React from 'react';
import { View, Text, StyleSheet,Button } from 'react-native';
import {Link, useRouter, Redirect} from 'expo-router'
const Index = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text className='bold' style={styles.text}>Welcome to Vivo</Text>
            <Button title="Sign In" onPress={() => {
                router.push('/signin');
            }}/>
                            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default Index;