import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { Select } from '@/components/common/Select';
import { createRecurringTaskSchema, type CreateRecurringTaskFormData } from '@/utils/validation';
import { useCreateRecurringTask } from '@/hooks/useTasks';

interface RecurringTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const frequencyOptions = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export const RecurringTaskModal: React.FC<RecurringTaskModalProps> = ({ isOpen, onClose }) => {
  const createRecurringTask = useCreateRecurringTask();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateRecurringTaskFormData>({
    resolver: zodResolver(createRecurringTaskSchema),
    defaultValues: {
      priority: 'medium',
      time_required: 60,
    },
  });

  const frequency = watch('rrule_string') || 'DAILY';

  const onSubmit = async (data: CreateRecurringTaskFormData) => {
    try {
      // Build RRule string from frequency
      const rruleString = `FREQ=${frequency.toUpperCase()}`;
      await createRecurringTask.mutateAsync({ ...data, rrule_string: rruleString });
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create recurring task:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Recurring Task" size="lg">
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
            label="Start Date"
            type="datetime-local"
            {...register('deadline')}
            error={errors.deadline?.message}
          />

          <Input
            label="End Date (Optional)"
            type="datetime-local"
            {...register('end_date')}
            error={errors.end_date?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Frequency"
            {...register('rrule_string')}
            options={frequencyOptions}
            error={errors.rrule_string?.message}
          />

          <Input
            label="Duration (minutes)"
            type="number"
            {...register('time_required', { valueAsNumber: true })}
            error={errors.time_required?.message}
            placeholder="60"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 This task will repeat <strong>{frequency.toLowerCase()}</strong> starting from the start date.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createRecurringTask.isPending}>
            Create Recurring Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
