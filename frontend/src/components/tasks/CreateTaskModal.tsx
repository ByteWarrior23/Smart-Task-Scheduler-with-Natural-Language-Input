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
import { SparklesIcon } from '@heroicons/react/24/outline';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const [useNLP, setUseNLP] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
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
      setValue('title', parsed.title);
      setValue('description', parsed.description);
      setValue('priority', parsed.priority);
      setValue('category', parsed.category);
      if (parsed.deadline) setValue('deadline', new Date(parsed.deadline).toISOString().slice(0, 16));
      if (parsed.time_required) setValue('time_required', parsed.time_required);
      setValue('natural_language_input', nlpInput);
      setUseNLP(false);
    } catch (error) {
      console.error('Failed to parse natural language:', error);
    }
  };

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTask.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg">
      <div className="space-y-4">
        {/* NLP Toggle */}
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900 rounded-lg">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
              Use Natural Language
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUseNLP(!useNLP)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useNLP ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useNLP ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {useNLP ? (
          <div className="space-y-3">
            <TextArea
              label="Describe your task"
              placeholder="e.g., Meeting with John tomorrow at 3pm for 1 hour high priority work"
              value={nlpInput}
              onChange={(e) => setNlpInput(e.target.value)}
              rows={4}
            />
            <Button onClick={handleParseNLP} loading={parseNLP.isPending} fullWidth>
              Parse & Fill Form
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Title"
              {...register('title')}
              error={errors.title?.message}
              placeholder="Task title"
            />

            <TextArea
              label="Description"
              {...register('description')}
              error={errors.description?.message}
              placeholder="Task description"
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

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={createTask.isPending}>
                Create Task
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
