# Voice Command Feature Implementation

## Completed Tasks
- [x] Install required packages: microsoft-cognitiveservices-speech-sdk, multer
- [x] Create src/services/speech.services.js with mock transcription
- [x] Add createTaskFromVoice controller function
- [x] Add voice route POST /api/v1/tasks/voice with file upload
- [x] Create uploads directory for temporary audio files
- [x] Integrate with existing NLP parsing for task creation

## Notes
- Currently uses mock transcription returning sample text
- To enable real speech-to-text:
  1. Set environment variables: SPEECH_KEY and SPEECH_REGION
  2. Uncomment the real implementation in speech.services.js
  3. Ensure audio is in WAV format or adjust accordingly

## Frontend Integration
- Add voice icon/button to trigger audio recording
- Record audio as WAV/MP3
- Send as multipart/form-data with key 'audio' to /api/v1/tasks/voice
- Handle response similar to regular task creation
