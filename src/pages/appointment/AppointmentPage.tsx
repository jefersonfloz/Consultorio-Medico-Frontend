import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Calendar, Clock, Edit, Trash2, User, UserPlus } from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { AppointmentDTO, DoctorDTO, PatientDTO, ConsultRoomDTO } from '../../types';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import patientService from '../../services/patientService';
import consultRoomService from '../../services/consultRoomService';
import AppointmentForm from './AppointmentForm';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [consultRooms, setConsultRooms] = useState<ConsultRoomDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<AppointmentDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [appointmentsData, doctorsData, patientsData, consultRoomsData] = await Promise.all([
        appointmentService.getAll(),
        doctorService.getAll(),
        patientService.getAll(),
        consultRoomService.getAll(),
      ]);
      
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
      setPatients(patientsData);
      setConsultRooms(consultRoomsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAppointment = async (data: AppointmentDTO) => {
    try {
      await appointmentService.create(data);
      fetchData();
      setShowAddModal(false);
      setSuccess('Appointment added successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to add appointment');
    }
  };
  
  const handleEditAppointment = async (data: AppointmentDTO) => {
    if (!currentAppointment?.id) return;
    
    try {
      await appointmentService.update(currentAppointment.id, data);
      fetchData();
      setShowEditModal(false);
      setSuccess('Appointment updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update appointment');
    }
  };
  
  const handleDeleteAppointment = async () => {
    if (!currentAppointment?.id) return;
    
    try {
      await appointmentService.delete(currentAppointment.id);
      fetchData();
      setShowDeleteModal(false);
      setSuccess('Appointment deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete appointment');
    }
  };
  
  // Helper functions to find related data
  const findDoctor = (doctorId: number) => doctors.find(d => d.id === doctorId);
  const findPatient = (patientId: number) => patients.find(p => p.id === patientId);
  const findConsultRoom = (roomId: number) => consultRooms.find(r => r.id === roomId);
  
  const filteredAppointments = appointments.filter((appointment) => {
    const doctor = findDoctor(appointment.doctorId);
    const patient = findPatient(appointment.patientId);
    const doctorName = doctor?.fullName || '';
    const patientName = patient?.fullName || '';
    const status = appointment.status || '';

    const matchesSearch = 
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id?.toString().includes(searchTerm.toLowerCase());


    const matchesStatus = statusFilter ? status === statusFilter : true;
    const matchesDoctor = doctorFilter ? appointment.doctorId.toString() === doctorFilter : true;

    return matchesSearch && matchesStatus && matchesDoctor;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };
  
  const columns = [
     {
    key: 'id',
    header: 'ID',
    render: (appointment: AppointmentDTO) => (
      <span className="font-mono text-sm text-gray-600">
        {appointment.id}
      </span>
    )
  },
    {
      key: 'patient',
      header: 'Patient',
      render: (appointment: AppointmentDTO) => {
        const patient = findPatient(appointment.patientId);
        return (
          <div className="flex items-center">
            <UserPlus className="h-4 w-4 text-gray-400 mr-2" />
            <span>{patient?.fullName || 'Unknown Patient'}</span>
          </div>
        );
      }
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (appointment: AppointmentDTO) => {
        const doctor = findDoctor(appointment.doctorId);
        return (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <div>{doctor?.fullName || 'Unknown Doctor'}</div>
              <div className="text-xs text-gray-500">{doctor?.specialty}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'dateTime',
      header: 'Date & Time',
      render: (appointment: AppointmentDTO) => {
        const start = formatDateTime(appointment.startTime);
        const end = formatDateTime(appointment.endTime);
        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <div>
              <div>{start.date}</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {start.time} - {end.time}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'consultRoom',
      header: 'Room',
      render: (appointment: AppointmentDTO) => {
        const room = findConsultRoom(appointment.consultRoomId);
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
            {room?.name || 'Unknown Room'}
          </span>
        );
      }
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (appointment: AppointmentDTO) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
          {appointment.status.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (appointment: AppointmentDTO) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentAppointment(appointment);
              setShowEditModal(true);
            }}
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentAppointment(appointment);
              setShowDeleteModal(true);
            }}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  
  // Prepare options for form
  const doctorOptions = doctors.map(doctor => ({
    value: doctor.id!,
    label: `${doctor.fullName} - ${doctor.specialty}`
  }));
  
  const patientOptions = patients.map(patient => ({
    value: patient.id!,
    label: patient.fullName
  }));
  
  const consultRoomOptions = consultRooms.map(room => ({
    value: room.id!,
    label: room.name
  }));
  
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];
  
  const doctorFilterOptions = [
    { value: '', label: 'All Doctors' },
    ...doctors.map(doctor => ({
      value: doctor.id!.toString(),
      label: doctor.fullName
    }))
  ];
  
  return (
    <DashboardLayout title="Appointments">
      {error && (
        <div className="mb-4">
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}
      
      {success && (
        <div className="mb-4">
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select
              options={doctorFilterOptions}
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            />
          </div>
        </div>
        
        <Button
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Appointment
        </Button>
      </div>
      
      <Table
        data={filteredAppointments}
        columns={columns}
        keyExtractor={(item) => item.id?.toString() || ''}
        isLoading={isLoading}
        emptyMessage="No appointments found"
        onRowClick={(appointment) => navigate(`/appointments/${appointment.id}`)}
      />
      
      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Appointment"
      >
        <AppointmentForm
          onSubmit={handleAddAppointment}
          onCancel={() => setShowAddModal(false)}
          doctorOptions={doctorOptions}
          patientOptions={patientOptions}
          consultRoomOptions={consultRoomOptions}
        />
      </Modal>
      
      {/* Edit Appointment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Appointment"
      >
        <AppointmentForm
          appointment={currentAppointment || undefined}
          onSubmit={handleEditAppointment}
          onCancel={() => setShowEditModal(false)}
          doctorOptions={doctorOptions}
          patientOptions={patientOptions}
          consultRoomOptions={consultRoomOptions}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Appointment"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this appointment? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAppointment}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AppointmentsPage;