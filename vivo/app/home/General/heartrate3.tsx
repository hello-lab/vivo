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
import { Options, useResizePlugin } from 'vision-camera-resize-plugin';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { Canvas, Path, Skia, vec, useFont, Text as SkiaText } from '@shopify/react-native-skia';

const screenWidth = Dimensions.get('window').width;




interface IntensityGraphProps {
  frameSumArr: { value: number }[];
}

type PixelFormat = Options<'uint8'>['pixelFormat'];

const WIDTH = 30;
const HEIGHT = 30;
const TARGET_TYPE = 'uint8' as const;
const TARGET_FORMAT: PixelFormat = 'rgb';

const arrLen = 256;
const maxBPMHistory = 1544;
const fps = 30;

const calculationDuration = 60 * 1000; // 60 seconds

const HeartRateProcessor = () => {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { fps: fps }
  ])
  const fpss = format // <-- 240 FPS, or lower if 240 FPS is not available
  const [t0, sett0] = useState(performance.now());
  const [times, setTimes] = useState<number[]>([0]);
  var timesLen = arrLen/4;
  var curPollFreq;
  const cameraRef = useRef(null);
  const [bpm, setBPM] = useState(0);
  type FrameData = { value: number; time: number };
  const [frameSumArr, setFrameSumArr] = useState<FrameData[]>([{ value: 0, time: 0 }]);
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
  const screenWidth = Dimensions.get('window').width;



 var data =  frameSumArr.slice(-100).map((item) => item.value)
  const width = screenWidth - 20;
  const height = 200;
  const padding = 20;

  // Find min and max for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  // Create path using data points
  const path = Skia.Path.Make();
  data.forEach((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
    if (index === 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  });
//const gradient = Skia.Shader.MakeLinearGradient(
  //  [vec(0, 0), vec(0, height)],
    //['#ff4757', '#ffe6e6'], // Gradient from red to light red
  //  [0, 1]
 // );
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
 // --- Push Data to Frame Sum Array ---
const updateFrameSumArr = useRunOnJS((videoDatta) => {
 /* setFrameSumArr((prevArr) => {
    const newArr = [...prevArr, videoDataSum];

    if (newArr.length > arrLen) {
      newArr.shift();
      calculateFFT(newArr);
    }
    return newArr;
  });*/
//console.log("Video Data:",videoDatta.length);
  const value = averageBrightness(videoDatta);
  const time = Date.now();
//console.log("Value:",value);
  frameSumArr.push({ value, time });
  if (frameSumArr.length > arrLen) {
    frameSumArr.shift();
  }

  const dataStats = analyzeData(frameSumArr);
  const bpm =Math.round( calculateBpm(dataStats.crossings))
  console.log("bb",bpm);
   if (bpm && bpm >= 40 && bpm <= 180) {
    setBPM((prevBPM) => Math.round(prevBPM + (bpm - prevBPM) * 0.1));

    // Push BPM to history for averaging
    setBpmHistory((prevHistory) => {
     const newHistory = [bpm, ...prevHistory];
     if (newHistory.length > maxBPMHistory) {
       newHistory.pop();
      }
    return newHistory;
    });
 }


},[]);
const plugin = useResizePlugin();

// --- Updated Frame Processing ---
const onFrameProcessed = useFrameProcessor((frame) => {
 
 
  'worklet';
  if (frame && frame.width > 0 && frame.height > 0) {
    const buffer = frame.toArrayBuffer();
   // const videoData = new Uint8Array(buffer);
 const videoData = plugin.resize(frame, {
    scale: {
      width: WIDTH,
      height: HEIGHT,
    },
    dataType: TARGET_TYPE,
    pixelFormat: TARGET_FORMAT,
    rotation: '90deg',
    mirror: true,
  });
  console.log(typeof(videoData)); 
  const videoDataArray = Array.from(videoData) as number[];
  updateFrameSumArr(videoDataArray);
    // Calculate frame brightness sum for each frame
    let videoDataSum = 0
    for (let i = 0; i < videoData.length; i += 3) {
      videoDataSum += videoData[i] + videoData[i + 1] + videoData[i + 2];
    }
    const maxValue = Math.max(...videoData);
    //console.log("Max Value:", maxValue);
    videoDataSum *= 1 / (100 * 100*25);
//console.log(videoDataSum);
   
  }
}, []);


  // --- FFT to Calculate BPM ---
// --- Updated FFT to Calculate BPM ---
const calculateFFT = (data: number[]) => {
  const fft = new FFT(arrLen);
  const out = fft.createComplexArray();

  fft.realTransform(out, data);
  //fft.completeSpectrum(out);
//console.log(out)
  let maxInd = 0;
  let maxVal = 0;

  const lowerBound = 40 / 60; // 40 BPM
  const upperBound = 180 / 60; // 180 BPM
  const freqResolution = fps / arrLen;

  maxVal = 0;
    maxInd = 0;

    // Find peaks past the meyer wave and DC noise freqs
    out.forEach((item, index, arr) => {
        arr[index] = Math.abs(item)
        if (index > 8 && arr[index] > maxVal){
            maxInd = index
            maxVal = arr[index]
        }
    })
    //console.log(tmp)

  // Calculate BPM from the dominant frequency
 // var  bpmCandidate 
  //times.push(performance.now() - t0);
  //if (times.length > timesLen) {
   // times.shift();
    //curPollFreq = 30
  
    // Corrected BPM update based on polling frequency
    //const bpmCandidate = maxInd * curPollFreq * 60 / arrLen;
//console.log("BPM:",bpmCandidate);
  //  if (bpmCandidate >= 40 && bpmCandidate <= 180) {
   //   setBPM(bpmCandidate);
    //}
    //sett0(performance.now());
  //}

  // Check if BPM is within valid range before updating
 // if (bpmCandidate >= 40 && bpmCandidate <= 180) {
    //setBPM((prevBPM) => prevBPM + (bpmCandidate - prevBPM) * 0.1);

    // Push BPM to history for averaging
    //setBpmHistory((prevHistory) => {
     // const newHistory = [bpmCandidate, ...prevHistory];
     // if (newHistory.length > maxBPMHistory) {
     //   newHistory.pop();
    //  }
      //return newHistory;
   // });
//  }
};

const averageBrightness = (canvas) => {
  // 1d array of r, g, b, a pixel data values
  const pixelData =canvas;
  let sum = 0;

  // Only use the red and green channels as that combination gives the best readings
  for (let i = 0; i < pixelData.length; i += 3) {
    sum = sum + pixelData[i] + pixelData[i + 1];
  }
console.log("Sum:",sum,canvas.length)
  // Since we only process two channels out of four we scale the data length to half
  const avg = sum / (pixelData.length * 0.5);

  // Scale to 0 ... 1
  return avg / 255;
};

const analyzeData = (samples) => {
  // Get the mean average value of the samples
  const average =
    samples.map((sample) => sample.value).reduce((a, c) => a + c) /
    samples.length;

  // Find the lowest and highest sample values in the data
  // Used for both calculating bpm and fitting the graph in the canvas
  let min = samples[0].value;
  let max = samples[0].value;
  samples.forEach((sample) => {
    if (sample.value > max) {
      max = sample.value;
    }
    if (sample.value < min) {
      min = sample.value;
    }
  });

  // The range of the change in values
  // For a good measurement it should be between  ~ 0.002 - 0.02
  const range = max - min;

  const crossings = getAverageCrossings(samples, average);
  return {
    average,
    min,
    max,
    range,
    crossings,
  };
};

const getAverageCrossings = (samples, average) => {
  // Get each sample at points where the graph has crossed below the average level
  // These are visible as the rising edges that pass the midpoint of the graph
  const crossingsSamples = [];
  let previousSample = samples[0]; // Avoid if statement in loop

  samples.forEach(function (currentSample) {
    // Check if next sample has gone below average.
    if (
      currentSample.value < average &&
      previousSample.value > average
    ) {
      crossingsSamples.push(currentSample);
    }

    previousSample = currentSample;
  });

  return crossingsSamples;
};

const calculateBpm = (samples) => {
  if (samples.length < 2) {
    return;
  }

  const averageInterval =
    (samples[samples.length - 1].time - samples[0].time) /
    (samples.length - 1);
  return 60000 / averageInterval;
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
      const existingData = await AsyncStorage.getItem('heartRateHistory');
      const heartRateHistory = existingData ? JSON.parse(existingData) : [];
      heartRateHistory.push(newEntry);
      await AsyncStorage.setItem('heartRateHistory', JSON.stringify(heartRateHistory));
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
    setElapsedTime(0);
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

<View style={{ marginVertical: 20, alignItems: 'center',borderColor:'black',borderWidth:1 ,borderRadius:10, backgroundColor: 'rgb(167, 166, 166)' }}>
      <Text style={{ fontSize: 18, marginBottom: 10,fontFamily:'HeadingNow' }}>Intensity Graph</Text>
      <Canvas style={{ width, height }}>
        {/* Draw line */}
        <Path path={path} color="#ff4757" style="stroke" strokeWidth={2} />

        {/* Optional: Gradient fill under the line */}
       
      </Canvas>
    </View>


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
        {finalBPM
          ? `✅ Final Weighted BPM:`
          : `❤️ BPM:`}
          <Text style={styles.bppmText}>
          {finalBPM
          ? ` ${finalBPM|| '--'}`
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
}


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
    height: 100,
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
position: 'absolute',
bottom: 0,
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
