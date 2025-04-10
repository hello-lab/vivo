import React, { useState, useEffect, } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Button,
  Switch,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { launchImageLibraryAsync }from 'expo-image-picker';

import { Dimensions ,Image} from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";

export default function HomeScreen() {
    const [prompt, setPrompt] = useState("Can you add a llama next to the image?");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [newNumber, setNewNumber] = useState("");
  const [restricted, setRestricted] = useState("");
  const [heartrate, setHeartrate] = useState<
    { meanHeartRate: number; timestamp: string }[]
  >([]);
  const [colors, setcolorpicked] = useState("");
  const [backgroundcolor, setBackgroundcolor] = useState("");
  const [primarycolor, setPrimarycolor] = useState("");
  const [secondarycolor, setSecondarycolor] = useState("");
  const [tertiarycolor, setTertairycolor] = useState("");
  const [accentcolor, setAccentcolor] = useState("");
  const [backgroundpic, setBackgroundpic] = useState("");
  const [backgroundpics, setBackgroundpics] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState("");

  const generateImage = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError("");
      setImageBase64("");

      const response = await fetch("http://192.168.29.29:3000/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (data?.image) {
        const imageUri = `data:image/png;base64,${data.image}`;
        setImageBase64(data.image);
        
        // Add the generated image to backgroundpics
        setBackgroundpics(oldArray => [...oldArray, imageUri]);
        AsyncStorage.setItem("backgroundpics", JSON.stringify([...backgroundpics, imageUri]));
    } else {
        setError("Image not generated.");
    }

      if (data?.image) {
        setImageBase64(data.image);
      } else {
        setError("Image not generated.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };


  
  const onSelectColor = ({ hex }: { hex: string }) => {
    const [image, setImage] = useState<string | null>(null);

  
    // Save and set the selected color
    console.log(hex);
   // setBackgroundcolor(hex);
    AsyncStorage.setItem(colors, hex);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const storedUsername = AsyncStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
        const email = AsyncStorage.getItem("email");
        if (email) setEmail(email);
       
      
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images',],
      allowsEditing: true,
      aspect: [9, 19],
      quality: 1,
    });

    console.log(result);

   
      if (result.assets) {
        setBackgroundpics(oldarray => [...oldarray, result.assets[0].uri]);
        AsyncStorage.setItem("backgroundpics", JSON.stringify([...backgroundpics, result.assets[0].uri]));
      }
    console.log(backgroundpics);
  };
  AsyncStorage.getItem("backgroundpics").then((value) => {
    setBackgroundpics(JSON.parse(value));
 })
  AsyncStorage.getItem("backgroundpic").then((value) => {
   setBackgroundpic(String(value));
  // console.log(value);
   
    
     //console.log("enabled");
   
})
  AsyncStorage.getItem("backgroundcolor").then((value) => {
    setBackgroundcolor(String(value));
  });
  AsyncStorage.getItem("primary").then((value) => {
    setPrimarycolor(String(value));
  });
  AsyncStorage.getItem("secondary").then((value) => {
    setSecondarycolor(String(value));
  });
  AsyncStorage.getItem("tertiary").then((value) => {
    setTertairycolor(String(value));
  });
  AsyncStorage.getItem("accents").then((value) => {
    setAccentcolor(String(value));
  });

function setbg(uri: string) {
 AsyncStorage.setItem("backgroundpic", uri);
   
    
}

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 12,
      //
    },
  
    picker: {
      backgroundColor: "rgba(0, 0, 0, 0.81)",
      padding: "5%",
      display: "flex",
      borderRadius: 50,
      justifyContent: "center",
      // alignItems: 'center',
    },
    safeArea: {
      flex: 1,
      backgroundColor: "white",
    },
    flexContainer: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingVertical: 20,
      alignItems: "center",
    },
    card: {
      backgroundColor: tertiarycolor,
      padding: 15,
      borderRadius: 10,
      width: "90%",
    },
    title: {
      fontSize: 28,
      marginBottom: 16,
      fontFamily: "HeadingNow",
      color: "#fff",
      textAlign: "center",
    },
    section: {
      backgroundColor: "#e9ebf0",
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
    },
    subtitle: {
      fontSize: 22,
      marginBottom: 10,
      fontFamily: "HeadingNow",
      color: "#333",
    },
    numbersContainer: {
      backgroundColor: "lightgray",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    numberRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 5,
    },
    txt: {
      fontSize: 20,
      fontFamily: "SpaceMono",
      color: "#ffa824",
    },
    deleteBtn: {
      backgroundColor: "#ff4d4d",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    deleteBtnText: {
      color: "white",
      fontSize: 14,
    },
    noNumbersText: {
      fontSize: 18,
      color: "#555",
      textAlign: "center",
    },
    btn: {
      height: 50,
      width: "100%",
      backgroundColor: "#91c4f6",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 25,
      borderColor: "#1e5175",
      borderWidth: 2,
      marginVertical: 10,
    },
    btnText: {
      color: "white",
      fontSize: 16,
      fontFamily: "HeadingNow",
    },
    input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      width: "100%",
      borderRadius: 25,
    },
  });
  const addNumber = async () => {
    if (!newNumber.trim() || isNaN(Number(newNumber))) return; // ✅ Prevent invalid input
    const updatedNumbers = [...numbers, parseInt(newNumber)];
    setNumbers(updatedNumbers);
    AsyncStorage.setItem("numbers", JSON.stringify(updatedNumbers));
    setNewNumber("");
  };

  const removeNumber = async (index: number) => {
    const updatedNumbers = numbers.filter((_, i) => i !== index);
    setNumbers(updatedNumbers);
    AsyncStorage.setItem("numbers", JSON.stringify(updatedNumbers));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundcolor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        <Image 
                     source={{ uri: backgroundpic }}
                     style={StyleSheet.absoluteFill}
                   />
        <Modal visible={showModal} transparent={true} animationType="slide">
          <View style={styles.modal}>
            <ColorPicker
              style={styles.picker}
             // value={}
              onCompleteJS={onSelectColor}
            >
              <Preview />
              <Text>{"/n/n"}</Text>
              <Panel1 />
              <Text>{"/n/n"}</Text>

              <HueSlider />
              <Text>{"/n/n"}</Text>

              <OpacitySlider />
              <Text>{"/n/n"}</Text>

              <Swatches />
            </ColorPicker>
            <Button title="Ok" onPress={() => setShowModal(false)} />
          </View>
        </Modal>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Welcome, {username}!</Text>
            
            <View style={styles.section}>
              <Text style={styles.subtitle}>Primary Color</Text>
              <View
                style={{
                  backgroundColor: primarycolor,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text> </Text>
              </View>
              <Text> </Text>
              <Button
                title="Color Picker"
                onPress={() => {
                  setcolorpicked("primary");
                  setShowModal(true);
                }}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Secondary Color</Text>
              <View
                style={{
                  backgroundColor: secondarycolor,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text> </Text>
              </View>
              <Text> </Text>
              <Button
                title="Color Picker"
                onPress={() => {
                  setcolorpicked("secondary");
                  setShowModal(true);
                }}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Tertiary Color</Text>
              <View
                style={{
                  backgroundColor: tertiarycolor,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text> </Text>
              </View>
              <Text> </Text>
              <Button
                title="Color Picker"
                onPress={() => {
                  setcolorpicked("tertiary");
                  setShowModal(true);
                }}
              />
            </View>
            
            <View style={styles.section}></View>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Accent Color</Text>
              <View
                style={{
                  backgroundColor: accentcolor,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text> </Text>
              </View>
              <Text> </Text>
              <Button
                title="Color Picker"
                onPress={() => {
                  setcolorpicked("accents");
                  setShowModal(true);
                }}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Background Settings</Text>
            
              <View
                style={{
                  backgroundColor: backgroundcolor,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text> </Text>
              </View>
              <Text> </Text>
              <Button
                title="Color Picker"
                onPress={() => {
                  setcolorpicked("backgroundcolor");
                  setShowModal(true);
                }}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.subtitle}>BackGround Image</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Enter a prompt:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. A robot dancing in the rain"
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />

      <Button title="Generate Image" onPress={generateImage} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {imageBase64 && (
        <Image
          source={{ uri: `data:image/png;base64,${imageBase64}` }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </ScrollView>
              </View>
              <ScrollView horizontal>
                {backgroundpics.map((uri, index) => (
                  <View key={index} style={{ marginRight: 10 }}>
                    <View>
                      <TouchableOpacity onPress={() => setbg(uri)}>
                        <Image
                          source={{ uri }}
                          style={{ width: 100, height: 100, borderRadius: 10 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{
                          position: 'absolute',
                          right: 5,
                          top: 5,
                          backgroundColor: 'rgba(255,0,0,0.7)',
                          borderRadius: 15,
                          width: 30,
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        onPress={() => {
                          const newPics = backgroundpics.filter(pic => pic !== uri);
                          setBackgroundpics(newPics);
                          AsyncStorage.setItem("backgroundpics", JSON.stringify(newPics));
                        }}
                      >
                        <Text style={{color: 'white', fontSize: 20}}>×</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <Text> </Text>
              <Button
                title="Pick Image"
                onPress={pickImage}
                              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


