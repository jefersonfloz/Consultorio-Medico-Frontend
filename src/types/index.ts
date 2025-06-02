// Auth Types
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
  type: string;
}

// Patient Types
export interface PatientDTO {
  id?: number;
  fullName: string;
  identificationNumber: number;
  email: string;
  phoneNumber: string;
}

// Doctor Types
export interface DoctorDTO {
  id?: number;
  fullName: string;
  identificationNumber: number;
  specialty: string;
  email: string;
  availableFrom: string;
  availableTo: string;
}

// Appointment Types
export interface AppointmentDTO {
  id?: number;
  patientId: number;
  doctorId: number;
  consultRoomId: number;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

// Consult Room Types
export interface ConsultRoomDTO {
  id?: number;
  name: string;
  roomNumber: number;
  floor: number;
  description: string;
}

// Medical Record Types
export interface MedicalRecordDTO {
  id?: number;
  appointmentId: number;
  patientId: number;
  diagnosis: string;
  notes: string;
  createdAt: string;
}

// Common API Response Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}