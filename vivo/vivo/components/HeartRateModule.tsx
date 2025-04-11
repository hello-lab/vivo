import { createCanvas, Image } from 'canvas';
import FFT from 'fft.js';

// --- FFT and Frame Variables ---
const arrLen = 512;
const normFactorBase = 1 / (100 * 100 * 25);
let frameSumArr: number[] = [];
let bpmHistory: number[] = [];
const maxBPMHistory = 100;
const curPollFreq = 30;

const fft = new FFT(arrLen);
const fftInput = new Array(arrLen).fill(0);
const fftOutput = fft.createComplexArray();

// --- Process Captured Frame ---
async function processFrame(frameUri: string, cropSize: number, xOffset: number, yOffset: number) {
  const img = new Image();
  img.src = frameUri;

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Get cropped pixel data
  const videoData = ctx.getImageData(xOffset, yOffset, cropSize, cropSize).data;

  // Sum RGB values
  let videoDataSum = 0;
  for (let i = 0; i < videoData.length; i += 4) {
    videoDataSum += videoData[i] + videoData[i + 1] + videoData[i + 2];
  }
  videoDataSum = videoDataSum * normFactorBase;

  frameSumArr.push(videoDataSum);

  if (frameSumArr.length > arrLen) {
    frameSumArr.shift();
    calcFFT();
  }
}

// --- Calculate FFT and Detect Heart Rate ---
function calcFFT() {
  if (frameSumArr.length < arrLen) return;

  for (let i = 0; i < arrLen; i++) {
    fftInput[i] = frameSumArr[i];
  }

  fft.realTransform(fftOutput, fftInput);
  fft.completeSpectrum(fftOutput);

  let maxVal = 0;
  let maxInd = 0;

  const lowerBound = 40 / 60; // 40 BPM
  const upperBound = 180 / 60; // 180 BPM
  const freqResolution = curPollFreq / arrLen;

  for (let i = 1; i < arrLen / 2; i++) {
    const real = fftOutput[2 * i];
    const imag = fftOutput[2 * i + 1];
    const magnitude = Math.sqrt(real * real + imag * imag);
    const freq = i * freqResolution;

    if (freq >= lowerBound && freq <= upperBound && magnitude > maxVal) {
      maxInd = i;
      maxVal = magnitude;
    }
  }

  const bpmCandidate = (maxInd * curPollFreq) / arrLen * 60;

  if (bpmCandidate >= 40 && bpmCandidate <= 180) {
    bpmHistory.push(bpmCandidate);
    if (bpmHistory.length > maxBPMHistory) {
      bpmHistory.shift();
    }
  }
}

// --- Calculate Mean ---
function calculateMean(arr: number[]) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

// --- Analyze Heart Rate from Snapshot ---
export async function analyzeHeartRate(frameUri: string): Promise<number> {
  // Crop size and position
  const cropSize = 100;
  const xOffset = 50;
  const yOffset = 50;

  await processFrame(frameUri, cropSize, xOffset, yOffset);

  const meanBPM = calculateMean(bpmHistory);
  console.log(`✅ Mean BPM: ${Math.round(meanBPM)} BPM`);
  return meanBPM;
}
