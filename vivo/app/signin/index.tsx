import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, StyleSheet, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginpic from '../../assets/images/loginpic.png';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeMenu, setActiveMenu] = useState<'signin' | 'signup'>('signin');
  const server = 'https://vivo.niyogi.hackclub.app/';

  const handleLogin = async () => {
    console.log("Login button pressed");
    AsyncStorage.setItem('username', username);
    AsyncStorage.setItem('email', email);
    router.replace('/home/General');
    try {
      const response = await fetch(server + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        AsyncStorage.setItem('token', data.token);
        Alert.alert('Login Success');
      } else {
        Alert.alert('Login Failed', data.data || 'An error occurred');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'An error occurred');
    }
  };

  const handleSignup = async () => {
    console.log("Signup button pressed");
    try {
      const response = await fetch(server + 'register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      Alert.alert(data.data || 'Signup successful');
    } catch (error) {
      console.error(error);
      Alert.alert('Signup Failed', 'An error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.fullh}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={loginpic} style={styles.image} />
          <Text style={styles.txt}>GET READY TO KEEP ADDICTION AT BAY</Text>

          {/* Toggle buttons */}
          <View style={styles.switchBtns}>
            <TouchableOpacity
              style={[styles.switchBtn, activeMenu === 'signin' && styles.activeBtn]}
              onPress={() => setActiveMenu('signin')}
            >
              <Text style={styles.btnText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchBtn, activeMenu === 'signup' && styles.activeBtn]}
              onPress={() => setActiveMenu('signup')}
            >
              <Text style={styles.btnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          {activeMenu === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.btns}>
            {activeMenu === 'signin' ? (
              <TouchableOpacity style={styles.bttn} onPress={handleLogin}>
                <Text style={styles.btnText}>Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={handleSignup}>
                <Text style={styles.btnText}>Signup</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    flex: 1,
    backgroundColor: '#192840',
    padding: 16,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  txt: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'HeadingNow',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 320,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  btns: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 320,
  },
  btn: {
    height: 50,
    width: 150,
    backgroundColor: '#91c4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: '#1e5175',
    borderWidth: 2,
  },
  bttn: {
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
  switchBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  switchBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 1,
  },
  activeBtn: {
    backgroundColor: '#5da9f6',
    borderColor: '#5da9f6',
  },
});
