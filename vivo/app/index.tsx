import React, { useEffect ,useState} from 'react';
import { View, Text, StyleSheet, Button, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { NativeModules } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { AppBlockServiceStarter } = NativeModules;

const Index = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  useEffect(() => {
    const requestPermissions = async () => {
      try {
       
    
       
        // Start background service
        AppBlockServiceStarter.startService();
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Vivo</Text>
      <Button title="Sign In" onPress={() => router.push('/signin')} />
      <Button  title="help" onPress={() => router.push('/modal')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192840',
  },
  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    margin: 10,
  },
});

export default Index;
