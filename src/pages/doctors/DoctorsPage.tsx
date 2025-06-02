import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Mail, Clock, Edit, Trash2 } from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { DoctorDTO } from '../../types';
import doctorService from '../../services/doctorService';
import DoctorForm from './DoctorForm';

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<DoctorDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  
  useEffect(() => {
    fetchDoctors();
  }, []);
  
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await doctorService.getAll();
      setDoctors(data);
      
      // Extract unique specialties
      const uniqueSpecialties = [...new Set(data.map(doctor => doctor.specialty))];
      setSpecialties(uniqueSpecialties);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddDoctor = async (data: DoctorDTO) => {
    try {
      await doctorService.create(data);
      fetchDoctors();
      setShowAddModal(false);
      setSuccess('Doctor added successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to add doctor');
    }
  };
  
  const handleEditDoctor = async (data: DoctorDTO) => {
    if (!currentDoctor?.id) return;
    
    try {
      await doctorService.update(currentDoctor.id, data);
      fetchDoctors();
      setShowEditModal(false);
      setSuccess('Doctor updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update doctor');
    }
  };
  
  const handleDeleteDoctor = async () => {
    if (!currentDoctor?.id) return;
    
    try {
      await doctorService.delete(currentDoctor.id);
      fetchDoctors();
      setShowDeleteModal(false);
      setSuccess('Doctor deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete doctor');
    }
  };
  
  const filteredDoctors = doctors.filter((doctor) => {
  const fullName = doctor.fullName || '';
  const email = doctor.email || '';
  const specialty = doctor.specialty || '';

  const matchesSearch = 
    fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.toLowerCase().includes(searchTerm.toLowerCase())||
    doctor.id?.toString().includes(searchTerm.toLowerCase());

  const matchesSpecialty = specialtyFilter ? specialty === specialtyFilter : true;

  return matchesSearch && matchesSpecialty;
});

  
  const columns = [
     {
        key: 'id',
        header: 'ID',
        render: (doctor: DoctorDTO) => (
          <span className="font-mono text-sm text-gray-600">
            {doctor.id}
          </span>
        )
      },
    { key: 'fullName', header: 'Full Name' },
    { 
      key: 'specialty', 
      header: 'Specialty',
      render: (doctor: DoctorDTO) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {doctor.specialty}
        </span>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (doctor: DoctorDTO) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          <span>{doctor.email}</span>
        </div>
      ),
    },
    {
      key: 'availableHours',
      header: 'Available Hours',
      render: (doctor: DoctorDTO) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-gray-400 mr-2" />
          <span>{doctor.availableFrom} - {doctor.availableTo}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (doctor: DoctorDTO) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentDoctor(doctor);
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
              setCurrentDoctor(doctor);
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
  
  return (
    <DashboardLayout title="Doctors">
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
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          
          <div className="w-full sm:w-72">
            <Select
              options={[
                { value: '', label: 'All Specialties' },
                ...specialties.map(specialty => ({ value: specialty, label: specialty }))
              ]}
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            />
          </div>
        </div>
        
        <Button
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Doctor
        </Button>
      </div>
      
      <Table
        data={filteredDoctors}
        columns={columns}
        keyExtractor={(item) => item.id?.toString() || ''}
        isLoading={isLoading}
        emptyMessage="No doctors found"
        onRowClick={(doctor) => navigate(`/doctors/${doctor.id}`)}
      />
      
      {/* Add Doctor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Doctor"
      >
        <DoctorForm onSubmit={handleAddDoctor} onCancel={() => setShowAddModal(false)} />
      </Modal>
      
      {/* Edit Doctor Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Doctor"
      >
        <DoctorForm
          doctor={currentDoctor || undefined}
          onSubmit={handleEditDoctor}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Doctor"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this doctor? This action cannot be undone.
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
              onClick={handleDeleteDoctor}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default DoctorsPage;