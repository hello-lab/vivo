import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

/**
 * Crop an image from base64 and convert it to Uint8ClampedArray
 * @param {string} base64Image - The base64 string of the image.
 * @param {number} cropX - X position to start cropping.
 * @param {number} cropY - Y position to start cropping.
 * @param {number} width - Width of the cropped area.
 * @param {number} height - Height of the cropped area.
 * @returns {Promise<Uint8ClampedArray>} - Cropped image as Uint8ClampedArray.
 */

import { Buffer } from 'buffer';

// Ensure Buffer is polyfilled for React Native
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}


const cropAndConvertToUint8ClampedArray = async (
  base64Image: string,
  cropX: number,
  cropY: number,
  width: number,
  height: number
): Promise<Uint8ClampedArray> => {
  try {
    // Crop the image using Expo Image Manipulator
    const result = await manipulateAsync(
      `data:image/jpeg;base64,${base64Image}`,
      [{ crop: { originX: cropX, originY: cropY, width, height } }],
      { compress: 1, format: SaveFormat.JPEG, base64: true }
    );

    if (!result.base64) {
      throw new Error('Failed to crop the image');
    }

    // Convert base64 to Uint8ClampedArray using Buffer
    const base64ToUint8ClampedArray = (base64: string): Uint8ClampedArray => {
      const buffer = Buffer.from(base64, 'base64');
      return new Uint8ClampedArray(buffer);
    };

    return base64ToUint8ClampedArray(result.base64);
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
};

export default cropAndConvertToUint8ClampedArray;
