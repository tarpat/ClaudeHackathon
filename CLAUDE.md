# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MedClarify** is a React Native (Expo) mobile application that helps patients understand medical documents by translating medical jargon into plain language using Claude AI. The app supports camera scanning and file uploads, with built-in safety guardrails to ensure it's used as an educational tool, not for medical advice.

## Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web

# Clear cache and restart
npx expo start -c
```

## Environment Setup

Required environment variable in `.env`:
```
EXPO_PUBLIC_CLAUDE_API_KEY=your_api_key_here
```

Copy `.env.example` to `.env` and add your Claude API key from https://console.anthropic.com/

## High-Level Architecture

### Navigation Flow

```
HomeScreen (landing)
    ├─> CameraScanScreen (mode: camera) → TranslationScreen → QAScreen
    └─> CameraScanScreen (mode: upload) → TranslationScreen → QAScreen
```

### Data Flow

1. **Document Capture**: Camera or file picker captures document image
2. **Image Processing**: Image is cropped, enhanced, resized, and converted to base64
3. **Claude API Call**: Image sent to Claude API with translation system prompt
4. **Response Parsing**: JSON response parsed into sections with confidence scores
5. **Display**: Translated content shown with disclaimers and confidence indicators
6. **Q&A**: User can ask questions; Claude API responds based only on document context

### Key Services

#### claudeAPI.js
- Handles all Claude API interactions
- Two main functions:
  - `translateDocumentFromImage()`: Sends image to Claude for text extraction and translation
  - `askQuestion()`: Handles Q&A with document context and conversation history
- Uses system prompts from `utils/prompts.js`
- Returns structured JSON with document type, sections, action items, and uncertainties

#### documentProcessor.js
- Manages document selection and processing
- Integrates with expo-document-picker and expo-image-picker
- Validates document size and type
- Calls `processImageForAPI()` from imageUtils.js

### Component Relationships

- **DisclaimerBanner**: Used on all screens to show persistent warnings
- **ConfidenceIndicator**: Used in TranslationCard to show trust scores
- **TranslationCard**: Renders each section with original text, simplified text, and key terms
- **CameraScanner**: Reusable camera component with ScanOverlay
- **ScanOverlay**: Document detection frame with breathing animation

### Human-in-the-Loop Design

The app implements strict guardrails to ensure AI augments but never replaces medical judgment:

1. **Translation Guardrails** (in prompts.js):
   - Only translates what's in the document
   - Doesn't add medical advice
   - Flags unclear sections explicitly
   - Provides confidence scores

2. **Q&A Guardrails** (in prompts.js):
   - Only answers based on document content
   - Blocks "what should I do?" questions
   - Redirects medical advice requests to healthcare providers
   - Won't interpret beyond what's written

3. **UI Guardrails**:
   - Persistent disclaimers on every screen
   - Color-coded confidence indicators (green/amber/red)
   - "Ask your doctor" messaging throughout
   - Clear handoff points to healthcare providers

## Important Non-Obvious Details

### API Response Format

Claude API must return JSON in this exact structure:
```javascript
{
  documentType: string,
  simplifiedSections: [{
    title: string,
    original: string,
    simplified: string,
    confidence: number (0-100),
    urgency: "normal" | "important" | "urgent",
    keyTerms: [{ term: string, definition: string }]
  }],
  actionItems: string[],
  overallSummary: string,
  uncertainties: string[]
}
```

### Image Processing Pipeline

Images go through this exact sequence in `imageUtils.js`:
1. Crop (if crop data provided)
2. Enhance (resize to max 2000px width)
3. Resize (if file > 5MB, compress with ratio)
4. Convert to base64

This ensures images are optimized for Claude's Vision API while maintaining quality.

### Navigation State Management

Translation and Q&A screens receive data via route params:
- `TranslationScreen`: Gets `translationData` and `originalImage`
- `QAScreen`: Gets `translationData` to provide context for questions

This keeps document context available across screens without global state management.

### PDF Limitation

PDF text extraction is intentionally limited in this version. When users try to upload PDFs, the app shows an error asking them to use camera to scan individual pages. This is because proper PDF parsing would require additional libraries (react-native-pdf, pdfjs-dist) which adds complexity for a hackathon.

## Code Conventions

- All screens are in `src/screens/`
- All reusable components in `src/components/`
- All API/business logic in `src/services/`
- All utilities in `src/utils/`
- Use React Native Paper components for consistency
- Color scheme defined in App.js theme:
  - Primary: #2196F3 (medical blue)
  - Success/High confidence: #4CAF50 (green)
  - Warning/Medium confidence: #FFC107 (amber)
  - Error/Low confidence: #F44336 (red)

## Testing the App

For demo purposes, test with:
- Lab result screenshots
- Prescription images
- Medical report photos
- Any document with medical terminology

The app works best with:
- Clear, well-lit images
- Text-heavy documents (not charts/graphs)
- English language documents

## Security & Privacy Considerations

- API key stored in environment variable (not committed to git)
- Documents processed via Claude API (see Anthropic privacy policy)
- No permanent document storage
- Temporary files can be deleted via documentProcessor.deleteDocument()
- For production: Add HIPAA compliance, encryption, and proper consent flows

## Git Information

- Main branch: `main`
- Project location: `MedClarify/` subdirectory
- See `MedClarify/README.md` for detailed setup instructions
