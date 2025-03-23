// src/utils/fileHelpers.ts
import * as FileSystem from 'expo-file-system';

// --- Save Video to Local Storage ---
export async function saveVideoToLocal(uri: string): Promise<string> {
  const fileName = uri.split('/').pop();
  const localUri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.copyAsync({
    from: uri,
    to: localUri,
  });
  console.log(`✅ Video saved locally at: ${localUri}`);
  return localUri;
}

// --- Create Temp Directory ---
export async function createTempDir(): Promise<string> {
  const tempDir = `${FileSystem.cacheDirectory}frames/`;
  await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
  console.log(`📂 Temp directory created: ${tempDir}`);
  return tempDir;
}

// --- Clear Temp Directory ---
export async function clearTempDir(tempDir: string) {
  const files = await FileSystem.readDirectoryAsync(tempDir);
  for (const file of files) {
    await FileSystem.deleteAsync(`${tempDir}${file}`);
  }
  console.log('🗑️ Temp directory cleared!');
}
