import React, { useState, useRef } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useCreateTaskFromVoice, useParseVoiceInput } from '@/hooks/useVoice';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const createTaskFromVoice = useCreateTaskFromVoice();
  const parseVoice = useParseVoiceInput();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleParseVoice = async () => {
    if (!audioBlob) return;

    const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    const result = await parseVoice.mutateAsync(file);
    setTranscription(result.transcribedText);
  };

  const handleCreateTask = async () => {
    if (!audioBlob) return;

    const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
    await createTaskFromVoice.mutateAsync(file);
    onTaskCreated?.();
    onClose();
    resetState();
  };

  const resetState = () => {
    setAudioBlob(null);
    setTranscription('');
    setIsRecording(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Voice Input" size="lg">
      <div className="space-y-4">
        <div className="text-center">
          {!audioBlob ? (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900">
                {isRecording ? (
                  <StopIcon className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-pulse" />
                ) : (
                  <MicrophoneIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              
              {isRecording && (
                <Badge variant="danger" size="lg">Recording...</Badge>
              )}

              <p className="text-gray-600 dark:text-gray-400">
                {isRecording
                  ? 'Speak clearly and click stop when done'
                  : 'Click the button to start recording'}
              </p>

              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? 'danger' : 'primary'}
                size="lg"
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Badge variant="success" size="lg">✓ Recording Complete</Badge>
              
              {transcription && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transcription:
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">{transcription}</p>
                </div>
              )}

              <div className="flex justify-center space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleParseVoice}
                  loading={parseVoice.isPending}
                >
                  Preview Task
                </Button>
                <Button
                  onClick={handleCreateTask}
                  loading={createTaskFromVoice.isPending}
                >
                  Create Task
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetState}
                >
                  Record Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
