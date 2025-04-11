import React, { useState, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";

export default function HomeScreen() {
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

  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const onSelectColor = ({ hex }: { hex: string }) => {
    
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
        const storedNumbers = AsyncStorage.getItem("numbers");
        if (storedNumbers) setNumbers(JSON.parse(storedNumbers));
        const restricted = AsyncStorage.getItem("restrictedApps");
        if (restricted) setRestricted(JSON.parse(restricted));
        const existingData = AsyncStorage.getItem("heartRateHistory");
        setHeartrate(existingData ? JSON.parse(existingData) : []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
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
        {" "}
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
              <Text style={styles.subtitle}>Background Color</Text>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
    backgroundColor: "grey",
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
