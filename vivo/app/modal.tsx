import { StyleSheet, Text, View ,TouchableOpacity,PermissionsAndroid} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { Link, router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import SendSMS from 'react-native-sms'
  import * as SMS from 'expo-sms';
export default function Modal() {
  const isPresented = router.canGoBack();
  const [username, setUsername] = useState('');
  useEffect(  () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE
    ).then((d) => {console.log(d)})
   AsyncStorage.getItem('username').then((value) => {
    console.log(value);
    setUsername(String(value));
  })})

  const call=()=>{
    console.log('11')
    RNImmediatePhoneCall.immediatePhoneCall('98325');
  }


  const smss = async () => {
    const { result } = await SMS.sendSMSAsync(
      ['0123456789', '9876543210'], // Recipients
      'This is a distress message!'
    );
  
    console.log(result); // 'sent' or 'cancelled'
  };
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'left',position: 'fixed', top: -50, left: 0, padding: 10}}>
      
      <Text style={styles.txt3} >{username},</Text>
      <Text style={styles.txt2} >YOU ARE</Text>
      <Text style={styles.txt1} >STRONGER</Text>
      <Text style={styles.txt2} >THAN YOU</Text>
      <Text style={styles.txt2} >THINK</Text>
      
      </View>

<View style={styles.btns}>
        <TouchableOpacity style={styles.btn1} onPress={call}>
        <Ionicons name="call" size={65} color="white" />
                  <Text style={styles.btnText}>CALL NATIONAL HELPLINE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bttn}>
         
        </TouchableOpacity>
      </View>
      <View style={styles.btns}>
        <TouchableOpacity style={styles.bttn} >
          
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn1} onPress={smss}>
        <MaterialCommunityIcons name="message-arrow-right" size={65} color="white" />
          <Text style={styles.btnText}>SEND DISTRESS MESSAGE</Text>
        </TouchableOpacity>
      </View>    
      
      <View style={styles.btn}>  {isPresented && <Link style={{color:'white', fontSize: 19}} href="../"><Text> X </Text></Link>}</View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  btns:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 320,
    
    alignItems: 'center',
  },
  
  btn1:{
    height: 150,
    width: 150,
    backgroundColor: '#91c4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#1e5175',
    borderWidth: 2,
    },
  bttn:{
    height: 150,
    width: 150,
    
    
    
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'HeadingNow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 320,
    borderRadius: 25,
    backgroundColor: 'white'
  }
  ,
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eb464c',
    color: 'white',
    borderTopStartRadius: 15,
    borderEndStartRadius: 15,

    
  },
  btn:{
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 15,
    color: 'white',
    marginTop: 10,
    position: 'absolute',
    top: 0,
    right: 10,
    borderColor: 'white',
    borderWidth: 2,
   
    
  },
  txt1:{
    color: '#ffac05',
    fontFamily: 'HeadingNow',
    fontSize: 60,
    marginBottom: -50, 
  },
  txt2:{
    color: '#96e3ae',
    fontFamily: 'HeadingNow',
    fontSize: 60,
    marginBottom: -50, 
  },
  txt3:{
    color: '#a7def1',
    fontFamily: 'HeadingNow',
    fontSize: 60,
    marginBottom: -50, 
  }
});

