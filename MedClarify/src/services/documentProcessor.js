import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { processImageForAPI, isImageFile, isPDFFile } from '../utils/imageUtils';
import { translateDocument, translateDocumentFromImage } from './claudeAPI';

/**
 * Picks a document from the file system (PDF or images)
 * @returns {Promise<object>} Document picker result
 */
export const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { canceled: true };
    }

    return {
      canceled: false,
      uri: result.assets[0].uri,
      name: result.assets[0].name,
      mimeType: result.assets[0].mimeType,
      size: result.assets[0].size,
    };
  } catch (error) {
    console.error('Error picking document:', error);
    throw error;
  }
};

/**
 * Picks an image from the gallery
 * @returns {Promise<object>} Image picker result
 */
export const pickImageFromGallery = async () => {
  try {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      throw new Error('Permission to access gallery was denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (result.canceled) {
      return { canceled: true };
    }

    return {
      canceled: false,
      uri: result.assets[0].uri,
      width: result.assets[0].width,
      height: result.assets[0].height,
    };
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    throw error;
  }
};

/**
 * Extracts text from a PDF file
 * Note: In a production app, you would use a PDF parsing library
 * For this hackathon version, we'll send the PDF to Claude API directly if possible
 * or ask user to use camera for complex PDFs
 * @param {string} uri - PDF file URI
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromPDF = async (uri) => {
  try {
    // For this hackathon implementation, we'll read the PDF as text if possible
    // In production, use a library like react-native-pdf or pdfjs-dist
    // For now, we'll return an error message asking user to use camera
    throw new Error('PDF text extraction not implemented. Please use camera to scan individual pages or upload as images.');
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

/**
 * Processes a document (image or PDF) and returns translation
 * @param {string} uri - Document URI
 * @param {string} type - Document type ('image' or 'pdf')
 * @param {object} cropData - Optional crop data for images
 * @returns {Promise<object>} Translation result
 */
export const processDocument = async (uri, type = 'image', cropData = null) => {
  try {
    if (type === 'pdf') {
      // For hackathon: suggest using camera instead
      return {
        success: false,
        error: 'PDF processing is not available. Please use the camera to scan individual pages of your document.',
      };
    }

    if (type === 'image') {
      // Process image for API
      const { base64 } = await processImageForAPI(uri, cropData);

      // Send to Claude API for translation
      const result = await translateDocumentFromImage(base64, 'image/jpeg');

      return result;
    }

    throw new Error('Unsupported document type');
  } catch (error) {
    console.error('Error processing document:', error);
    return {
      success: false,
      error: error.message || 'Failed to process document',
    };
  }
};

/**
 * Validates if a document is suitable for processing
 * @param {object} documentInfo - Document information
 * @returns {object} Validation result
 */
export const validateDocument = (documentInfo) => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (!documentInfo.uri) {
    return {
      valid: false,
      error: 'No document selected',
    };
  }

  if (documentInfo.size && documentInfo.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'Document is too large. Please select a file smaller than 10MB.',
    };
  }

  if (documentInfo.mimeType) {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(documentInfo.mimeType)) {
      return {
        valid: false,
        error: 'Unsupported file type. Please select a PDF or image file (JPEG, PNG).',
      };
    }
  }

  return {
    valid: true,
  };
};

/**
 * Deletes a temporary document file
 * @param {string} uri - Document URI to delete
 */
export const deleteDocument = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    // Non-critical error, don't throw
  }
};
