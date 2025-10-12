import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voiceApi } from '@/api/voice';
import { taskKeys } from './useTasks';
import toast from 'react-hot-toast';

export const useTranscribeAudio = () => {
  return useMutation({
    mutationFn: (audioFile: File) => voiceApi.transcribeAudio(audioFile),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to transcribe audio');
    },
  });
};

export const useParseVoiceInput = () => {
  return useMutation({
    mutationFn: (audioFile: File) => voiceApi.parseVoiceInput(audioFile),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to parse voice input');
    },
  });
};

export const useCreateTaskFromVoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (audioFile: File) => voiceApi.createTaskFromVoice(audioFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success('Task created from voice input!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task from voice');
    },
  });
};
