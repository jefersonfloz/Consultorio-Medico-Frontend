import React, { useEffect, useState } from 'react';
import { PlusCircle, Search, Edit, Trash2, Home, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';

import { ConsultRoomDTO } from '../../types';
import consultRoomService from '../../services/consultRoomService';
import ConsultRoomForm from './ConsultRoomForm';

const ConsultRoomsPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ConsultRoomDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [currentRoom, setCurrentRoom] = useState<ConsultRoomDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await consultRoomService.getAll();
      setRooms(data);
    } catch (err: any) {
      setError(err?.message || 'Error fetching rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (type: 'add' | 'edit' | 'delete', room?: ConsultRoomDTO) => {
    setCurrentRoom(room || null);
    setModals({ add: false, edit: false, delete: false, [type]: true });
  };

  const closeModal = () => {
    setModals({ add: false, edit: false, delete: false });
    setCurrentRoom(null);
  };

  const handleAddRoom = async (data: ConsultRoomDTO) => {
    try {
      await consultRoomService.create(data);
      fetchRooms();
      closeModal();
      setSuccess('Consult room added successfully.');
    } catch (err: any) {
      setError(err?.message || 'Error adding consult room.');
    }
  };

  const handleEditRoom = async (data: ConsultRoomDTO) => {
    if (!currentRoom?.id) return;
    try {
      await consultRoomService.update(currentRoom.id, data);
      fetchRooms();
      closeModal();
      setSuccess('Consult room updated successfully.');
    } catch (err: any) {
      setError(err?.message || 'Error updating consult room.');
    }
  };

  const handleDeleteRoom = async () => {
    if (!currentRoom?.id) return;
    try {
      await consultRoomService.delete(currentRoom.id);
      fetchRooms();
      closeModal();
      setSuccess('Consult room deleted successfully.');
    } catch (err: any) {
      setError(err?.message || 'Error deleting consult room.');
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const content = `${room.name ?? ''} ${room.description ?? ''} ${room.id ?? ''}`.toLowerCase();
    return content.includes(searchTerm.toLowerCase());
  });

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (room: ConsultRoomDTO) => (
        <span className="font-mono text-sm text-gray-600">{room.id}</span>
      ),
    },
    { key: 'name', header: 'Room Name' },
    {
      key: 'roomNumber',
      header: 'Number',
      render: (room: ConsultRoomDTO) => (
        <div className="flex items-center">
          <Home className="h-4 w-4 text-gray-400 mr-1" />
          {room.roomNumber}
        </div>
      ),
    },
    {
      key: 'floor',
      header: 'Floor',
      render: (room: ConsultRoomDTO) => `Floor ${room.floor}`,
    },
    {
      key: 'description',
      header: 'Description',
      render: (room: ConsultRoomDTO) => (
        <div className="flex items-center max-w-xs">
          <FileText className="h-4 w-4 text-gray-400 mr-2" />
          <span className="truncate">{room.description}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (room: ConsultRoomDTO) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openModal('edit', room);
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
              openModal('delete', room);
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
    <DashboardLayout title="Consult Rooms">
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0 w-full sm:w-72">
            <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
        </div>
            <Button
                leftIcon={<PlusCircle className="h-5 w-5" />}
                onClick={() => openModal('add')}
            >
                Add Room
            </Button>
    </div>

 

      <Table
        data={filteredRooms}
        columns={columns}
        keyExtractor={(item) => item.id?.toString() || ''}
        isLoading={isLoading}
        emptyMessage="No consult rooms found"
        onRowClick={(room) => navigate(`/consult-rooms/${room.id}`)}
      />

      {/* Add Modal */}
      <Modal isOpen={modals.add} onClose={closeModal} title="Add New Room">
        <ConsultRoomForm onSubmit={handleAddRoom} onCancel={closeModal} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={modals.edit} onClose={closeModal} title="Edit Room">
        <ConsultRoomForm
          room={currentRoom || undefined}
          onSubmit={handleEditRoom}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={modals.delete} onClose={closeModal} title="Delete Room">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this consult room? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteRoom}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ConsultRoomsPage;
