import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


export default function HomeScreen() {
    const [username, setUsername] = useState('');
    const [numbers, setNumbers] = useState<String[]>([]);
    const [newNumber, setNewNumber] = useState('');
    const [restricted, setRestricted] = useState('');
    const [heartrate, setHeartrate] = useState<{ meanHeartRate: number; timestamp: string }[]>([]);
    const [styless, setStyles] = useState({});
    const [backgroundpic, s] = useState('');
    const [color, setcolor] = useState('');
    const [color1, setcolor1] = useState('');
    const [backgroundcolor, setBackgroundcolor] = useState('');
    const [tertiarycolor, setTertiarycolor] = useState('');
    const [primarycolor, setPrimarycolor] = useState('');



    AsyncStorage.getItem('backgroundcolor').then((value) => {
        ;
        setcolor(String(value));
        setBackgroundcolor(String(value));
    });
    AsyncStorage.getItem('primary').then((value) => {
        ;
        setPrimarycolor(String(value));
    });
    AsyncStorage.getItem('tertiary').then((value) => {
        ;
        setTertiarycolor(String(value));
    });
    AsyncStorage.getItem('backgroundpic').then((value) => {
        ;
        s(String(value));
    });
    AsyncStorage.getItem('accents').then((value) => {
        ;
        setcolor1(String(value));
    });
    const [email, setEmail] = useState('');
    useEffect(() => {
       
    }, []);
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
            backgroundColor: backgroundcolor,
        },
        card: {
            backgroundColor: tertiarycolor,
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
            backgroundColor: primarycolor,
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
    
 async function fetchData() {
            try {
                const storedUsername = AsyncStorage.getItem('username');
                //console.log(typeof(storedUsername))
                if (typeof(storedUsername)!='object') setUsername(storedUsername);
                const email = AsyncStorage.getItem('email');
                if (typeof(email)!='object') setEmail(email);
                const storedNumbers = await AsyncStorage.getItem('numbers'); // Changed to await
                if (typeof(storedNumbers)!='object') 

                setNumbers(JSON.parse(storedNumbers)); // Moved this line outside of the promise
                // console.log(storedNumbers)
                //if (typeof(storedNumbers)!='object') 
                  
                const restricted = AsyncStorage.getItem('restrictedApps');
                if (typeof(restricted)!='object') setRestricted(JSON.parse(restricted))
                    const existingData = AsyncStorage.getItem('heartRateHistory');
                if (typeof(existingData)!='object') 
                setHeartrate(existingData ? JSON.parse(existingData) : [])
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    const addNumber = async () => {
        if (!newNumber.trim() || isNaN(Number(newNumber))) return; // ✅ Prevent invalid input
        const updatedNumbers = [...numbers, String(newNumber)];
        setNumbers(updatedNumbers);
        AsyncStorage.setItem('numbers', JSON.stringify(updatedNumbers));
        setNewNumber('');
    };

    const removeNumber = async (index: number) => {
        const updatedNumbers = numbers.filter((_, i) => i !== index);
        setNumbers(updatedNumbers);
        AsyncStorage.setItem('numbers', JSON.stringify(updatedNumbers));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
             
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled"> 
                    <Image 
        source={{ uri: backgroundpic }}
        style={StyleSheet.absoluteFill}
      />
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
    <Text style={styles.subtitle}>Heart Rate Data</Text>
    {heartrate.length === 0 ? (
        <Text style={styles.noNumbersText}>No Data added yet.</Text>
    ) : (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false} // Optional to hide the scroll bar
            contentContainerStyle={{ paddingHorizontal: 10 }}
        >
            <LineChart
                data={{
                    labels: heartrate.map((item) =>
                        new Date(item.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    ),
                    datasets: [
                        {
                            data: heartrate.map((item) => item.meanHeartRate),
                            color: (opacity = 1) => `rgb(255, 105, 105)`,
                            strokeWidth: 2,
                        },
                    ],
                }}
                width={Math.max(Dimensions.get('window').width - 40, heartrate.length * 50)} // ✅ Dynamic width based on data
                height={620}
                yAxisSuffix=" bpm"
                verticalLabelRotation={80}
                xLabelsOffset={-10}
                yLabelsOffset={-1}
                fromZero={true}
                segments={6}
                bezier
               
                chartConfig={{
                    backgroundColor: 'rgba(241, 231, 231, 0.68)',
                    backgroundGradientFrom: 'rgb(61, 61, 61)',
                    backgroundGradientTo: 'rgb(37, 39, 39)',
                    decimalPlaces: 0,
                    propsForLabels: {
                        fontFamily: 'SpaceMono',
                        fontSize: 13,
                    },
                    color: (opacity = 1) => `rgb(104, 190, 224)`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 10,
                    },
                    propsForDots: {
                        r: '3',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                    },
                }}
                style={{
                    borderRadius: 10,
                }}
            />
        </ScrollView>
    )}
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

