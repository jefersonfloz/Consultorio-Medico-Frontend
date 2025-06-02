import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { MedicalRecordDTO } from '../../types';
import medicalRecordService from '../../services/medicalRecordService';

const MedicalRecordsPage = () => {
  const navigate = useNavigate();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientIdSearch, setPatientIdSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecordDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    setIsLoading(true);
    try {
      const records = await medicalRecordService.getAll();
      setMedicalRecords(records);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch medical records');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecordsByPatient = async () => {
    if (!patientIdSearch.trim()) return;
    setIsLoading(true);
    try {
      const records = await medicalRecordService.getByPatientId(Number(patientIdSearch));
      setMedicalRecords(records);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patient medical records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentRecord?.id) return;
    try {
      await medicalRecordService.delete(currentRecord.id);
      fetchAllRecords();
      setShowDeleteModal(false);
      setSuccess('Medical record deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete medical record');
    }
  };

  const filteredRecords = medicalRecords.filter((record) =>
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toString().includes(searchTerm)
  );

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (record: MedicalRecordDTO) => (
        <span className="font-mono text-sm text-gray-600">{record.id}</span>
      )
    },
    {
      key: 'patientId',
      header: 'Patient ID',
      render: (record: MedicalRecordDTO) => <span>{record.patientId}</span>
    },
    {
      key: 'diagnosis',
      header: 'Diagnosis',
      render: (record: MedicalRecordDTO) => <span>{record.diagnosis}</span>
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (record: MedicalRecordDTO) => (
        <span className="whitespace-normal break-words max-w-xs block">
          {record.notes}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (record: MedicalRecordDTO) =>
        <span>{new Date(record.createdAt).toLocaleString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (record: MedicalRecordDTO) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentRecord(record);
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
              setCurrentRecord(record);
              setShowDeleteModal(true);
            }}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Medical Records">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            placeholder="Search medical Records ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            placeholder="Patient ID"
            type="number"
            value={patientIdSearch}
            onChange={(e) => setPatientIdSearch(e.target.value)}
          />
         <Button onClick={fetchRecordsByPatient}>
            Filter Patient
          </Button>
          <Button variant="outline" onClick={() => {
            setPatientIdSearch('');
            fetchAllRecords();
          }}>
            Show All
          </Button>
        </div>

        <Button
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Medical Record
        </Button>
      </div>

      <Table
        data={filteredRecords}
        columns={columns}
        keyExtractor={(item) => item.id?.toString() || ''}
        isLoading={isLoading}
        emptyMessage="No medical records found"
        onRowClick={(record) => navigate(`/medical-records/${record.id}`)}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Medical Record"
      >
        <p>Are you sure you want to delete this medical record?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default MedicalRecordsPage;
