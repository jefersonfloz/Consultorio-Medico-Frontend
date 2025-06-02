import React, { useState, useEffect } from 'react';
import { ConsultRoomDTO } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface ConsultRoomFormProps {
  room?: ConsultRoomDTO;
  onSubmit: (data: ConsultRoomDTO) => void;
  onCancel: () => void;
}

const ConsultRoomForm: React.FC<ConsultRoomFormProps> = ({
  room,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ConsultRoomDTO>({
    name: '',
    roomNumber: 0,
    floor: 1,
    description: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name || '',
        roomNumber: room.roomNumber || 0,
        floor: room.floor || 1,
        description: room.description || '',
      });
    }
  }, [room]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    }

    if (!formData.roomNumber || formData.roomNumber <= 0) {
      newErrors.roomNumber = 'Room number must be greater than 0';
    }

    if (!formData.floor || formData.floor < 0) {
      newErrors.floor = 'Floor must be 0 or greater';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ConsultRoomDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Room Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Enter room name (e.g., Consultation Room A)"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Room Number"
            type="number"
            value={formData.roomNumber}
            onChange={(e) => handleInputChange('roomNumber', parseInt(e.target.value) || 0)}
            error={errors.roomNumber}
            placeholder="101"
            min="1"
            required
          />
        </div>
        <div>
          <Input
            label="Floor"
            type="number"
            value={formData.floor}
            onChange={(e) => handleInputChange('floor', parseInt(e.target.value) || 0)}
            error={errors.floor}
            placeholder="1"
            min="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter room description, equipment, or special notes..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {room ? 'Update Room' : 'Add Room'}
        </Button>
      </div>
    </form>
  );
};

export default ConsultRoomForm;