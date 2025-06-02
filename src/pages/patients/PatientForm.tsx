import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { User, Mail, Phone, Fingerprint } from 'lucide-react';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { PatientDTO } from '../../types';

interface PatientFormProps {
  patient?: PatientDTO;
  onSubmit: (data: PatientDTO) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<PatientDTO>({
    defaultValues: {
      fullName: patient?.fullName || '',
      identificationNumber: patient?.identificationNumber || undefined,
      email: patient?.email || '',
      phoneNumber: patient?.phoneNumber || '',
    },
  });
  
  const handleFormSubmit = async (data: PatientDTO) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
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
      
      <Controller
        name="phoneNumber"
        control={control}
        rules={{ 
          required: 'Phone number is required',
          pattern: { 
            value: /^\d{10}$/,
            message: 'Phone number must be 10 digits'
          }
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Phone Number"
            error={errors.phoneNumber?.message}
            leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
          />
        )}
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {patient ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;