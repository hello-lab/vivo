import React, { useState, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { Camera, CameraView, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import FFT from 'fft.js';
import { Buffer } from 'buffer';
import cropAndConvertToUint8ClampedArray from '../../../components/HeartRateAnalyzer';

// Ensure Buffer is polyfilled for React Native
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

const tempDir = `${FileSystem.cacheDirectory}frames/`;
const arrLen = 256; // FFT length
const normFactor = 1 / (100 * 100 * 25);
const maxBPMHistory = 100;

const HeartRateProcessor = () => {
  const [bpm, setBPM] = useState<any | null>('-');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  let frameSumArr: number[] = [];
  let bpmHistory: number[] = [];

  // --- Request CameraView Permissions ---
  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };
  const requestCameraPermission1 = async () => {
    const { status } = await Camera.requestMicrophonePermissionsAsync();
    setHasPermission(status === 'granted');
  };
  React.useEffect(() => {
    requestCameraPermission();
    requestCameraPermission1();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // --- Start Video Recording ---
  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);

        const video = await cameraRef.current.recordAsync();

        setBPM('🎥 Video recorded:', video.uri);
        setIsRecording(false);

        // Process the recorded video
        await processVideo(video.uri);
      } catch (error) {
        console.error('❌ Error recording video:', error);
        Alert.alert('Error', 'Failed to record video.');
        setIsRecording(false);
      }
    }
  };

  // --- Stop Video Recording ---
  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  // --- Process Video and Extract Frames ---
  const processVideo = async (videoUri: string) => {
    try {
      // Create or clear temp directory
      const dirInfo = await FileSystem.getInfoAsync(tempDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
      } else {
        const files = await FileSystem.readDirectoryAsync(tempDir);
        for (const file of files) {
          await FileSystem.deleteAsync(`${tempDir}${file}`);
        }
      }

      // Extract frames using FFmpeg
      const command = `-i ${videoUri} -v quiet -vf "fps=30" ${tempDir}frame-%04d.png`;
       setBPM('🛠️ Running FFmpeg: '+ command);
      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();

      if (returnCode?.isValueSuccess()) {
        setBPM('✅ Frames extracted successfully!');
        await processAllFrames();
      } else {
        Alert.alert('Error', 'Failed to extract frames.');
      }
    } catch (error) {
      console.error('❌ Error processing video:', error);
      Alert.alert('Error', 'Failed to process video.');
    }
  };

  // --- Process All Frames ---
  const processAllFrames = async () => {
    const frameFiles = await FileSystem.readDirectoryAsync(tempDir);
    console.log(`🖼️ Processing ${frameFiles.length} frames...`);

    for (const frameFile of frameFiles) {
      //  console.log(frameFile)
      await processFrame(`${tempDir}${frameFile}`);
    }

    // Calculate and display final BPM
    calculateAndDisplayBPM();
    clearTempFrames();
  };

  // --- Process Single Frame ---
  const processFrame = async (framePath: string) => {
    const imgData = await FileSystem.readAsStringAsync(framePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const videoData = await cropAndConvertToUint8ClampedArray(
      imgData,
      100,
      100,
      100,
      100
    );

    let videoDataSum = videoData.reduce((a, b) => a + b, 0);
    videoDataSum = videoDataSum * normFactor;

    frameSumArr.push(videoDataSum);
    if (frameSumArr.length > arrLen) {
      frameSumArr.shift();
      calculateFFT();
    }
  };

  // --- Calculate FFT and BPM ---
  const calculateFFT = () => {
    if (frameSumArr.length < arrLen) return;

    const fft = new FFT(arrLen);
    const input = frameSumArr.slice(0, arrLen);
    const out = fft.createComplexArray();
    fft.realTransform(out, input);
    fft.completeSpectrum(out);

    let maxInd = 0;
    let maxVal = 0;
    const lowerBound = 40 / 60;
    const upperBound = 180 / 60;
    const freqResolution = 30 / arrLen;

    for (let i = 0; i < out.length / 2; i++) {
      const freq = i * freqResolution;
      const magnitude = Math.sqrt(out[2 * i] ** 2 + out[2 * i + 1] ** 2);

      if (freq >= lowerBound && freq <= upperBound && magnitude > maxVal) {
        maxVal = magnitude;
        maxInd = i;
      }
    }

    const bpmCandidate = (maxInd * 30 / arrLen) * 60;
    if (bpmCandidate >= 40 && bpmCandidate <= 180) {
      bpmHistory.push(bpmCandidate);
      setBPM(String(bpmCandidate));
    }
  };

  // --- Calculate and Display BPM ---
  const calculateAndDisplayBPM = () => {
    const meanBPM = calculateWeightedAverageBPM();
    console.log(`📊 Mean BPM: ${Math.round(meanBPM)} BPM`);
    setBPM(Math.round(meanBPM));
  };

  // --- Calculate Weighted Average BPM ---
  const calculateWeightedAverageBPM = () => {
    if (bpmHistory.length === 0) return 0;

    const weights = bpmHistory.map((_, index) => index + 1);
    const weightedSum = bpmHistory.reduce((sum, bpm, index) => sum + bpm * weights[index], 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    return weightedSum / totalWeight;
  };

  // --- Clear Temporary Frames ---
  const clearTempFrames = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(tempDir);
      for (const file of files) {
        await FileSystem.deleteAsync(`${tempDir}${file}`);
      }
      console.log('🗑️ Temp frames deleted successfully!');
    } catch (error) {
      console.warn('⚠️ Error clearing temp frames:', error);
    }
  };

  // --- Toggle Torch ---
  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  return (
    <View style={styles.container}>
      {hasPermission === true && (
        <CameraView enableTorch={torchOn} mode="video" ref={cameraRef} style={styles.camera} facing='back' />
      )}
      <View style={styles.controls}>
        <View style={styles.buttonContainer}>
          <Button
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
            onPress={isRecording ? stopRecording : startRecording}
            color={isRecording ? 'red' : 'green'}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={torchOn ? 'Turn Torch Off' : 'Turn Torch On'}
            onPress={toggleTorch}
            color={torchOn ? 'orange' : 'lightblue'}
          />
        </View>
        <Text style={styles.bpmText}>❤️ BPM: {bpm}</Text>
      </View>
    </View>
  );
};

export default HeartRateProcessor;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  controls: {
    backgroundColor: 'rgba(60, 105, 136, 0.5)',
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  bpmText: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
});
