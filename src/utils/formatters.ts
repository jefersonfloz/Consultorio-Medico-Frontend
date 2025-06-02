import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTime = (timeString: string): string => {
  try {
    return format(parseISO(`2023-01-01T${timeString}`), 'h:mm a');
  } catch (error) {
    return timeString;
  }
};

export const formatDateTime = (dateTimeString: string): string => {
  try {
    return format(parseISO(dateTimeString), 'MMM d, yyyy h:mm a');
  } catch (error) {
    return 'Invalid date/time';
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber;
};