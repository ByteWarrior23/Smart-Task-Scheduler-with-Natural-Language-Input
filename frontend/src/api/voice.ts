import apiClient from './client';
import type {
  ApiResponse,
  TranscriptionResponse,
  VoiceTaskResponse,
  VoiceTaskCreatedResponse,
} from '@/types/api';

export const voiceApi = {
  // Transcribe audio to text
  transcribeAudio: async (audioFile: File): Promise<TranscriptionResponse> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await apiClient.post<ApiResponse<TranscriptionResponse>>(
      '/voice/transcribe',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Parse voice input to task data
  parseVoiceInput: async (audioFile: File): Promise<VoiceTaskResponse> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await apiClient.post<ApiResponse<VoiceTaskResponse>>(
      '/voice/parse',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Create task directly from voice
  createTaskFromVoice: async (audioFile: File): Promise<VoiceTaskCreatedResponse> => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await apiClient.post<ApiResponse<VoiceTaskCreatedResponse>>(
      '/voice/create-task',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
};
