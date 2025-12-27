import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { equipmentAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import {
  Package,
  MapPin,
  Calendar,
  Shield,
  Users,
  Wrench,
  Edit,
  ArrowLeft,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  User,
} from 'lucide-react';
import type { Equipment, MaintenanceRequest } from '@/types';

export default function EquipmentDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['equipment', id],
    queryFn: async () => {
      const response = await equipmentAPI.getById(Number(id));
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  const equipment: Equipment = data?.equipment;
  const maintenanceHistory: MaintenanceRequest[] = data?.maintenance_history || [];
  
  const openRequests = maintenanceHistory.filter(
    (r) => r.status === 'new' || r.status === 'in_progress'
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'repaired':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'scrap':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      repaired: 'bg-green-100 text-green-800 border-green-200',
      scrap: 'bg-red-100 text-red-800 border-red-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      scrapped: 'bg-red-100 text-red-800 border-red-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{equipment?.name}</h1>
              <p className="text-gray-600 mt-1">Equipment Details & Maintenance History</p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/equipment/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Equipment Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{equipment?.name}</h2>
                <p className="text-gray-500">{equipment?.serial_number}</p>
              </div>
            </div>
            {getStatusBadge(equipment?.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Category</span>
              </div>
              <p className="text-gray-900 font-medium">{equipment?.category || 'N/A'}</p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="text-gray-900 font-medium">
                {[equipment?.building, equipment?.room, equipment?.location]
                  .filter(Boolean)
                  .join(', ') || 'N/A'}
              </p>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Department</span>
              </div>
              <p className="text-gray-900 font-medium">{equipment?.department || 'N/A'}</p>
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Purchase Date</span>
              </div>
              <p className="text-gray-900 font-medium">
                {equipment?.purchase_date
                  ? new Date(equipment.purchase_date).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            {/* Warranty */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Warranty Expiry</span>
              </div>
              <p className="text-gray-900 font-medium">
                {equipment?.warranty_expiry
                  ? new Date(equipment.warranty_expiry).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Assigned To</span>
              </div>
              <p className="text-gray-900 font-medium">{equipment?.assigned_to_name || 'N/A'}</p>
            </div>

            {/* Maintenance Team */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Maintenance Team</span>
              </div>
              <p className="text-gray-900 font-medium">{equipment?.team_name || 'N/A'}</p>
            </div>

            {/* Default Technician */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Wrench className="w-4 h-4" />
                <span className="text-sm font-medium">Default Technician</span>
              </div>
              <p className="text-gray-900 font-medium">
                {equipment?.default_technician_name || 'N/A'}
              </p>
            </div>
          </div>

          {equipment?.notes && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Notes</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{equipment.notes}</p>
            </div>
          )}
        </div>

        {/* Smart Button - Maintenance Requests */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Maintenance Requests</h2>
                <p className="text-sm text-gray-600">
                  {maintenanceHistory.length} total requests | {openRequests.length} open
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                router.push(`/requests/new?equipment_id=${id}`)
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              New Request
            </button>
          </div>

          {/* Open Requests Alert */}
          {openRequests.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  {openRequests.length} open maintenance request{openRequests.length > 1 ? 's' : ''} require
                  attention
                </span>
              </div>
            </div>
          )}

          {/* Maintenance History Table */}
          <div className="overflow-x-auto">
            {maintenanceHistory.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No maintenance requests yet</p>
                <button
                  onClick={() =>
                    router.push(`/requests/new?equipment_id=${id}`)
                  }
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create first request
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceHistory.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() => router.push(`/requests/${request.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.subject}</div>
                        {request.team_name && (
                          <div className="text-xs text-gray-500">{request.team_name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {request.request_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.technician_name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.duration_hours ? `${request.duration_hours}h` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
