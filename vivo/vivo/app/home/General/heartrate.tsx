import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor,useCameraFormat } from 'react-native-vision-camera';
import FFT from 'fft.js';
import { useIsFocused } from '@react-navigation/native';
import { useRunOnJS } from 'react-native-worklets-core';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const arrLen = 256;
const normFactor = 1 / (200 * 200 * 25);
const maxBPMHistory = 1544;
const fps = 30;

const calculationDuration = 60 * 1000; // 60 seconds

const HeartRateProcessor = () => {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { fps: fps }
  ])
  const fpss = format // <-- 240 FPS, or lower if 240 FPS is not available
  
  const cameraRef = useRef(null);
  const [bpm, setBPM] = useState<number | null>(null);
  const [frameSumArr, setFrameSumArr] = useState<number[]>([]);
  const [bpmHistory, setBpmHistory] = useState<number[]>([0]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalBPM, setFinalBPM] = useState<number | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const isFocused = useIsFocused();
  const isActive = isFocused && cameraVisible;

  // Animation for Camera Open/Close
  const cameraScale = useRef(new Animated.Value(0)).current;

  // --- Start Camera Animation ---
  const openCamera = () => {
    Animated.timing(cameraScale, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setCameraVisible(true);
  };

  // --- Close Camera Animation ---
  const closeCamera = () => {
    Animated.timing(cameraScale, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setCameraVisible(false));
  };

  // --- Start Timer ---
  const startTimer = () => {
    setIsStarted(true);
    openCamera();
    setElapsedTime(0);
  };

  // --- Stop Timer ---
  const stopTimer = () => {
    setIsStarted(false);
    closeCamera();
  };

  // --- Timer Logic ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && elapsedTime < calculationDuration) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1000);
      }, 1000);
    } else if (elapsedTime >= calculationDuration) {
      const weightedBPM = calculateWeightedAverageBPM(bpmHistory);
      setFinalBPM(Math.round(weightedBPM));
      saveMeanHeartRate(weightedBPM); // Save mean heart rate
      softreset(); // Auto-stop after 60s
    }
    return () => clearInterval(timer);
  }, [isStarted, elapsedTime]);

  // --- Check Camera Permissions ---
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission !== 'granted') {
        alert('Camera permission is required!');
      }
    })();
  }, []);

  // --- Push Data using RunOnJS ---
  const updateFrameSumArr = useRunOnJS((videoDataSum) => {
    setFrameSumArr((prevArr) => {
      const newArr = [...prevArr, videoDataSum];
      console.log(newArr.length);
      if (newArr.length > arrLen) {
        newArr.shift();
        calculateFFT(newArr);
      }
      return newArr;
    });
  }, []);

  // --- Process Each Frame ---
  const onFrameProcessed = useFrameProcessor((frame) => {
    'worklet';
    if (frame && frame.width > 0 && frame.height > 0) {
      const buffer = frame.toArrayBuffer();
      const videoData = new Uint8Array(buffer);

      let videoDataSum = videoData.reduce((a, b) => a + b, 0);
      videoDataSum *= normFactor;

      updateFrameSumArr(videoDataSum);
    }
  }, []);

  // --- FFT to Calculate BPM ---
  const calculateFFT = (data: number[]) => {
    const fft = new FFT(arrLen);
    const out = fft.createComplexArray();
    fft.realTransform(out, data);
    fft.completeSpectrum(out);

    let maxInd = 0;
    let maxVal = 0;
    const lowerBound = 40 / 60;
    const upperBound = 180 / 60;
    const freqResolution = fps / arrLen;

    for (let i = 1; i < arrLen / 2; i++) {
      const freq = i * freqResolution;
      const magnitude = Math.sqrt(out[2 * i] ** 2 + out[2 * i + 1] ** 2);

      if (freq >= lowerBound && freq <= upperBound && magnitude > maxVal) {
        maxVal = magnitude;
        maxInd = i;
      }
    }

    const bpmCandidate = maxInd * freqResolution * 60;
    setBPM(Math.round(bpmCandidate));

    if (bpmCandidate >= 40 && bpmCandidate <= 180) {
      setBpmHistory((prevHistory) => {
        const newHistory = [bpmCandidate, ...prevHistory];
        if (newHistory.length > maxBPMHistory) {
          newHistory.shift();
        }
        return newHistory;
      });
    }
  };

  // --- Final Weighted Average ---
  const calculateWeightedAverageBPM = (bpmHistory: number[]) => {
    if (bpmHistory.length === 0) return 0;
    const weights = bpmHistory.map((_, index) => index + 1);
    const weightedSum = bpmHistory.reduce((sum, bpm, index) => sum + bpm * weights[index], 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return weightedSum / totalWeight;
  };

  // --- Save Mean Heart Rate ---
  const saveMeanHeartRate = async (meanHeartRate: number) => {
    try {
      const timestamp = new Date().toISOString();
      const newEntry = { meanHeartRate, timestamp };
      const existingData = AsyncStorage.getItem('heartRateHistory');
      const heartRateHistory = existingData ? JSON.parse(existingData) : [];
      heartRateHistory.push(newEntry);
      AsyncStorage.setItem('heartRateHistory', JSON.stringify(heartRateHistory));
      console.log('Mean heart rate saved successfully!',heartRateHistory);
    } catch (error) {
      console.error('Failed to save mean heart rate:', error);
    }
  };

  // --- Reset BPM and Timer ---
  const resetBPM = () => {
    setBpmHistory([0]);
    setFrameSumArr([]);
    setBPM(null);
    setFinalBPM(null);
    setElapsedTime(0);
    stopTimer();
  };
  const softreset = () => {
    setBpmHistory([0]);
    setFrameSumArr([]);
    setBPM(null);
    //setFinalBPM(null);
    //setElapsedTime(0);
    stopTimer();
  };

  // --- Toggle Torch ---
  const toggleTorch = () => {
    setTorchOn((prevTorch) => !prevTorch);
  };

  // --- Format Elapsed Time ---
  const formatElapsedTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Circular Progress Bar */}
      

      {/* Animated Camera View */}
      {cameraVisible && (
        <Animated.View
          style={[
            styles.cameraContainer,
            { transform: [{ scale: cameraScale }] },
          ]}
        >
          {device && (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              isActive={isActive && elapsedTime < calculationDuration}
              frameProcessor={onFrameProcessed}
              pixelFormat="rgb"
              fps={fpss}
              torch={torchOn ? 'on' : 'off'}
            />
          )}
        </Animated.View>
      )}

      {/* Start/Stop Button */}
      {!isStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={startTimer}>
          <Text style={styles.buttonText}>▶️ Start</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
          <Text style={styles.buttonText}>⏹️ Stop</Text>
        </TouchableOpacity>
      )}

      {/* BPM Display */}
      <Text style={styles.bpmText}>
        {elapsedTime >= calculationDuration
          ? `✅ Final Weighted BPM:`
          : `❤️ BPM:`}
          <Text style={styles.bppmText}>
          {elapsedTime >= calculationDuration
          ? ` ${finalBPM || '--'}`
          : ` ${bpm || '--'}`}
          </Text>
      </Text>

      {/* Torch and Reset Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleTorch}>
          <Text style={styles.buttonText}>
            {torchOn ? '🔦 Torch Off' : '💡 Torch On'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetBPM}>
          <Text style={styles.buttonText}>🔄 Reset</Text>
        </TouchableOpacity>
        <CircularProgress
          value={(elapsedTime ) / 1000}
          radius={20}
          duration={60}
          progressValueColor="#4b7bec"
          activeStrokeColor="#4b7bec"
          inActiveStrokeColor="#dfe6e9"
          inActiveStrokeOpacity={0.5}
          maxValue={60}
          
          titleStyle={{ fontSize: 26, color: '#576574' }}
        />
      </View>
    </View>
  );
};

export default HeartRateProcessor;

const styles = StyleSheet.create({
  container: {
    fontFamily: 'HeadingNow',
    flex: 1,
    backgroundColor: '#f1f2f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    fontFamily: 'HeadingNow',

    width: 350,
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginVertical: 20,
  },
  camera: {
    fontFamily: 'HeadingNow',

    flex: 1,
  },
  startButton: {
    fontFamily: 'HeadingNow',

    backgroundColor: 'rgb(112, 183, 231)',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  stopButton: {
    fontFamily: 'HeadingNow',

    backgroundColor: 'rgb(235, 130, 118)',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  bpmText: {
    fontFamily: 'HeadingNow',

    fontSize: 22,
    color: '#ff4757',
    marginTop: 20,
  },
  bppmText: {
    fontFamily: 'SpaceMono',

    fontSize: 22,
    color: '#ff4757',
    marginTop: 20,
  },
  buttonContainer: {
    fontFamily: 'HeadingNow',

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    fontFamily: 'HeadingNow',

    backgroundColor: '#576574',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'HeadingNow',

    color: '#fff',
   
  },
});
