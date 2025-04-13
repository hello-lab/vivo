import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
export default  function HomeScren() {
    const router = useRouter();
  const [therapist, setTherapists] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const server = 'http://192.168.29.29:3000/';
  const [backgroundpic, s] = useState('');
  const [color, setcolor] = useState('');
  const [color1, setcolor1] = useState('');
const [primarycolor, setAccents] = useState('');
const { id } = useLocalSearchParams();
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch(`${server}therapists`);
        const data = await response.json();
        //const filteredData = data.filter((item) => item.id !== id);
        data.map((item) => {
          if (item.id === Number(id)) {
            setTherapists(item);
          }
        })
        console.log(id, data.length, therapist.length)
        
      } catch (error) {
        console.error('Error fetching therapists:', error);
        //Alert.alert('Error', 'Failed to load therapists');
      }
    };

    fetchTherapists();
  }, []);

 function adds(d){
  console.log(d)
    AsyncStorage.getItem('apointments').then((prev) => {
const prevArray = prev ? JSON.parse(prev) : [];
   AsyncStorage.setItem('apointments', JSON.stringify([...prevArray, d]));
  const prev1 =  AsyncStorage.getItem('apointments');
  console.log(prevArray,prev1)
  });
  
} 
AsyncStorage.getItem('backgroundcolor').then((value) => {
    console.log(value);
setcolor(String(value))})
AsyncStorage.getItem('backgroundpic').then((value) => {
  console.log(value);
s(String(value))})
AsyncStorage.getItem('accents').then((value) => {
  console.log(value);
setcolor1(String(value))})
AsyncStorage.getItem('primary').then((value) => {
  console.log(value);
setAccents(String(value))})
const styles = StyleSheet.create({
  fullh:{
    height: '100%', borderColor: 'red'
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
  
     borderColor: 'red',
     flexGrow: 1,
   backgroundColor: color,
    padding: 16,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'left',
    top: 0,
    position: 'fixed',
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
    width: 320,
    borderRadius: 25
  },
});
 const [modalVisible, setModalVisible] = useState(false);
 useEffect(() => {
  
    async function fetchData() {
      try{
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
   
    <SafeAreaView style={{flex:1}}>
       <View style={{
          position: 'absolute',
          bottom: 50, 
          right: 0,
          padding: 16,
          zIndex: 5,
        }}>
                  <Button color="red" title=" S.O.S." onPress={() => router.push('/modal')} />
                  </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            backgroundColor: color1,
            padding: 20,
            borderRadius: 10,
            width: '80%',
            maxHeight: '80%'
          }}>
            <Text style={{ fontFamily: 'monospace' ,fontSize: 20, fontWeight: 'bold', marginBottom: 15,color:color }}>Available Slots: {new Date().toLocaleString('en-US', { weekday: 'long' })}</Text>
            <ScrollView>
              {therapist.hourlyAvailability?.[new Date().toLocaleString('en-US', { weekday: 'long' })]?.map((slot, index) => {
              const currentHour = new Date().getHours();
              const isPastTime = slot <= currentHour;
              return (
              <TouchableOpacity
                key={index}
                style={{
                padding: 10,
                backgroundColor: isPastTime ? '#808080' : primarycolor,
                marginBottom: 10,
                borderRadius: 5
                }}
                disabled={isPastTime}
                onPress={() => {
                    Alert.alert('Confirm Booking', `Book appointment for ${slot}?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Confirm', onPress: () => {
                        setModalVisible(false);
                       const Booking = {
                          therapistId: therapist.id,
                          therapistName: therapist.name,
                          date: new Date().toLocaleDateString(),
                          time: `${slot}:00-${slot+1}:00`,
                          
                        }
                        console.log(Booking)
                        adds(Booking);
                        Alert.alert('Booking Confirmed', `Your appointment with ${therapist.name} is booked for ${slot}:00-${slot+1}:00`);
                      }}
                    ]);
                  }}
                >
                  <Text style={{ fontFamily: 'monospace' ,color: 'white', textAlign: 'center' }}>{slot}:00-{slot+1}:00</Text>
                </TouchableOpacity>
              )})}
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: '#f1adc4',
                borderRadius: 5
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ fontFamily: 'monospace' ,color: 'white', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled">
       <Image 
             source={{ uri: backgroundpic }}
             style={StyleSheet.absoluteFill}
           />
    

            <View style={{ padding: 16, width: '100%' ,backgroundColor: color1, borderRadius: 25}}>
              {/* Therapist Header Section */}
              <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' }}>
               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',flexDirection:'column' }}>
               
                <Image 
                  source={{ uri: therapist.image || 'https://placeholderimage.com/default' }}
                  style={{ width: 120, height: 120, borderRadius: 20 }}
                />
                {/* Booking Slots Section */}
                <View style={{ marginTop: 10, width: '80%' }}>
                    <TouchableOpacity
                    style={{
                      backgroundColor: '#91c4f6',
                      padding: 10,
                      borderRadius: 8,
                      marginBottom: 10
                    }}
                    onPress={() => {
                      const today = new Date();
                      const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
                      console.log(dayOfWeek);
                      if (therapist.hourlyAvailability && therapist.hourlyAvailability[dayOfWeek]) {
                      const availableHours = therapist.hourlyAvailability[dayOfWeek];
                      
                      if (availableHours.length > 0) {
                        setModalVisible(true);
                       
                      } else {
                        Alert.alert("No Slots", "No available slots for today");
                      }
                      } else {
                      Alert.alert("Not Available", "This therapist is not available today");
                      }
                    }}
                    >
                    <Text style={{ fontFamily: 'monospace' ,color: 'white', fontWeight: 'bold', fontFamily: 'monospace' }}>Book Now</Text>
                    </TouchableOpacity>
                </View>
                
                </View>
                <View style={{ marginLeft: 20, flex: 1 }}>
                  <Text style={{ fontFamily: 'monospace' ,fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>
                    {therapist.name}
                  </Text>
                  <Text style={{ fontFamily: 'monospace' ,fontSize: 18, color: '#666', marginBottom: 5 }}>
                    {therapist.specialization}
                  </Text>
                  <Text style={{ fontFamily: 'monospace' ,fontSize: 20, color: '#91c4f6' }}>
                    Rs{therapist.hourlyRate}/hour
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ fontFamily: 'monospace' ,fontSize: 16 }}>⭐ {therapist.rating}</Text>
                    <Text style={{ fontFamily: 'monospace' ,marginLeft: 15, fontSize: 16 }}>
                      {therapist.availability}
                    </Text>
                  </View>
                </View>
              </View>

              {/* About Section */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontFamily: 'monospace' ,fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                  About
                </Text>
                <Text style={{ fontFamily: 'monospace' ,fontSize: 16, color: '#444', lineHeight: 24 }}>
                  {therapist.about}
                </Text>
              </View>

              {/* Experience Section */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontFamily: 'monospace' ,fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                  Experience
                </Text>
                <Text style={{ fontFamily: 'monospace' ,fontSize: 16 }}>
                  {therapist.experience} 
                </Text>
              </View>

              {/* Languages Section */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontFamily: 'monospace' ,fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                  Languages
                </Text>
                <Text style={{ fontFamily: 'monospace' ,fontSize: 16 }}>
                  {therapist.language ?  (therapist.languages).join(', '): 'English'}
                </Text>

              </View>

              {/* Reviews Section */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontFamily: 'monospace' ,fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                  Reviews
                </Text>
                {therapist.reviews?.map((review, index) => (
                  <View key={index} style={{ marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 }}>
                    <Text style={{ fontFamily: 'monospace' ,fontSize: 16, fontWeight: '500', marginBottom: 5 }}>{review.name}</Text>
                    <Text style={{ fontFamily: 'monospace' ,fontSize: 14, color: '#666' }}>{review.review}</Text>
                    <Text style={{ fontFamily: 'monospace' ,fontSize: 14, color: '#91c4f6', marginTop: 5 }}>⭐ {review.rating}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            
    </ScrollView>
    </SafeAreaView>
  );
}

