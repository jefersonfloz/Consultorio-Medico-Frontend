import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User, Mail, Clock, Fingerprint, Stethoscope } from 'lucide-react';

import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { DoctorDTO } from '../../types';

interface DoctorFormProps {
  doctor?: DoctorDTO;
  onSubmit: (data: DoctorDTO) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<DoctorDTO>({
    defaultValues: {
      fullName: doctor?.fullName || '',
      identificationNumber: doctor?.identificationNumber || undefined,
      specialty: doctor?.specialty || '',
      email: doctor?.email || '',
      availableFrom: doctor?.availableFrom || '08:00',
      availableTo: doctor?.availableTo || '17:00',
    },
  });
  
  const availableFrom = watch('availableFrom');
  const availableTo = watch('availableTo');
  
  const handleFormSubmit = async (data: DoctorDTO) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const specialtyOptions = [
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Endocrinology', label: 'Endocrinology' },
    { value: 'Gastroenterology', label: 'Gastroenterology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Obstetrics', label: 'Obstetrics' },
    { value: 'Oncology', label: 'Oncology' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Radiology', label: 'Radiology' },
    { value: 'Urology', label: 'Urology' },
  ];
  
  // Validate time range
  const isValidTimeRange = () => {
    if (!availableFrom || !availableTo) return true;
    
    const [fromHour, fromMinute] = availableFrom.split(':').map(Number);
    const [toHour, toMinute] = availableTo.split(':').map(Number);
    
    if (fromHour > toHour) return false;
    if (fromHour === toHour && fromMinute >= toMinute) return false;
    
    return true;
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Controller
        name="fullName"
        control={control}
        rules={{ 
          required: 'Full name is required',
          minLength: { value: 3, message: 'Name must be at least 3 characters' }
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Full Name"
            error={errors.fullName?.message}
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
          />
        )}
      />
      
      <Controller
        name="identificationNumber"
        control={control}
        rules={{ 
          required: 'ID number is required',
          validate: (value) => !isNaN(Number(value)) || 'Must be a number'
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Identification Number"
            type="number"
            error={errors.identificationNumber?.message}
            leftIcon={<Fingerprint className="h-5 w-5 text-gray-400" />}
          />
        )}
      />
      
      <Controller
        name="specialty"
        control={control}
        rules={{ required: 'Specialty is required' }}
        render={({ field }) => (
          <Select
            {...field}
            label="Specialty"
            options={specialtyOptions}
            error={errors.specialty?.message}
          />
        )}
      />
      
      <Controller
        name="email"
        control={control}
        rules={{ 
          required: 'Email is required',
          pattern: { 
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Email"
            type="email"
            error={errors.email?.message}
            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          />
        )}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="availableFrom"
          control={control}
          rules={{ required: 'Start time is required' }}
          render={({ field }) => (
            <Input
              {...field}
              label="Available From"
              type="time"
              error={errors.availableFrom?.message}
              leftIcon={<Clock className="h-5 w-5 text-gray-400" />}
            />
          )}
        />
        
        <Controller
          name="availableTo"
          control={control}
          rules={{ 
            required: 'End time is required',
            validate: () => isValidTimeRange() || 'End time must be after start time'
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Available To"
              type="time"
              error={errors.availableTo?.message}
              leftIcon={<Clock className="h-5 w-5 text-gray-400" />}
            />
          )}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {doctor ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default DoctorForm;