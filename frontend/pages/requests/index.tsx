import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';
import {
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  MapPin,
  User,
} from 'lucide-react';
import type { MaintenanceRequest } from '@/types';

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  icon: any;
  color: string;
}

export default function RequestsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [draggedCard, setDraggedCard] = useState<MaintenanceRequest | null>(null);

  // TEMPORARY: Auth disabled for preview
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await requestsAPI.getAll();
      return response.data;
    },
    enabled: false, // Disabled for preview
  });

  // TEMPORARY: Mock data for preview
  const mockRequests: any[] = [
    {
      id: 1,
      equipment_name: 'CNC Machine #1',
      request_type: 'corrective',
      priority: 'high',
      status: 'new',
      created_at: '2025-12-27T09:00:00',
      team_name: 'Mechanical Team',
      team_color: '#ef4444',
      technician_name: 'John Doe'
    },
    {
      id: 2,
      equipment_name: 'Forklift A-203',
      request_type: 'corrective',
      priority: 'high',
      status: 'in_progress',
      created_at: '2025-12-26T14:30:00',
      scheduled_date: '2025-12-27',
      team_name: 'Mechanical Team',
      team_color: '#ef4444',
      technician_name: 'John Doe'
    },
    {
      id: 3,
      equipment_name: 'HVAC Unit B',
      request_type: 'preventive',
      priority: 'medium',
      status: 'in_progress',
      created_at: '2025-12-25T10:00:00',
      scheduled_date: '2025-12-28',
      team_name: 'Electrical Team',
      team_color: '#f97316',
      technician_name: 'Jane Smith'
    },
    {
      id: 4,
      equipment_name: 'Printer HP-502',
      request_type: 'corrective',
      priority: 'low',
      status: 'repaired',
      created_at: '2025-12-24T11:20:00',
      completed_at: '2025-12-26T15:45:00',
      team_name: 'IT Support',
      team_color: '#3b82f6',
      technician_name: 'Mike Johnson'
    },
    {
      id: 5,
      equipment_name: 'Old Equipment',
      request_type: 'corrective',
      priority: 'high',
      status: 'scrap',
      created_at: '2025-12-20T08:00:00',
      completed_at: '2025-12-22T16:00:00',
      team_name: 'Mechanical Team',
      team_color: '#ef4444',
      technician_name: 'John Doe'
    }
  ];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      requestsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request updated successfully');
    },
    onError: () => {
      toast.error('Failed to update request');
    },
  });

  const columns: KanbanColumn[] = [
    {
      id: 'new',
      title: 'New',
      status: 'new',
      icon: AlertCircle,
      color: 'border-yellow-400 bg-yellow-50',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      status: 'in_progress',
      icon: Clock,
      color: 'border-blue-400 bg-blue-50',
    },
    {
      id: 'repaired',
      title: 'Repaired',
      status: 'repaired',
      icon: CheckCircle2,
      color: 'border-green-400 bg-green-50',
    },
    {
      id: 'scrap',
      title: 'Scrap',
      status: 'scrap',
      icon: XCircle,
      color: 'border-red-400 bg-red-50',
    },
  ];

  const requests: MaintenanceRequest[] = requestsData?.requests || mockRequests; // Use mock data for preview

  const getRequestsByStatus = (status: string) => {
    return requests.filter((r) => r.status === status);
  };

  const handleDragStart = (request: MaintenanceRequest) => {
    setDraggedCard(request);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedCard && draggedCard.status !== status) {
      updateMutation.mutate({
        id: draggedCard.id,
        data: { status },
      });
    }
    setDraggedCard(null);
  };

  const isOverdue = (scheduledDate?: string) => {
    if (!scheduledDate) return false;
    return new Date(scheduledDate) < new Date();
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600 mt-1">Track and manage all maintenance work</p>
          </div>
          <button
            onClick={() => router.push('/requests/new')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-32 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => {
              const Icon = column.icon;
              const columnRequests = getRequestsByStatus(column.status);

              return (
                <div
                  key={column.id}
                  className={`bg-white rounded-lg shadow-sm border-t-4 ${column.color}`}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.status)}
                >
                  {/* Column Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      </div>
                      <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">
                        {columnRequests.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="p-4 space-y-3 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto">
                    {columnRequests.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">
                        No requests
                      </p>
                    ) : (
                      columnRequests.map((request) => (
                        <div
                          key={request.id}
                          draggable
                          onDragStart={() => handleDragStart(request)}
                          onClick={() => router.push(`/requests/${request.id}`)}
                          className={`bg-white border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow ${
                            isOverdue(request.scheduled_date) && request.status !== 'repaired'
                              ? 'border-red-400 bg-red-50'
                              : 'border-gray-200'
                          }`}
                        >
                          {/* Request Type Badge */}
                          <div className="flex items-start justify-between mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                request.request_type === 'preventive'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {request.request_type}
                            </span>
                            {request.priority === 'high' || request.priority === 'critical' ? (
                              <span className="text-red-500">
                                <AlertCircle className="w-4 h-4" />
                              </span>
                            ) : null}
                          </div>

                          {/* Subject */}
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {request.subject}
                          </h4>

                          {/* Equipment */}
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {request.equipment_name}
                          </p>

                          {/* Team Color Indicator */}
                          {request.team_color && (
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: request.team_color }}
                              />
                              <span className="text-xs text-gray-500">{request.team_name}</span>
                            </div>
                          )}

                          {/* Technician */}
                          {request.technician_name && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                {request.technician_avatar ? (
                                  <img
                                    src={request.technician_avatar}
                                    alt={request.technician_name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                ) : (
                                  <span className="text-xs text-primary-700">
                                    {request.technician_name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-600 truncate">
                                {request.technician_name}
                              </span>
                            </div>
                          )}

                          {/* Scheduled Date */}
                          {request.scheduled_date && (
                            <div
                              className={`flex items-center gap-1 text-xs mt-2 ${
                                isOverdue(request.scheduled_date) && request.status !== 'repaired'
                                  ? 'text-red-600 font-medium'
                                  : 'text-gray-500'
                              }`}
                            >
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(request.scheduled_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
