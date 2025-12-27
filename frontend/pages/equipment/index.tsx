import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Wrench,
} from 'lucide-react';
import type { Equipment } from '@/types';

export default function EquipmentPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // TEMPORARY: Auth disabled for preview
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  const { data: equipmentData, isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const response = await equipmentAPI.getAll();
      return response.data;
    },
    enabled: false, // Disabled for preview
  });

  // TEMPORARY: Mock data for preview
  const mockEquipment: any[] = [
    {
      id: 1,
      name: 'CNC Machine #1',
      serial_number: 'CNC-2023-001',
      category: 'machinery',
      status: 'operational',
      location: 'Building A',
      department: 'Manufacturing',
      maintenance_team_name: 'Mechanical Team',
      open_requests: 2,
      total_requests: 15
    },
    {
      id: 2,
      name: 'Forklift A-203',
      serial_number: 'FLT-2022-203',
      category: 'vehicle',
      status: 'maintenance',
      location: 'Warehouse 1',
      department: 'Logistics',
      maintenance_team_name: 'Mechanical Team',
      open_requests: 1,
      total_requests: 8
    },
    {
      id: 3,
      name: 'Printer HP-502',
      serial_number: 'PRN-HP-502',
      category: 'printer',
      status: 'operational',
      location: 'Building B - Floor 2',
      department: 'Administration',
      maintenance_team_name: 'IT Support',
      open_requests: 0,
      total_requests: 5
    },
    {
      id: 4,
      name: 'HVAC Unit B',
      serial_number: 'HVAC-2021-B02',
      category: 'hvac',
      status: 'operational',
      location: 'Building B',
      department: 'Facilities',
      maintenance_team_name: 'Electrical Team',
      open_requests: 0,
      total_requests: 12
    },
    {
      id: 5,
      name: 'Generator Main',
      serial_number: 'GEN-2020-MAIN',
      category: 'electrical',
      status: 'down',
      location: 'Power House',
      department: 'Facilities',
      maintenance_team_name: 'Electrical Team',
      open_requests: 3,
      total_requests: 20
    }
  ];

  const equipment: Equipment[] = equipmentData?.equipment || mockEquipment; // Use mock data for preview

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      toast.error('Delete disabled in preview mode');
    }
  };

  const handleView = (id: number) => {
    router.push(`/equipment/${id}`);
  };

  // TEMPORARY: Removed for preview mode
  // if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Equipment Management</h1>
            <p className="text-gray-600 mt-1">Manage all company assets and equipment</p>
          </div>
          <button
            onClick={() => {
              setSelectedEquipment(null);
              router.push('/equipment/new');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, serial number, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first equipment'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push('/equipment/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5" />
                Add Equipment
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      {item.serial_number && (
                        <p className="text-sm text-gray-500">SN: {item.serial_number}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {item.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.department && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{item.department}</span>
                      </div>
                    )}
                    {item.team_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Wrench className="w-4 h-4" />
                        <span>{item.team_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Maintenance Stats */}
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {item.open_requests || 0}
                      </p>
                      <p className="text-xs text-gray-500">Open Requests</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {item.total_requests || 0}
                      </p>
                      <p className="text-xs text-gray-500">Total Requests</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleView(item.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
