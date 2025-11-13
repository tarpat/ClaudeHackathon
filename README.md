# MedClarify

A React Native (Expo) mobile app that helps patients understand medical documents by scanning them with their camera or uploading files, then translating medical jargon into plain language using Claude AI.

## Features

- 📷 **Camera Scanning**: Real-time document capture with document detection overlay
- 📁 **File Upload**: Support for photos from gallery
- 🔍 **Text Extraction**: Extract text from scanned or uploaded documents
- 🤖 **AI Translation**: Translate medical jargon into plain language using Claude API
- 💬 **Q&A Chat**: Ask clarification questions about your medical documents
- 🛡️ **Safety Guardrails**: Built-in safeguards to prevent misuse and clearly indicate this is not medical advice
- 📊 **Confidence Indicators**: Visual indicators showing translation confidence levels
- ⚠️ **Disclaimers**: Persistent warnings that this is educational, not medical advice

## Tech Stack

- **Framework**: Expo SDK 54
- **UI Library**: React Native Paper
- **Navigation**: React Navigation (Stack Navigator)
- **Camera**: expo-camera
- **File Handling**: expo-document-picker, expo-image-picker
- **Image Processing**: expo-image-manipulator
- **AI**: Claude API (claude-sonnet-4-20250514)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Claude API key from [Anthropic](https://console.anthropic.com/)
- iOS Simulator (for Mac) or Android Emulator, or physical device with Expo Go app

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd MedClarify
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Claude API key:
     ```
     EXPO_PUBLIC_CLAUDE_API_KEY=your_actual_api_key_here
     ```

## Running the App

### Development Mode

Start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools in your browser. From here, you can:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device

### Platform-Specific Commands

**iOS**:
```bash
npm run ios
```

**Android**:
```bash
npm run android
```

**Web** (limited functionality):
```bash
npm run web
```

## Project Structure

```
MedClarify/
├── App.js                      # Main app entry point with theme and navigation setup
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js       # Main menu - scan or upload options
│   │   ├── CameraScanScreen.js # Camera scanning and upload interface
│   │   ├── TranslationScreen.js # Display simplified medical document
│   │   └── QAScreen.js         # Q&A chat for clarification questions
│   ├── components/
│   │   ├── CameraScanner.js    # Camera component with document detection
│   │   ├── DocumentUploader.js # File picker component
│   │   ├── TranslationCard.js  # Card showing original and simplified text
│   │   ├── ConfidenceIndicator.js # Visual confidence score indicator
│   │   ├── DisclaimerBanner.js # Warning banner component
│   │   └── ScanOverlay.js      # Document frame overlay for camera
│   ├── services/
│   │   ├── claudeAPI.js        # All Claude API integration
│   │   └── documentProcessor.js # Document handling and image processing
│   ├── utils/
│   │   ├── prompts.js          # System prompts for Claude API
│   │   └── imageUtils.js       # Image processing utilities
│   └── navigation/
│       └── AppNavigator.js     # React Navigation stack setup
├── package.json
└── .env.example                # Environment variables template
```

## How It Works

1. **Scan or Upload**: User scans a medical document with camera or uploads from gallery
2. **Image Processing**: Image is cropped, enhanced, and optimized for OCR
3. **Text Extraction**: Claude API extracts text from the image
4. **Translation**: Medical jargon is translated to plain language with confidence scores
5. **Q&A**: User can ask clarification questions about the document content
6. **Guardrails**: System blocks requests for additional medical advice

## API Integration

### Claude API Configuration

The app uses the Claude API for:
- Extracting text from medical document images
- Translating medical terminology to plain language
- Answering clarification questions about document content

**Model**: `claude-sonnet-4-20250514`

**API Endpoint**: `https://api.anthropic.com/v1/messages`

### Response Format

Translation responses are returned as JSON with:
- Document type identification
- Simplified sections with confidence scores
- Key medical terms with definitions
- Action items
- Uncertainties requiring doctor clarification

## Safety Features

### Human-in-the-Loop Design

- AI assists understanding, humans make all health decisions
- Clear handoff points: "Consult your doctor about..."
- Never replaces healthcare provider judgment
- Confidence scores help users know when to seek clarification

### Guardrails

The Q&A system includes strict guardrails:
- Only answers questions using document content
- Blocks requests for medical advice
- Redirects treatment questions to healthcare providers
- Won't interpret results beyond what's explicitly stated

### Disclaimers

- Prominent disclaimers on every screen
- Clear messaging: "This is not medical advice"
- Persistent banner at bottom of Q&A screen
- Warning notices on translation results

## Testing

### Testing with Sample Documents

For hackathon demo purposes, you can test with:
1. Lab result screenshots
2. Prescription images
3. Medical report PDFs (note: PDF text extraction is limited in this version)
4. Discharge summary photos

### Camera Permissions

On first use, the app will request:
- Camera access (for scanning documents)
- Photo library access (for uploading images)

Grant these permissions when prompted.

## Troubleshooting

### API Key Issues

**Error**: "Claude API key not configured"
- Solution: Make sure `.env` file exists with `EXPO_PUBLIC_CLAUDE_API_KEY` set

### Camera Not Working

- Ensure permissions are granted
- Try restarting the app
- Check device camera is functioning

### Translation Fails

- Check internet connection
- Verify API key is valid
- Ensure image is clear and readable
- Try better lighting when scanning

### Build Errors

If you encounter build errors:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

## Limitations

- PDF text extraction is limited (use camera to scan individual pages)
- Requires internet connection for Claude API
- Image quality affects OCR accuracy
- API usage subject to Anthropic rate limits

## Privacy & Data

- Documents are processed via Claude API
- No documents are permanently stored
- Images are temporary and can be deleted after session
- See Anthropic's privacy policy for API data handling

## Future Enhancements

- Offline OCR support
- Better PDF parsing
- Document history storage (optional)
- Multi-language support
- Voice input for questions
- Integration with health record systems

## License

This is a hackathon project. For production use, ensure compliance with healthcare regulations (HIPAA, GDPR, etc.) and obtain proper medical advisory review.

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Claude API documentation: https://docs.anthropic.com/
3. Check Expo documentation: https://docs.expo.dev/

## Disclaimer

**IMPORTANT**: MedClarify is an educational tool designed to help patients understand medical documents. It does NOT provide medical advice, diagnosis, or treatment recommendations. Always consult with qualified healthcare providers for medical decisions, treatment plans, and health concerns.

This app uses AI which may make mistakes. Always verify important information with your healthcare provider.
