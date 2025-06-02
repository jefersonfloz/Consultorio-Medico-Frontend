export const required = (value: any) => (value ? undefined : 'This field is required');

export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `Must be at least ${min} characters` : undefined;

export const maxLength = (max: number) => (value: string) =>
  value && value.length > max ? `Must be less than ${max} characters` : undefined;

export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const number = (value: string) =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const phoneNumber = (value: string) =>
  value && !/^\d{10}$/.test(value.replace(/\D/g, ''))
    ? 'Must be a valid 10-digit phone number'
    : undefined;

export const composeValidators = (...validators: any[]) => (value: any) =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export const validateTimeRange = (startTime: string, endTime: string): boolean => {
  if (!startTime || !endTime) return false;
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  if (startHour > endHour) return false;
  if (startHour === endHour && startMinute >= endMinute) return false;
  
  return true;
};

export const validateDateTimeRange = (startDateTime: string, endDateTime: string): boolean => {
  if (!startDateTime || !endDateTime) return false;
  
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  
  return start < end;
};