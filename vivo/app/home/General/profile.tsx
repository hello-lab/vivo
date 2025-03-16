import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const [username, setUsername] = useState('');
    const [numbers, setNumbers] = useState<number[]>([]);
    const [newNumber, setNewNumber] = useState('');
    const [restricted, setRestricted] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        async function fetchData() {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername) setUsername(storedUsername);
                const email = await AsyncStorage.getItem('email');
                if (email) setEmail(email);
                const storedNumbers = await AsyncStorage.getItem('numbers');
                if (storedNumbers) setNumbers(JSON.parse(storedNumbers));
                const restricted = await AsyncStorage.getItem('restrictedApps');
                if (restricted) setRestricted(JSON.parse(restricted))
                
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const addNumber = async () => {
        if (!newNumber.trim() || isNaN(Number(newNumber))) return; // ✅ Prevent invalid input
        const updatedNumbers = [...numbers, parseInt(newNumber)];
        setNumbers(updatedNumbers);
        await AsyncStorage.setItem('numbers', JSON.stringify(updatedNumbers));
        setNewNumber('');
    };

    const removeNumber = async (index: number) => {
        const updatedNumbers = numbers.filter((_, i) => i !== index);
        setNumbers(updatedNumbers);
        await AsyncStorage.setItem('numbers', JSON.stringify(updatedNumbers));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        <Text style={styles.title}>Welcome, {username}!</Text>
                        <View style={styles.section}>
                            <Text style={styles.subtitle}>Email</Text>
                            <View style={styles.numbersContainer}>
                               <Text> {email }</Text>
                            </View>

                            
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.subtitle}>Restricted Apps</Text>
                            <View style={styles.numbersContainer}>
                            {restricted.length === 0 ? (
                                    <Text style={styles.noNumbersText}>No Apps added yet.</Text>
                                ) : (
                                    restricted.map((number, index) => (
                                        <View key={index} style={styles.numberRow}>
                                            <Text style={styles.txt}>{number}</Text>
                                           
                                        </View>
                                    ))
                                )}
                            </View>

                            
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.subtitle}>Emergency Numbers</Text>
                            <View style={styles.numbersContainer}>
                                {numbers.length === 0 ? (
                                    <Text style={styles.noNumbersText}>No numbers added yet.</Text>
                                ) : (
                                    numbers.map((number, index) => (
                                        <View key={index} style={styles.numberRow}>
                                            <Text style={styles.txt}>{number}</Text>
                                            <TouchableOpacity
                                                style={styles.deleteBtn}
                                                onPress={() => removeNumber(index)}
                                            >
                                                <Text style={styles.deleteBtnText}>X</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter a number"
                                value={newNumber}
                                onChangeText={setNewNumber}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.btn} onPress={addNumber}>
                                <Text style={styles.btnText}>Add Number</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    flexContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'grey',
        padding: 15,
        borderRadius: 10,
        width: '90%',
    },
    title: {
        fontSize: 28,
        marginBottom: 16,
        fontFamily: 'HeadingNow',
        color: '#fff',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#e9ebf0',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 22,
        marginBottom: 10,
        fontFamily: 'HeadingNow',
        color: '#333',
    },
    numbersContainer: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    numberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    txt: {
        fontSize: 20,
        fontFamily: 'SpaceMono',
        color: '#ffa824',
    },
    deleteBtn: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteBtnText: {
        color: 'white',
        fontSize: 14,
    },
    noNumbersText: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
    },
    btn: {
        height: 50,
        width: '100%',
        backgroundColor: '#91c4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        borderColor: '#1e5175',
        borderWidth: 2,
        marginVertical: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'HeadingNow',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '100%',
        borderRadius: 25,
    },
});
