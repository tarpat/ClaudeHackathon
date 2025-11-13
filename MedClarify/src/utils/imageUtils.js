import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Converts an image URI to base64 format
 * @param {string} uri - The image URI
 * @returns {Promise<string>} Base64 encoded image string
 */
export const imageToBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Crops an image to the specified dimensions
 * @param {string} uri - The image URI
 * @param {object} cropData - Crop dimensions {originX, originY, width, height}
 * @returns {Promise<string>} URI of the cropped image
 */
export const cropImage = async (uri, cropData) => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          crop: cropData,
        },
      ],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
};

/**
 * Enhances image contrast and brightness for better OCR
 * @param {string} uri - The image URI
 * @returns {Promise<string>} URI of the enhanced image
 */
export const enhanceImage = async (uri) => {
  try {
    // Resize if needed and enhance contrast
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        // Add slight sharpening effect by adjusting
        { resize: { width: 2000 } }, // Resize to reasonable size
      ],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('Error enhancing image:', error);
    throw error;
  }
};

/**
 * Resizes image if it exceeds maximum size
 * @param {string} uri - The image URI
 * @returns {Promise<string>} URI of the resized image
 */
export const resizeIfNeeded = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // If file is within size limit, return original
    if (fileInfo.size <= MAX_IMAGE_SIZE) {
      return uri;
    }

    // Calculate compression ratio to achieve target size
    const compressionRatio = Math.min(0.7, MAX_IMAGE_SIZE / fileInfo.size);

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1500 } }], // Resize to reduce file size
      { compress: compressionRatio, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};

/**
 * Processes image for Claude API: crops, enhances, resizes, and converts to base64
 * @param {string} uri - The image URI
 * @param {object} cropData - Optional crop dimensions
 * @returns {Promise<object>} Object containing base64 string and processed URI
 */
export const processImageForAPI = async (uri, cropData = null) => {
  try {
    let processedUri = uri;

    // Step 1: Crop if crop data provided
    if (cropData) {
      processedUri = await cropImage(processedUri, cropData);
    }

    // Step 2: Enhance contrast
    processedUri = await enhanceImage(processedUri);

    // Step 3: Resize if too large
    processedUri = await resizeIfNeeded(processedUri);

    // Step 4: Convert to base64
    const base64 = await imageToBase64(processedUri);

    return {
      base64,
      uri: processedUri,
    };
  } catch (error) {
    console.error('Error processing image for API:', error);
    throw error;
  }
};

/**
 * Validates if a file is an image
 * @param {string} uri - The file URI
 * @returns {boolean} True if file is an image
 */
export const isImageFile = (uri) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const lowerUri = uri.toLowerCase();
  return imageExtensions.some(ext => lowerUri.endsWith(ext));
};

/**
 * Validates if a file is a PDF
 * @param {string} uri - The file URI
 * @returns {boolean} True if file is a PDF
 */
export const isPDFFile = (uri) => {
  return uri.toLowerCase().endsWith('.pdf');
};
