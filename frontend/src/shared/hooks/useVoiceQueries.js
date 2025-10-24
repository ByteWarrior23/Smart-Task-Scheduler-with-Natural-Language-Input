import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { voiceApi } from '../api/api';

// Voice Queries
export const useVoiceQueries = () => {
  const queryClient = useQueryClient();

  // Transcribe audio mutation
  const useTranscribeAudio = () => {
    return useMutation({
      mutationFn: ({ audioFile, options }) => voiceApi.transcribe(audioFile, options),
    });
  };

  // Parse voice input mutation
  const useParseVoice = () => {
    return useMutation({
      mutationFn: ({ audioFile, options }) => voiceApi.parse(audioFile, options),
    });
  };

  // Create task from voice mutation
  const useCreateTaskFromVoice = () => {
    return useMutation({
      mutationFn: ({ audioFile, options }) => voiceApi.createTask(audioFile, options),
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  return {
    useTranscribeAudio,
    useParseVoice,
    useCreateTaskFromVoice,
  };
};
