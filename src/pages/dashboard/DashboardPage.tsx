import React, { useEffect, useState } from 'react';
import { Users, UserRound, Calendar, Home } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import consultRoomService from '../../services/consultRoomService';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    consultRooms: 0,
    isLoading: true,
  });
  
  const [recentAppointments, setRecentAppointments] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patients, doctors, appointments, consultRooms] = await Promise.all([
          patientService.getAll(),
          doctorService.getAll(),
          appointmentService.getAll(),
          consultRoomService.getAll(),
        ]);
        
        setStats({
          patients: patients.length,
          doctors: doctors.length,
          appointments: appointments.length,
          consultRooms: consultRooms.length,
          isLoading: false,
        });
        
        // Get only the most recent 5 appointments
        const recent = appointments
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
          .slice(0, 5);
          
        setRecentAppointments(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchData();
  }, []);
  
  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  {stats.isLoading ? (
                    <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    count
                  )}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          count={stats.patients}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Doctors"
          count={stats.doctors}
          icon={UserRound}
          color="bg-green-500"
        />
        <StatCard
          title="Appointments"
          count={stats.appointments}
          icon={Calendar}
          color="bg-purple-500"
        />
        <StatCard
          title="Consult Rooms"
          count={stats.consultRooms}
          icon={Home}
          color="bg-orange-500"
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Appointments</h2>
        
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {stats.isLoading ? (
            <div className="animate-pulse p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentAppointments.length === 0 ? (
                <li className="px-6 py-4 text-sm text-gray-500">
                  No appointments found
                </li>
              ) : (
                recentAppointments.map((appointment) => (
                  <li key={appointment.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Appointment #{appointment.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.startTime).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 
                            appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                            appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;