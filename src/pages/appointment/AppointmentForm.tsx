import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User, Clock, ClipboardList, DoorOpen, UserPlus } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { AppointmentDTO, AppointmentStatus } from '../../types';

interface AppointmentFormProps {
  appointment?: AppointmentDTO;
  onSubmit: (data: AppointmentDTO) => void;
  onCancel: () => void;
  doctorOptions: { value: number; label: string }[];
  patientOptions: { value: number; label: string }[];
  consultRoomOptions: { value: number; label: string }[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSubmit,
  onCancel,
  doctorOptions,
  patientOptions,
  consultRoomOptions,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<AppointmentDTO>({
    defaultValues: {
      patientId: appointment?.patientId || undefined,
      doctorId: appointment?.doctorId || undefined,
      consultRoomId: appointment?.consultRoomId || undefined,
      startTime: appointment?.startTime || '',
      endTime: appointment?.endTime || '',
      status: appointment?.status || 'SCHEDULED',
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const handleFormSubmit = async (data: AppointmentDTO) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];

  // Validate time range
  const isValidTimeRange = () => {
    if (!startTime || !endTime) return true;
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    return start < end;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Controller
        name="patientId"
        control={control}
        rules={{ required: 'Patient is required' }}
        render={({ field }) => (
          <Select
            {...field}
            label="Patient"
            options={patientOptions}
            error={errors.patientId?.message}
          />
        )}
      />

      <Controller
        name="doctorId"
        control={control}
        rules={{ required: 'Doctor is required' }}
        render={({ field }) => (
          <Select
            {...field}
            label="Doctor"
            options={doctorOptions}
            error={errors.doctorId?.message}
          />
        )}
      />

      <Controller
        name="consultRoomId"
        control={control}
        rules={{ required: 'Consult room is required' }}
        render={({ field }) => (
          <Select
            {...field}
            label="Consult Room"
            options={consultRoomOptions}
            error={errors.consultRoomId?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="startTime"
          control={control}
          rules={{ required: 'Start time is required' }}
          render={({ field }) => (
            <Input
              {...field}
              label="Start Time"
              type="datetime-local"
              error={errors.startTime?.message}
              leftIcon={<Clock className="h-5 w-5 text-gray-400" />}
            />
          )}
        />

        <Controller
          name="endTime"
          control={control}
          rules={{ 
            required: 'End time is required',
            validate: () => isValidTimeRange() || 'End time must be after start time'
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="End Time"
              type="datetime-local"
              error={errors.endTime?.message}
              leftIcon={<Clock className="h-5 w-5 text-gray-400" />}
            />
          )}
        />
      </div>

      <Controller
        name="status"
        control={control}
        rules={{ required: 'Status is required' }}
        render={({ field }) => (
          <Select
            {...field}
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
          />
        )}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {appointment ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;