import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Mail, Phone, Edit, Trash2 } from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { PatientDTO } from '../../types';
import patientService from '../../services/patientService';
import PatientForm from './PatientForm';

const PatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<PatientDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddPatient = async (data: PatientDTO) => {
    try {
      await patientService.create(data);
      fetchPatients();
      setShowAddModal(false);
      setSuccess('Patient added successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to add patient');
    }
  };
  
  const handleEditPatient = async (data: PatientDTO) => {
    if (!currentPatient?.id) return;
    
    try {
      await patientService.update(currentPatient.id, data);
      fetchPatients();
      setShowEditModal(false);
      setSuccess('Patient updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update patient');
    }
  };
  
  const handleDeletePatient = async () => {
    if (!currentPatient?.id) return;
    
    try {
      await patientService.delete(currentPatient.id);
      fetchPatients();
      setShowDeleteModal(false);
      setSuccess('Patient deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete patient');
    }
  };
  
  const filteredPatients = patients.filter(
  (patient) =>
    patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber?.includes(searchTerm) ||
    patient.id?.toString().includes(searchTerm.toLowerCase())
);

  
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (patient: PatientDTO) => (
        <span className="font-mono text-sm text-gray-600">
            {patient.id}
        </span>
        )
    },
    { key: 'fullName', header: 'Full Name' },
    { key: 'identificationNumber', header: 'ID Number' },
    {
      key: 'email',
      header: 'Email',
      render: (patient: PatientDTO) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          <span>{patient.email}</span>
        </div>
      ),
    },
    {
      key: 'phoneNumber',
      header: 'Phone',
      render: (patient: PatientDTO) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span>{patient.phoneNumber}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (patient: PatientDTO) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPatient(patient);
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
              setCurrentPatient(patient);
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
    <DashboardLayout title="Patients">
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
        <div className="mb-4 sm:mb-0 w-full sm:w-72">
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        <Button
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Patient
        </Button>
      </div>
      
      <Table
        data={filteredPatients}
        columns={columns}
        keyExtractor={(item) => item.id?.toString() || ''}
        isLoading={isLoading}
        emptyMessage="No patients found"
        onRowClick={(patient) => navigate(`/patients/${patient.id}`)}
      />
      
      {/* Add Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
      >
        <PatientForm onSubmit={handleAddPatient} onCancel={() => setShowAddModal(false)} />
      </Modal>
      
      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Patient"
      >
        <PatientForm
          patient={currentPatient || undefined}
          onSubmit={handleEditPatient}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Patient"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this patient? This action cannot be undone.
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
              onClick={handleDeletePatient}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default PatientsPage;