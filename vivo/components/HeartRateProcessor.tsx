import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { createCanvas, Image } from 'canvas';
import * as DocumentPicker from 'expo-document-picker';
import kissfft from 'kissfft-js';

// --- FFT and Frame Variables ---
let fftr1: any;
let arrLen = 512; // FFT length
let cropSize: number, xOffset: number, yOffset: number;
const normFactorBase = 1 / (100 * 100 * 25); // Normalization factor

let frameSumArr: number[] = [];
let bpmHistory: number[] = [];
const maxBPMHistory = 100;
let times: number[] = [];
let t0 = performance.now();
let curPollFreq = 30;

// --- Select Video and Process ---
const HeartRateProcessor = () => {
  const [bpm, setBpm] = useState<number | null>(null);

  useEffect(() => {
    fftr1 = new kissfft.FFTR(arrLen);
  }, []);

  // --- Select Video and Process ---
  const selectVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (result.canceled) return;

    const videoUri = result.assets[0].uri;
    const tempDir = `${FileSystem.cacheDirectory}frames/`;

    console.log('📹 Video selected:', videoUri);

    // Create temp directory
    await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

    // Extract frames
    const frameUris = await extractFrames(videoUri, tempDir);

    // Process all frames
    if (frameUris.length > 0) {
      await processAllFrames(frameUris);
      const meanBPM = calculateMean(bpmHistory);
      setBpm(meanBPM);

      // Cleanup
      await FileSystem.deleteAsync(tempDir, { idempotent: true });
    }
  };

  // --- Extract Frames from Video ---
  async function extractFrames(videoUri: string, tempDir: string): Promise<string[]> {
    const framePattern = `${tempDir}frame-%04d.png`;
    const ffmpegCommand = `-i ${videoUri} -vf "fps=30" ${framePattern}`;

    console.log('⏳ Extracting frames...');
    const session = await FFmpegKit.execute(ffmpegCommand);
    const returnCode = await session.getReturnCode();

    if (returnCode?.isValueSuccess()) {
      console.log('✅ Frames extracted successfully!');
    } else {
      console.error('❌ Error extracting frames:', await session.getAllLogsAsString());
      return [];
    }

    // Get frame list using FFmpegKit
    const frameList = await FileSystem.readDirectoryAsync(tempDir);
    const frameUris = frameList.map((file) => `${tempDir}${file}`);
    console.log(`📸 Extracted ${frameUris.length} frames!`);
    return frameUris;
  }

  // --- Process All Frames ---
  async function processAllFrames(frameUris: string[]) {
    for (const frameUri of frameUris) {
      await processFrame(frameUri);
    }
    console.log('🎉 Heart rate analysis complete!');
  }

  // --- Process Single Frame ---
  async function processFrame(frameUri: string) {
    const imgData = await FileSystem.readAsStringAsync(frameUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const buffer = Buffer.from(imgData, 'base64');

    const img = new Image();
    img.src = buffer;

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Get cropped pixel data
    const videoData = ctx.getImageData(xOffset, yOffset, cropSize, cropSize).data;

    // Sum RGB values (ignore alpha channel)
    let videoDataSum = 0;
    for (let i = 0; i < videoData.length; i += 4) {
      videoDataSum += videoData[i] + videoData[i + 1] + videoData[i + 2];
    }

    videoDataSum = videoDataSum * normFactorBase;
    frameSumArr.push(videoDataSum);

    // Keep buffer size constant
    if (frameSumArr.length > arrLen) {
      frameSumArr.shift();
      calcFFT();
    }

    // Calculate time interval between frames
    const now = performance.now();
    times.push(now - t0);

    if (times.length > arrLen) {
      times.shift();
      curPollFreq = 1000 / (times.reduce((a, b) => a + b, 0) / arrLen);
    }
    t0 = now;
  }

  // --- Calculate FFT and Detect Heart Rate ---
  async function calcFFT() {
    if (frameSumArr.length < arrLen) return;

    const tmp = fftr1.forward(frameSumArr);
    let maxVal = 0;
    let maxInd = 0;

    const lowerBound = 40 / 60;
    const upperBound = 180 / 60;
    const freqResolution = curPollFreq / arrLen;

    tmp.forEach((item: any, index: number) => {
      const absVal = Math.abs(item);
      const freq = index * freqResolution;

      if (freq >= lowerBound && freq <= upperBound && absVal > maxVal) {
        maxInd = index;
        maxVal = absVal;
      }
    });

    const bpmCandidate = (maxInd * curPollFreq / arrLen) * 60;

    if (bpmCandidate >= 40 && bpmCandidate <= 180) {
      bpmHistory.push(bpmCandidate);
      if (bpmHistory.length > maxBPMHistory) {
        bpmHistory.shift();
      }
    }
  }

  // --- Calculate Mean BPM ---
  function calculateMean(arr: number[]) {
    if (arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="📹 Select Video" onPress={selectVideo} />
      {bpm && (
        <Text style={{ marginTop: 20, fontSize: 20 }}>
          ❤️ Estimated Heart Rate: {Math.round(bpm)} BPM
        </Text>
      )}
    </View>
  );
};

export default HeartRateProcessor;
