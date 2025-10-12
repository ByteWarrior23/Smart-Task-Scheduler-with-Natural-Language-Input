import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { Select } from '@/components/common/Select';
import { createTaskSchema, type CreateTaskFormData } from '@/utils/validation';
import { useCreateTask, useParseNaturalLanguage } from '@/hooks/useTasks';
import { Badge } from '@/components/common/Badge';
import { ConflictDetectionPanel } from './ConflictDetectionPanel';
import { SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  { value: 'low', label: '🟢 Low' },
  { value: 'medium', label: '🔵 Medium' },
  { value: 'high', label: '🟠 High' },
  { value: 'urgent', label: '🔴 Urgent' },
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const [useNLP, setUseNLP] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [showConflicts, setShowConflicts] = useState(false);
  const createTask = useCreateTask();
  const parseNLP = useParseNaturalLanguage();

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const handleParseNLP = async () => {
    if (!nlpInput.trim()) return;
    
    try {
      const parsed = await parseNLP.mutateAsync({ text: nlpInput });
      setParsedData(parsed);
      setValue('title', parsed.title);
      setValue('description', parsed.description);
      setValue('priority', parsed.priority);
      setValue('category', parsed.category);
      if (parsed.deadline) setValue('deadline', new Date(parsed.deadline).toISOString().slice(0, 16));
      if (parsed.time_required) setValue('time_required', parsed.time_required);
      setValue('natural_language_input', nlpInput);
      
      // Show suggestions if available
      if (parsed.suggestions && parsed.suggestions.length > 0) {
        setShowConflicts(true);
      }
      
      setUseNLP(false);
    } catch (error) {
      console.error('Failed to parse natural language:', error);
    }
  };

  const handleSelectSuggestion = (slot: any) => {
    setValue('deadline', new Date(slot.start).toISOString().slice(0, 16));
    setValue('time_required', slot.duration);
    setShowConflicts(false);
  };

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTask.mutateAsync(data);
      reset();
      setParsedData(null);
      setShowConflicts(false);
      setNlpInput('');
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✨ Create New Task" size="lg">
      <div className="space-y-4">
        {/* NLP Toggle */}
        <div className="relative overflow-hidden flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-primary-200 dark:border-primary-800">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl"></div>
          <div className="relative flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-lg shadow-primary-500/50">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-primary-900 dark:text-primary-100 block">
                Use Natural Language
              </span>
              <span className="text-xs text-primary-700 dark:text-primary-300">
                AI-powered task parsing
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUseNLP(!useNLP)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${
              useNLP ? 'bg-gradient-to-r from-primary-600 to-purple-600 shadow-lg shadow-primary-500/50' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
              useNLP ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {useNLP ? (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <LightBulbIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    💡 Examples of natural language:
                  </p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• "Meeting with John tomorrow at 3pm for 1 hour urgent work"</li>
                    <li>• "Buy groceries next Monday morning personal"</li>
                    <li>• "Submit project deadline Friday 5pm high priority"</li>
                    <li>• "Daily standup every weekday at 9am for 15 minutes"</li>
                  </ul>
                </div>
              </div>
            </div>
            <TextArea
              label="Describe your task in plain English"
              placeholder="e.g., Team standup tomorrow at 9am for 15 minutes high priority work"
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
              rows={4}
            />
            <Button onClick={handleParseNLP} loading={parseNLP.isPending} fullWidth size="lg" leftIcon={<SparklesIcon className="h-5 w-5" />}>
              {parseNLP.isPending ? 'Parsing...' : 'Parse & Fill Form'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {parsedData && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4 animate-slide-down">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    ✓ Task parsed successfully! Confidence: {Math.round((parsedData.confidence || 0.8) * 100)}%
                  </p>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Review the auto-filled fields below and make any adjustments.
                </p>
              </div>
            )}

            {showConflicts && parsedData?.suggestions && (
              <ConflictDetectionPanel
                suggestions={parsedData.suggestions}
                onSelectSuggestion={handleSelectSuggestion}
              />
            )}

            <Input
              label="Title *"
              {...register('title')}
              error={errors.title?.message}
              placeholder="What needs to be done?"
            />

            <TextArea
              label="Description *"
              {...register('description')}
              error={errors.description?.message}
              placeholder="Add more details about this task..."
              rows={4}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                {...register('priority')}
                options={priorityOptions}
                error={errors.priority?.message}
              />

              <Input
                label="Category"
                {...register('category')}
                error={errors.category?.message}
                placeholder="e.g., work, personal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deadline"
                type="datetime-local"
                {...register('deadline')}
                error={errors.deadline?.message}
              />

              <Input
                label="Duration (minutes)"
                type="number"
                {...register('time_required', { valueAsNumber: true })}
                error={errors.time_required?.message}
                placeholder="60"
              />
            </div>

            {parsedData && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-3">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  💡 <strong>Original input:</strong> "{nlpInput}"
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={createTask.isPending} size="lg">
                {createTask.isPending ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
