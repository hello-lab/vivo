import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
export default  function HomeScren() {
    const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const server = 'http://192.168.29.29:3000/';
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
  const [journalentries, setJournal] = useState([]);
  const [journal, setJournalEntries] = useState([]);
const [primarycolor, setprimarycolor] = useState('');
const [secondarycolor, setsecondarycolor] = useState('');
const [tertiarycolor, settertiarycolor] = useState('');
const [relapsed, setRelapsed] = useState(false);
AsyncStorage.getItem('secondary').then((value) => {setsecondarycolor(String(value))})
AsyncStorage.getItem('tertiary').then((value) => {settertiarycolor(String(value))})

AsyncStorage.getItem('backgroundcolor').then((value) => {
    console.log(value);
setcolor(String(value))})
AsyncStorage.getItem('primary').then((value) => {
  console.log(value);
setprimarycolor(String(value))})
AsyncStorage.getItem('backgroundpic').then((value) => {
  console.log(value);
s(String(value))})
AsyncStorage.getItem('accents').then((value) => {
  console.log(value);
setcolor1(String(value))})
const styles = StyleSheet.create({
  fullh:{
    height: '100%', 
    borderColor: 'red',
    flex: 1,
  },
  btn1:{
    position: 'absolute',
    bottom: 0, 
    right: 0,
    padding: 16,
  },
image:{
  width: 320,
  height: 250,
 
  marginBottom: 16,
  borderRadius: 25

},
  container: {
   alignItems: 'center',
     borderColor: 'red',
   backgroundColor: color,
    padding: 15,
    flexGrow: 1,
    zIndex:2,
    justifyContent: 'center',
            paddingVertical: 20,
            alignItems: 'center',
            
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'left',
    top: 0,
  
    fontFamily: 'HeadingNow',
    color: '#91c4f6',
  },
  txt: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    top: 0,
    position: 'fixed',
    fontFamily: 'HeadingNow',
    color: 'black',
  },
  btns:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
  },
  btn:{
    height: 50,
    width: 150,
    backgroundColor: '#91c4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#1e5175',
    borderWidth: 2,
    },
  bttn:{
    height: 50,
    width: 150,
    backgroundColor: '#f1adc4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#ff51b5',
    borderWidth: 2,
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
    borderRadius: 15
  },
});

 useEffect(() => {
  
    async function fetchData() {
      try{
        AsyncStorage.getItem('journal').then((value) => {
 
          setJournal(JSON.parse(value));
      
      })
  AsyncStorage.getItem('username').then((value) => {
    console.log(value);
    setUsername(String(value));
  })
      AsyncStorage.getItem('email').then((value) => {
        console.log(value);
    setEmail(String(value))})}
  catch (error) {
    
  }
  }

    fetchData();}, []);
  return (
   
    <SafeAreaView style={styles.fullh}>
       <KeyboardAvoidingView
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      style={{flex: 1}}
                  >
      <ScrollView contentContainerStyle={styles.container}>
        <Image 
          source={{ uri: backgroundpic }}
          style={StyleSheet.absoluteFill}
        />
        <View style={{backgroundColor: color1, borderRadius: 20, padding: 20, width: '100%', marginBottom: 20}}>
         
        <Text style={styles.title}>Welcome, {username}!</Text>
        <View style={{backgroundColor:secondarycolor, width: '100%' ,padding: 20, borderRadius: 20, marginBottom: 20}}>
        
            <Text style={[styles.txt, { position: 'relative', marginBottom: 10 ,color:color1}]}>
            Today's Journal Entry
            </Text>
            <TextInput
            style={[styles.input, { textAlignVertical: 'top', padding: 10,backgroundColor:color1 }]}
            multiline={true}
            onChangeText={(text) => setJournalEntries(text)}
            placeholder="Write about your day..."
            placeholderTextColor="#666"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity
              style={{
              width: 24,
              height: 24,
              borderWidth: 2,
              borderColor: primarycolor,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
              backgroundColor: relapsed ? primarycolor : 'transparent'
              }}
              onPress={() => setRelapsed(!relapsed)}
            >
              {relapsed && <Text style={{ color: color1 }}>✓</Text>}
            </TouchableOpacity>
            <Text style={[styles.txt, {color:color1, marginBottom: 0,fontSize:12 }]}>Relapsed today</Text>
           </View>
          <TouchableOpacity 
            style={[styles.btn, { marginTop: 10 }]}
            onPress={async () => {
              setJournal( (prevEntries) => {
                console.log(relapsed)
                console.log(prevEntries, journalentries);
                const newEntries = [[String(new Date()).slice(0,String(new Date()).length-9) ,journal,relapsed], ...prevEntries];
                AsyncStorage.setItem('journal', JSON.stringify(newEntries));
                return newEntries;
              })
              try {
                console.log(journalentries[0]);
                const response = await fetch(
                  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDmgd67c4lWZtjBPB99TUsETlJtqmhcUx4",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      contents: [
                        {
                          parts: [
                            { text: String([String(new Date()).slice(0,String(new Date()).length-9) ,journal,relapsed]) }, // Use user input as the text to generate a response
                          ],
                          
                        },
                      ],
                       systemInstruction: {
                        role: 'user',
                        parts: [{
                          text: 'You are "Helper", an AI therapist, you should act proffesional and be friendly to the user. You work with DopaCare and App that helps in fighting addiction , you should never refer yourself as a therapist but as a Helper. you will get a journal entry and you will give a response to the user based on the journal entry in an array the first element is date the second is the entry and the third element is a boolean for whether the person relapsed. A person has relapsed only if the last value is true in the end ask if it wants to talk more about it they can talk to you from AI chat which is a different page or talk about in forum or book a therapist from appointment in out app \n'
                        }]
                      },
                    }),
                  }
                );
        
                const data = await response.json();
                console.log("AI Response:", data.candidates[0].content.parts[0].text);
                const processedText = data.candidates[0].content.parts[0].text
                  .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
                  .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
                  .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
                  .replace(/#{1,6}\s/g, '');       // Remove headers

                Alert.alert(
                  "Helper's Response",
                  processedText,
                  [{ text: "OK" }]
                );
        
              } catch (error) {
              }
            }
              //Alert.alert('Saved', 'Journal entry saved successfully!')
              }
          >
            <Text style={styles.btnText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={[styles.txt, { position: 'relative' }]}>Previous Entries</Text>
          {journalentries ?  journalentries.map((entry, index) => (
          <>  <View key={index} style={{ 
              backgroundColor: secondarycolor, 
              padding: 15, 
              borderRadius: 10, 
              marginBottom: 10 ,
            
            }}>
             <View key={index} style={{ 
              backgroundColor: primarycolor, 
              padding: 15, 
              borderRadius: 10, 
              marginBottom: 10 
            }}> <Text style={{ fontFamily: 'monospace', fontSize: 16 , color:color1 }}>{entry[1]}</Text>
            </View>
              <Text style={{ fontFamily: 'monospace', fontSize: 16 ,color:color1}}>{entry[0]}</Text>
              <View style={{ 
              width: 15, 
              height: 15, 
              backgroundColor: entry[2] ? 'red' : 'green',
              borderRadius: 5,
              borderWidth: 2,
              borderColor: primarycolor,
             
              right: 10,
              top: 10
            }} ></View>
            </View>
            </>
          )):<Text>No entries available.</Text> }
        </View>
        
                </View>
      </ScrollView></KeyboardAvoidingView>
    </SafeAreaView>
  );
}

